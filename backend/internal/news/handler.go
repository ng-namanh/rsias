package news

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ng-namanh/rsias/backend/internal/shared/response"
)

// NewsHandler handles HTTP requests for news data.
type NewsHandler struct {
	service *NewsService
}

// NewNewsHandler creates a new handler with injected service dependency.
func NewNewsHandler(svc *NewsService) *NewsHandler {
	return &NewsHandler{service: svc}
}

// GetRecent godoc
// GET /api/v1/news?limit=20
// Returns the most recent news articles.
func (h *NewsHandler) GetRecent(c *gin.Context) {
	limit := 20
	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	articles, err := h.service.GetRecent(c.Request.Context(), limit)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to fetch news")
		return
	}
	response.Success(c, articles)
}
