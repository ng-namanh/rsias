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

	producer := services.NewKafkaProducer([]string{kafkaBrokers}, "news.raw")
	defer producer.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-sigChan
		cancel()
	}()

	ticker := time.NewTicker(2 * time.Minute)
	defer ticker.Stop()

	log.Println("News Producer started...")

	for {
		select {
		case <-ctx.Done():
			log.Println("News Producer shutting down...")
			return
		case <-ticker.C:
			fetchAndProduceNews(ctx, producer)
		}
	}
}

func fetchAndProduceNews(ctx context.Context, producer *services.KafkaProducer) {
	// Mock fetching news for now
	// In reality, this would call Alpha Vantage or NewsAPI
	mockNews := []models.NewsArticle{
		{
			SourceName:  "MarketWatch",
			Headline:    "Tech Stocks Rally on Innovation Hopes",
			URL:         "https://example.com/tech-rally-" + time.Now().Format("20060102150405"),
			PublishedAt: time.Now(),
		},
		{
			SourceName:  "Reuters",
			Headline:    "Global Markets Brace for Central Bank Decision",
			URL:         "https://example.com/macro-decision-" + time.Now().Format("20060102150405"),
			PublishedAt: time.Now(),
		},
	}

	for _, article := range mockNews {
		data, err := json.Marshal(article)
		if err != nil {
			log.Printf("Error marshaling news: %v", err)
			continue
		}

		err = producer.SendMessage(ctx, []byte(article.URL), data)
		if err != nil {
			log.Printf("Error sending news to Kafka: %v", err)
		}
	}
}
