package services

import (
	"context"
	"encoding/json"
	"log"
	"math/rand"
	"time"

	"github.com/ng-namanh/rsias/backend/internal/grpc/proto"
)

// MarketStream handles ingestion of real-time market data
type MarketStream struct {
	producer *KafkaProducer
}

// NewMarketStream creates a new market stream service
func NewMarketStream(producer *KafkaProducer) *MarketStream {
	return &MarketStream{
		producer: producer,
	}
}

// StartSimulatedIngestion simulates a WebSocket stream for development
func (m *MarketStream) StartSimulatedIngestion(ctx context.Context, tickers []string) {
	log.Printf("Starting simulated market data ingestion for: %v", tickers)
	
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Println("Stopping market stream ingestion...")
			return
		case t := <-ticker.C:
			for _, symbol := range tickers {
				// Simulate a price movement
				price := 100.0 + rand.Float64()*50.0
				
				tick := &proto.MarketTick{
					Ticker:    symbol,
					Price:     price,
					Timestamp: t.UnixMilli(),
				}

				data, err := json.Marshal(tick)
				if err != nil {
					log.Printf("Error marshaling tick: %v", err)
					continue
				}

				err = m.producer.SendMessage(ctx, []byte(symbol), data)
				if err != nil {
					log.Printf("Error sending tick to Kafka: %v", err)
				}
			}
		}
	}
}
