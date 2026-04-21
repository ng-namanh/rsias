package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ng-namanh/rsias/backend/internal/company"
	"github.com/ng-namanh/rsias/backend/internal/market"
	"github.com/ng-namanh/rsias/backend/internal/news"
	"github.com/ng-namanh/rsias/backend/internal/shared/config"
	"github.com/ng-namanh/rsias/backend/internal/shared/database"
	"github.com/ng-namanh/rsias/backend/internal/shared/middleware"
	"github.com/ng-namanh/rsias/backend/internal/shared/websocket"
)

func main() {
	// ── 1. Load Configuration ────────────────────────────────────────────
	cfg := config.Load()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// ── 2. Connect to PostgreSQL ─────────────────────────────────────────
	pool, err := database.NewPostgresPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Printf("Warning: Could not connect to PostgreSQL: %v (continuing without DB)", err)
		pool = nil
	} else {
		defer pool.Close()
		log.Println("Connected to PostgreSQL")
	}

	// ── 3. Construct Services (Dependency Injection) ─────────────────────

	// Market module (no DB dependency — uses go-yfinance directly)
	marketSvc := market.NewMarketService()

	// Company module (depends on PostgreSQL)
	var companySvc *company.CompanyService
	if pool != nil {
		companyRepo := company.NewPostgresCompanyRepository(pool)
		companySvc = company.NewCompanyService(companyRepo)
	}

	// News module (depends on PostgreSQL)
	var newsSvc *news.NewsService
	if pool != nil {
		newsRepo := news.NewPostgresNewsRepository(pool)
		newsSvc = news.NewNewsService(newsRepo)
	}

	// ── 4. WebSocket Hub + Kafka Consumers ───────────────────────────────
	wsHub := websocket.NewHub()
	brokers := strings.Split(cfg.KafkaBrokers, ",")

	go wsHub.ConsumeAndBroadcast(ctx, brokers, "market.ticks")
	go wsHub.ConsumeAndBroadcast(ctx, brokers, "news.enriched")
	go wsHub.ConsumeAndBroadcast(ctx, brokers, "news.fundamentals")

	// ── 5. Create Gin Router ─────────────────────────────────────────────
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	// WebSocket endpoint (outside API group)
	router.GET("/ws", wsHub.HandleWebSocket)

	// API v1 route group
	v1 := router.Group("/api/v1")

	// Register business modules
	market.RegisterRoutes(v1, marketSvc)
	if companySvc != nil {
		company.RegisterRoutes(v1, companySvc)
	}
	if newsSvc != nil {
		news.RegisterRoutes(v1, newsSvc)
	}

	// ── 6. Start Server with Graceful Shutdown ───────────────────────────
	srv := &http.Server{
		Addr:    ":" + cfg.BFFPort,
		Handler: router,
	}

	go func() {
		log.Printf("BFF server starting on :%s", cfg.BFFPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	cancel() // Stop Kafka consumers

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}
	log.Println("Server exited cleanly")
}
