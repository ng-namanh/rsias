package news

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

// NewsRepository defines the contract for news data access.
type NewsRepository interface {
	FindRecent(ctx context.Context, limit int) ([]NewsArticle, error)
}

// PostgresNewsRepository implements NewsRepository using PostgreSQL.
type PostgresNewsRepository struct {
	pool *pgxpool.Pool
}

// NewPostgresNewsRepository creates a new PostgreSQL-backed news repository.
func NewPostgresNewsRepository(pool *pgxpool.Pool) *PostgresNewsRepository {
	return &PostgresNewsRepository{pool: pool}
}

// FindRecent retrieves the most recent news articles.
func (r *PostgresNewsRepository) FindRecent(ctx context.Context, limit int) ([]NewsArticle, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, company_id, category_id, source_name, headline, content_summary, url, published_at, created_at
		 FROM news_articles ORDER BY published_at DESC LIMIT $1`, limit,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to query recent news: %w", err)
	}
	defer rows.Close()

	var articles []NewsArticle
	for rows.Next() {
		var a NewsArticle
		if err := rows.Scan(&a.ID, &a.CompanyID, &a.CategoryID, &a.SourceName, &a.Headline, &a.ContentSummary, &a.URL, &a.PublishedAt, &a.CreatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan news article: %w", err)
		}
		articles = append(articles, a)
	}
	return articles, nil
}
