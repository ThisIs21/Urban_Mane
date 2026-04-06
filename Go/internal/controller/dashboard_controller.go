package controller

import (
    "net/http"
    "urban-mane/internal/repository"

    "github.com/gin-gonic/gin"
)

type DashboardController struct{}

func NewDashboardController() *DashboardController {
    return &DashboardController{}
}

// GetOwnerDashboard mengembalikan statistik ringkasan
func (c *DashboardController) GetOwnerDashboard(ctx *gin.Context) {
    // 1. Ambil Total Revenue (Dari Order Completed)
    revenue, err := repository.GetTotalRevenue()
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal ambil revenue"})
        return
    }

    // 2. Ambil Low Stock Products (< 5)
    lowStock, err := repository.GetLowStockProducts(5)
    if err != nil {
        lowStock = nil // Jangan stop jika error kecil
    }

    // 3. Ambil Top Barber (Sederhana: siapa yang paling banyak order?
    topBarbers, err := repository.GetTopBarbers(3)
    if err != nil {
        topBarbers = nil
    }

    ctx.JSON(http.StatusOK, gin.H{
        "total_revenue": revenue,
        "low_stock":     lowStock,
        "top_barbers":   topBarbers,
    })
}