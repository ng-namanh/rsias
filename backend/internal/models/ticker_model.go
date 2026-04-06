package models

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
)

type TickerModel struct {
	db *pgx.Conn
}

func NewTickerModel(db *pgx.Conn) *TickerModel {
	return &TickerModel{db: db}
}

func (m *TickerModel) InsertTick(ctx context.Context, ticker string, price float64, timestamp int64) error {
	t := time.UnixMilli(timestamp)
	_, err := m.db.Exec(ctx,
		"INSERT INTO ticks (time, ticker, price) VALUES ($1, $2, $3)",
		t, ticker, price,
	)
	if err != nil {
		return fmt.Errorf("failed to insert tick: %w", err)
	}
	return nil
}

func (m *TickerModel) GetRecentTicks(ctx context.Context, ticker string, limit int) ([]map[string]interface{}, error) {
	rows, err := m.db.Query(ctx,
		"SELECT time, price FROM ticks WHERE ticker = $1 ORDER BY time DESC LIMIT $2",
		ticker, limit,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var t time.Time
		var p float64
		if err := rows.Scan(&t, &p); err != nil {
			return nil, err
		}
		results = append(results, map[string]interface{}{
			"time":  t,
			"price": p,
		})
	}
	return results, nil
}
