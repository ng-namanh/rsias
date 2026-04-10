package models

import (
	"time"

	"github.com/google/uuid"
)

type NewsCategory struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
}

type NewsArticle struct {
	ID             uuid.UUID `json:"id"`
	CompanyID      *uuid.UUID `json:"company_id"`
	CategoryID     *uuid.UUID `json:"category_id"`
	SourceName     string    `json:"source_name"`
	Headline       string    `json:"headline"`
	ContentSummary string    `json:"content_summary"`
	URL            string    `json:"url"`
	PublishedAt    time.Time `json:"published_at"`
	CreatedAt      time.Time `json:"created_at"`
}

type NewsIntelligence struct {
	ID             uuid.UUID `json:"id"`
	NewsArticleID  uuid.UUID `json:"news_article_id"`
	SentimentScore float64   `json:"sentiment_score"`
	TrustScore     float64   `json:"trust_score"`
	Rationale      any       `json:"rationale"` // JSONB
	ConfidenceLevel *float64 `json:"confidence_level"`
	ModelVersion   string    `json:"model_version"`
	CreatedAt      time.Time `json:"created_at"`
}

type EnrichedNews struct {
	NewsArticle
	Category     *string           `json:"category"`
	CompanySymbol *string          `json:"company_symbol"`
	Intelligence *NewsIntelligence `json:"intelligence"`
}
