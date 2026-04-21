package company

import "context"

// CompanyService encapsulates business logic for company operations.
type CompanyService struct {
	repo CompanyRepository
}

// NewCompanyService creates a new service with an injected repository.
func NewCompanyService(repo CompanyRepository) *CompanyService {
	return &CompanyService{repo: repo}
}

// GetBySymbol retrieves a company by its ticker symbol.
func (s *CompanyService) GetBySymbol(ctx context.Context, symbol string) (*Company, error) {
	return s.repo.FindBySymbol(ctx, symbol)
}
