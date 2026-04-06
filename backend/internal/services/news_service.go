package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/ng-namanh/rsias/backend/internal/grpc/proto"
)

// NewsService handles the ingestion of global news headlines
type NewsService struct {
	producer *KafkaProducer
}

// NewNewsService creates a new news ingestion service
func NewNewsService(producer *KafkaProducer) *NewsService {
	return &NewsService{
		producer: producer,
	}
}

// StartSimulatedNewsStream simulates a news feed for development
func (n *NewsService) StartSimulatedNewsStream(ctx context.Context) {
	log.Println("Starting simulated news ingestion...")
	
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	headlines := []string{
		"Fed Signals Possible Rate Cut in Q3",
		"Tech Giants Face New Antitrust Probe",
		"Oil Prices Surge AMid Geopolitical Tensions",
		"New Green Energy Policy Announced",
		"Market Volatility Hits 6-Month High",
	}

	tickers := []string{"AAPL", "TSLA", "GOOGL", "AMZN", "MSFT"}

	for {
		select {
		case <-ctx.Done():
			log.Println("Stopping news ingestion...")
			return
		case t := <-ticker.C:
			// Pick a random headline and ticker
			headline := headlines[t.Unix()%int64(len(headlines))]
			tickerSym := tickers[t.Unix()%int64(len(tickers))]

			news := &proto.NewsItem{
				Id:        fmt.Sprintf("news-%d", t.Unix()),
				Ticker:    tickerSym,
				Headline:  headline,
				Content:   fmt.Sprintf("Detailed analysis regarding: %s", headline),
				Timestamp: t.UnixMilli(),
			}

			data, err := json.Marshal(news)
			if err != nil {
				log.Printf("Error marshaling news: %v", err)
				continue
			}

			// Publish to Kafka topic 'news.ingested'
			err = n.producer.SendMessage(ctx, []byte(tickerSym), data)
			if err != nil {
				log.Printf("Error sending news to Kafka: %v", err)
			}
		}
	}
}
