package controller

import (
    "net/http"
    "urban-mane/internal/repository"
    "time"

    "github.com/gin-gonic/gin"
)

type DashboardController struct{}

func NewDashboardController() *DashboardController {
    return &DashboardController{}
}

func (c *DashboardController) GetOwnerDashboard(ctx *gin.Context) {
    // Total Pendapatan Bulan Ini
    now := time.Now()
    firstDayOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.Local)
    monthlyRevenue, _ := repository.GetRevenueByDateRange(firstDayOfMonth, now)

    // Total Transaksi
    totalTransactions, _ := repository.CountCompletedOrders()

    // Produk Aktif
    activeProducts, _ := repository.CountActiveProducts()

    // Data untuk Chart Mingguan (7 hari terakhir)
    weeklyData, _ := repository.GetWeeklyRevenue()

    // Data untuk Pie Chart (Distribusi Penjualan)
    salesDist, _ := repository.GetSalesDistribution()

    // Transaksi Terakhir
    recentOrders, _ := repository.GetRecentOrders(5)

    ctx.JSON(http.StatusOK, gin.H{
        "monthly_revenue":    monthlyRevenue,
        "total_transactions": totalTransactions,
        "active_products":    activeProducts,
        "weekly_data":        weeklyData,
        "sales_distribution": salesDist,
        "recent_orders":      recentOrders,
    })
}

