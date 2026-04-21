package cache

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// RedisClient wraps a Redis connection for caching operations.
type RedisClient struct {
	client *redis.Client
}

// NewRedisClient creates a new Redis client connection.
func NewRedisClient(addr string) *RedisClient {
	return &RedisClient{
		client: redis.NewClient(&redis.Options{
			Addr: addr,
		}),
	}
}

// SetPriceSnapshot caches a ticker price with a 1-hour TTL.
func (r *RedisClient) SetPriceSnapshot(ctx context.Context, ticker string, price float64) error {
	err := r.client.Set(ctx, fmt.Sprintf("price:%s", ticker), price, 1*time.Hour).Err()
	if err != nil {
		return fmt.Errorf("failed to set price snapshot: %w", err)
	}
	return nil
}

// GetPriceSnapshot retrieves a cached ticker price.
func (r *RedisClient) GetPriceSnapshot(ctx context.Context, ticker string) (float64, error) {
	price, err := r.client.Get(ctx, fmt.Sprintf("price:%s", ticker)).Float64()
	if err != nil {
		return 0, fmt.Errorf("failed to get price snapshot: %w", err)
	}
	return price, nil
}

// Close shuts down the Redis connection.
func (r *RedisClient) Close() error {
	return r.client.Close()
}
