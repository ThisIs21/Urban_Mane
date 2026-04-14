package controller

import (
	"net/http"
	"urban-mane/internal/model"
	"urban-mane/internal/service"

	"github.com/gin-gonic/gin"
)

type ServiceController struct {
	service service.ServiceService
}

func NewServiceController(svc service.ServiceService) *ServiceController {
	return &ServiceController{service: svc}
}

// GetServices untuk ambil semua services dengan search
func (c *ServiceController) GetServices(ctx *gin.Context) {
	search := ctx.Query("search")
	activeStr := ctx.Query("active")
	var active *bool
	if activeStr != "" {
		if activeStr == "true" {
			active = new(bool)
			*active = true
		} else if activeStr == "false" {
			active = new(bool)
			*active = false
		}
	}
	services, err := c.service.GetAllServices(search, active)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"data": services})
}

// CreateService untuk membuat service baru
func (c *ServiceController) CreateService(ctx *gin.Context) {
	var input model.ServiceInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	svc, err := c.service.CreateService(input)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{"data": svc, "message": "Service created successfully"})
}

// UpdateService untuk update service
func (c *ServiceController) UpdateService(ctx *gin.Context) {
	id := ctx.Param("id")
	var input model.ServiceInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	svc, err := c.service.UpdateService(id, input)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"data": svc, "message": "Service updated successfully"})
}

// DeleteService untuk hapus service
func (c *ServiceController) DeleteService(ctx *gin.Context) {
	id := ctx.Param("id")
	err := c.service.DeleteService(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Service deleted successfully"})
}
