package market

import "github.com/gin-gonic/gin"

// RegisterRoutes mounts all market-related routes onto the given router group.
func RegisterRoutes(rg *gin.RouterGroup, svc *MarketService) {
	handler := NewMarketHandler(svc)

	market := rg.Group("/market")
	{
		market.GET("/dashboard", handler.GetDashboard)
	}
}
