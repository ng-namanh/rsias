package heatmap

import (
	"context"
	"encoding/json"
	"log"
	"sync"

	"github.com/ng-namanh/rsias/backend/internal/models"
	"github.com/segmentio/kafka-go"
)

type HeatmapService struct {
	reader *kafka.Reader
	counts map[string]int
	mu     sync.RWMutex
}

func NewHeatmapService(brokers []string, topic string) *HeatmapService {
	return &HeatmapService{
		reader: kafka.NewReader(kafka.ReaderConfig{
			Brokers: brokers,
			Topic:   topic,
			GroupID: "heatmap-aggregator",
		}),
		counts: make(map[string]int),
	}
}

func (s *HeatmapService) Run(ctx context.Context, broadcast func(data []byte)) {
	log.Println("Heatmap Service started...")
	for {
		m, err := s.reader.ReadMessage(ctx)
		if err != nil {
			log.Printf("Heatmap error: %v", err)
			break
		}

		var enriched models.EnrichedNews
		err = json.Unmarshal(m.Value, &enriched)
		if err != nil {
			continue
		}

		if enriched.Category != nil {
			s.mu.Lock()
			s.counts[*enriched.Category]++
			s.mu.Unlock()

			// Broadcast update
			s.mu.RLock()
			data, _ := json.Marshal(map[string]interface{}{
				"type": "heatmap.update",
				"data": s.counts,
			})
			s.mu.RUnlock()
			broadcast(data)
		}
	}
}
