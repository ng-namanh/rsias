package company

import "github.com/gin-gonic/gin"

// RegisterRoutes mounts all company-related routes onto the given router group.
func RegisterRoutes(rg *gin.RouterGroup, svc *CompanyService) {
	handler := NewCompanyHandler(svc)

	companies := rg.Group("/companies")
	{
		companies.GET("/:symbol", handler.GetBySymbol)
	}
}
