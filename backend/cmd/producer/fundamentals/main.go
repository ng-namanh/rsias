package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ng-namanh/rsias/backend/internal/models"
	"github.com/ng-namanh/rsias/backend/internal/services"
)

func main() {
	kafkaBrokers := os.Getenv("KAFKA_BROKERS")
	if kafkaBrokers == "" {
		kafkaBrokers = "localhost:9092"
	}

	producer := services.NewKafkaProducer([]string{kafkaBrokers}, "news.fundamentals")
	defer producer.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-sigChan
		cancel()
	}()

	// Polling once every 24 hours (simulated as 10 minutes for dev)
	ticker := time.NewTicker(10 * time.Minute)
	defer ticker.Stop()

	log.Println("Fundamentals Producer started...")

	// Initial fetch
	fetchAndProduceFundamentals(ctx, producer)

	for {
		select {
		case <-ctx.Done():
			log.Println("Fundamentals Producer shutting down...")
			return
		case <-ticker.C:
			fetchAndProduceFundamentals(ctx, producer)
		}
	}
}

func fetchAndProduceFundamentals(ctx context.Context, producer *services.KafkaProducer) {
	// Mock fetching fundamentals for AAPL, TSLA, NVDA
	tickers := []string{"AAPL", "TSLA", "NVDA"}
	
	for _, ticker := range tickers {
		mockFund := models.Company{
			Symbol: ticker,
			Name:   ticker + " Inc.",
			Sector: stringPtr("Technology"),
			MarketCap: int64Ptr(2500000000000),
			PERatio: floatPtr(30.5),
			RevenueGrowth: floatPtr(12.5),
			UpdatedAt: time.Now(),
		}

		data, err := json.Marshal(mockFund)
		if err != nil {
			log.Printf("Error marshaling fundamentals for %s: %v", ticker, err)
			continue
		}

		err = producer.SendMessage(ctx, []byte(ticker), data)
		if err != nil {
			log.Printf("Error sending fundamentals to Kafka: %v", err)
		}
	}
}

func stringPtr(s string) *string { return &s }
func int64Ptr(i int64) *int64 { return &i }
func floatPtr(f float64) *float64 { return &f }
