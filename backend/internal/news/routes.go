package news

import "github.com/gin-gonic/gin"

// RegisterRoutes mounts all news-related routes onto the given router group.
func RegisterRoutes(rg *gin.RouterGroup, svc *NewsService) {
	handler := NewNewsHandler(svc)

	newsGroup := rg.Group("/news")
	{
		newsGroup.GET("", handler.GetRecent)
	}
}
