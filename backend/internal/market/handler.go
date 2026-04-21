package market

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ng-namanh/rsias/backend/internal/shared/response"
)

// MarketHandler handles HTTP requests for market data.
type MarketHandler struct {
	service *MarketService
}

// NewMarketHandler creates a new handler with injected service dependency.
func NewMarketHandler(svc *MarketService) *MarketHandler {
	return &MarketHandler{service: svc}
}

// GetDashboard godoc
// GET /api/v1/market/dashboard
// Returns an aggregated market overview (indices, gainers, losers, actives, news).
func (h *MarketHandler) GetDashboard(c *gin.Context) {
	data, err := h.service.GetDashboard()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to fetch market data")
		return
	}
	response.Success(c, data)
}
