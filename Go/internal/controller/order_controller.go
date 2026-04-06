package controller

import (
    "net/http"
    "urban-mane/internal/model"
    "urban-mane/internal/service"

    "github.com/gin-gonic/gin"
)

type OrderController struct {
    service service.OrderService
}

func NewOrderController(service service.OrderService) *OrderController {
    return &OrderController{service: service}
}

// CreateOrder: Membuat order baru (Kasir input pesanan)
func (c *OrderController) CreateOrder(ctx *gin.Context) {
    var input model.CreateOrderInput
    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    order, err := c.service.CreateOrder(input)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusCreated, gin.H{
        "message": "Order berhasil dibuat, masuk antrian",
        "data":    order,
    })
}

// GetQueue: Ambil daftar antrian (Waiting & InProgress)
func (c *OrderController) GetQueue(ctx *gin.Context) {
    orders, err := c.service.GetQueueList()
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, gin.H{"data": orders})
}

// StartOrder: Ubah status jadi In Progress
func (c *OrderController) StartOrder(ctx *gin.Context) {
    id := ctx.Param("id")
    err := c.service.StartOrder(id)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, gin.H{"message": "Order dimulai"})
}

// FinishOrder: Ubah status jadi Waiting Payment
func (c *OrderController) FinishOrder(ctx *gin.Context) {
    id := ctx.Param("id")
    err := c.service.FinishOrder(id)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, gin.H{"message": "Order selesai, menunggu pembayaran"})
}

// ProcessPayment: Proses pembayaran
func (c *OrderController) ProcessPayment(ctx *gin.Context) {
    id := ctx.Param("id")
    var input model.ProcessPaymentInput
    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    order, err := c.service.ProcessPayment(id, input)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{
        "message": "Pembayaran berhasil",
        "data":    order,
    })
}

// CancelOrder: Batalkan order
func (c *OrderController) CancelOrder(ctx *gin.Context) {
    id := ctx.Param("id")
    err := c.service.CancelOrder(id)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, gin.H{"message": "Order dibatalkan, stok dikembalikan"})
}

// GetWaitingPayment: Ambil daftar yang butuh bayar
func (c *OrderController) GetWaitingPayment(ctx *gin.Context) {
    orders, err := c.service.GetWaitingPayment()
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, gin.H{"data": orders})
}

func (c *OrderController) GetHistory(ctx *gin.Context) {
    start := ctx.Query("start")
    end := ctx.Query("end")
    
    orders, err := c.service.GetOrderHistory(start, end)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, gin.H{"data": orders})
}