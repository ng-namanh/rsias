package news

import "context"

// NewsService encapsulates business logic for news operations.
type NewsService struct {
	repo NewsRepository
}

// NewNewsService creates a new service with an injected repository.
func NewNewsService(repo NewsRepository) *NewsService {
	return &NewsService{repo: repo}
}

// GetRecent retrieves the latest news articles.
func (s *NewsService) GetRecent(ctx context.Context, limit int) ([]NewsArticle, error) {
	if limit <= 0 {
		limit = 20
	}
	return s.repo.FindRecent(ctx, limit)
}
