package news

import (
	"context"
	"encoding/json"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
	kafkago "github.com/segmentio/kafka-go"
)

// PersistenceWorker consumes enriched news from Kafka and saves them to PostgreSQL.
type PersistenceWorker struct {
	reader *kafkago.Reader
	pool   *pgxpool.Pool
}

// NewPersistenceWorker creates a new Kafka-to-Postgres persistence worker.
func NewPersistenceWorker(brokers []string, topic string, pool *pgxpool.Pool) *PersistenceWorker {
	return &PersistenceWorker{
		reader: kafkago.NewReader(kafkago.ReaderConfig{
			Brokers:  brokers,
			Topic:    topic,
			GroupID:  "news-persistence-group",
			MinBytes: 10e3,
			MaxBytes: 10e6,
		}),
		pool: pool,
	}
}

// Run starts consuming messages and persisting them.
func (w *PersistenceWorker) Run(ctx context.Context) {
	log.Println("News Persistence Worker started...")
	for {
		m, err := w.reader.ReadMessage(ctx)
		if err != nil {
			log.Printf("Error reading message: %v", err)
			break
		}

		var enriched EnrichedNews
		if err := json.Unmarshal(m.Value, &enriched); err != nil {
			log.Printf("Error unmarshaling enriched news: %v", err)
			continue
		}

		if err := w.saveEnrichedNews(ctx, enriched); err != nil {
			log.Printf("Error saving enriched news: %v", err)
		}
	}
}

func (w *PersistenceWorker) saveEnrichedNews(ctx context.Context, enriched EnrichedNews) error {
	tx, err := w.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// 1. Get or create category
	var categoryID string
	if enriched.Category != nil {
		err = tx.QueryRow(ctx, "SELECT id FROM news_categories WHERE name = $1", *enriched.Category).Scan(&categoryID)
		if err != nil {
			log.Printf("Category %s not found, using Macro", *enriched.Category)
			err = tx.QueryRow(ctx, "SELECT id FROM news_categories WHERE name = 'Macro'").Scan(&categoryID)
			if err != nil {
				return err
			}
		}
	}

	// 2. Insert Article
	var articleID string
	err = tx.QueryRow(ctx, `
		INSERT INTO news_articles (source_name, headline, content_summary, url, published_at, category_id)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (url) DO UPDATE SET headline = EXCLUDED.headline
		RETURNING id
	`, enriched.SourceName, enriched.Headline, enriched.ContentSummary, enriched.URL, enriched.PublishedAt, categoryID).Scan(&articleID)
	if err != nil {
		return err
	}

	// 3. Insert Intelligence
	if enriched.Intelligence != nil {
		rationaleJSON, _ := json.Marshal(enriched.Intelligence.Rationale)
		_, err = tx.Exec(ctx, `
			INSERT INTO news_intelligence (news_article_id, sentiment_score, trust_score, rationale, confidence_level, model_version)
			VALUES ($1, $2, $3, $4, $5, $6)
			ON CONFLICT (news_article_id) DO UPDATE SET
				sentiment_score = EXCLUDED.sentiment_score,
				trust_score = EXCLUDED.trust_score,
				rationale = EXCLUDED.rationale
		`, articleID, enriched.Intelligence.SentimentScore, enriched.Intelligence.TrustScore, rationaleJSON, enriched.Intelligence.ConfidenceLevel, enriched.Intelligence.ModelVersion)
		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

// Close shuts down the Kafka reader.
func (w *PersistenceWorker) Close() error {
	return w.reader.Close()
}
