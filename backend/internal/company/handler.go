package company

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ng-namanh/rsias/backend/internal/shared/response"
)

// CompanyHandler handles HTTP requests for company data.
type CompanyHandler struct {
	service *CompanyService
}

// NewCompanyHandler creates a new handler with injected service dependency.
func NewCompanyHandler(svc *CompanyService) *CompanyHandler {
	return &CompanyHandler{service: svc}
}

// GetBySymbol godoc
// GET /api/v1/companies/:symbol
// Returns fundamental data for a single company.
func (h *CompanyHandler) GetBySymbol(c *gin.Context) {
	symbol := c.Param("symbol")
	if symbol == "" {
		response.Error(c, http.StatusBadRequest, "Symbol parameter is required")
		return
	}

	company, err := h.service.GetBySymbol(c.Request.Context(), symbol)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Company not found")
		return
	}

	response.Success(c, company)
}
