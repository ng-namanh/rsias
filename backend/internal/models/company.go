package models

import (
	"time"

	"github.com/google/uuid"
)

type Company struct {
	ID             uuid.UUID `json:"id"`
	Symbol         string    `json:"symbol"`
	Name           string    `json:"name"`
	Sector         *string   `json:"sector"`
	Industry       *string   `json:"industry"`
	MarketCap      *int64    `json:"market_cap"`
	PERatio        *float64  `json:"pe_ratio"`
	RevenueGrowth  *float64  `json:"revenue_growth"`
	UpdatedAt      time.Time `json:"updated_at"`
}
