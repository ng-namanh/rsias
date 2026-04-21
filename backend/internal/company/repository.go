package company

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

// CompanyRepository defines the contract for company data access.
type CompanyRepository interface {
	FindBySymbol(ctx context.Context, symbol string) (*Company, error)
}

// PostgresCompanyRepository implements CompanyRepository using PostgreSQL.
type PostgresCompanyRepository struct {
	pool *pgxpool.Pool
}

// NewPostgresCompanyRepository creates a new PostgreSQL-backed company repository.
func NewPostgresCompanyRepository(pool *pgxpool.Pool) *PostgresCompanyRepository {
	return &PostgresCompanyRepository{pool: pool}
}

// FindBySymbol retrieves a company by its ticker symbol.
func (r *PostgresCompanyRepository) FindBySymbol(ctx context.Context, symbol string) (*Company, error) {
	var c Company
	err := r.pool.QueryRow(ctx,
		`SELECT id, symbol, name, sector, industry, market_cap, pe_ratio, revenue_growth, updated_at
		 FROM companies WHERE symbol = $1`, symbol,
	).Scan(&c.ID, &c.Symbol, &c.Name, &c.Sector, &c.Industry, &c.MarketCap, &c.PERatio, &c.RevenueGrowth, &c.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("company not found for symbol %s: %w", symbol, err)
	}
	return &c, nil
}
