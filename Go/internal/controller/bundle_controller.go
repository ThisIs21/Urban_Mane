package controller

import (
	"net/http"
	"urban-mane/internal/model"
	"urban-mane/internal/service"

	"github.com/gin-gonic/gin"
)

type BundleController struct {
	service service.BundleService
}

func NewBundleController(svc service.BundleService) *BundleController {
	return &BundleController{service: svc}
}

func (c *BundleController) GetBundles(ctx *gin.Context) {
	search := ctx.Query("search")
	bundles, err := c.service.GetAllBundles(search)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"data": bundles})
}

func (c *BundleController) GetBundleByID(ctx *gin.Context) {
	id := ctx.Param("id")
	bundle, err := c.service.GetBundleByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"data": bundle})
}

func (c *BundleController) CreateBundle(ctx *gin.Context) {
	var input model.BundleInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bundle, err := c.service.CreateBundle(input)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": bundle})
}

func (c *BundleController) UpdateBundle(ctx *gin.Context) {
	id := ctx.Param("id")
	var input model.BundleInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bundle, err := c.service.UpdateBundle(id, input)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": bundle})
}

func (c *BundleController) DeleteBundle(ctx *gin.Context) {
	id := ctx.Param("id")
	err := c.service.DeleteBundle(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Bundle deleted successfully"})
}

func (c *BundleController) UpdateStock(ctx *gin.Context) {
	id := ctx.Param("id")

	var input struct {
		Quantity int    `json:"quantity" binding:"required"`
		Type     string `json:"type"` // "add", "subtract", "set"
		Date     string `json:"date"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validasi sederhana
	if input.Quantity < 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "quantity tidak boleh negatif"})
		return
	}

	result, err := c.service.UpdateStock(id, input.Quantity, input.Type)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Stok bundle berhasil diupdate",
		"data":    result,
	})
}
