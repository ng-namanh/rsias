package polling

import (
	"context"
	"time"
)

type PollingService struct {
	interval time.Duration
}

func NewPollingService(interval time.Duration) *PollingService {
	return &PollingService{interval: interval}
}

func (s *PollingService) Start(ctx context.Context, task func(ctx context.Context)) {
	ticker := time.NewTicker(s.interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			task(ctx)
		}
	}
}
