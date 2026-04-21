package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/ng-namanh/rsias/backend/internal/news"
	"github.com/ng-namanh/rsias/backend/internal/shared/config"
	"github.com/ng-namanh/rsias/backend/internal/shared/database"
)

func main() {
	cfg := config.Load()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	pool, err := database.NewPostgresPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer pool.Close()

	brokers := []string{cfg.KafkaBrokers}
	worker := news.NewPersistenceWorker(brokers, "news.enriched", pool)
	defer worker.Close()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-sigChan
		cancel()
	}()

	worker.Run(ctx)
}