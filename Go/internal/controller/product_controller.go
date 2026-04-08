package controller

import (
    "net/http"
    "urban-mane/internal/model"
    "urban-mane/internal/service"

    "github.com/gin-gonic/gin"
)

type ProductController struct {
    service service.ProductService
}

func NewProductController(service service.ProductService) *ProductController {
    return &ProductController{service: service}
}

func (c *ProductController) GetProducts(ctx *gin.Context) {
    search := ctx.Query("search")
    products, err := c.service.GetAllProducts(search)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, gin.H{"data": products})
}

func (c *ProductController) CreateProduct(ctx *gin.Context) {
    var input model.ProductInput
    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    product, err := c.service.CreateProduct(input)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusCreated, gin.H{"data": product, "message": "Product created successfully"})
}

func (c *ProductController) UpdateProduct(ctx *gin.Context) {
    id := ctx.Param("id")
    var input model.ProductInput
    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    product, err := c.service.UpdateProduct(id, input)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, gin.H{"data": product, "message": "Product updated successfully"})
}

func (c *ProductController) DeleteProduct(ctx *gin.Context) {
    id := ctx.Param("id")
    err := c.service.DeleteProduct(id)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

func (c *ProductController) UpdateStock(ctx *gin.Context) {
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
        "message": "Stok berhasil diupdate",
        "data":    result,
    })
}