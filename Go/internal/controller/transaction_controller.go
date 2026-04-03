package controller

import (
    "net/http"
    "urban-mane/internal/model"
    "urban-mane/internal/service"

    "github.com/gin-gonic/gin"
)

type TransactionController struct {
    service service.TransactionService
}

func NewTransactionController(service service.TransactionService) *TransactionController {
    return &TransactionController{service: service}
}

func (c *TransactionController) CreateTransaction(ctx *gin.Context) {
    var input model.TransactionInput
    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Ambil UserID dari context (diset oleh AuthMiddleware)
    userID, _ := ctx.Get("user_id") // string

    transaction, err := c.service.CreateTransaction(input, userID.(string))
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusCreated, gin.H{
        "message": "Transaction successful",
        "data":    transaction,
    })
}

func (c *TransactionController) GetTransactions(ctx *gin.Context) {
    search := ctx.Query("search")
    start := ctx.Query("start") // YYYY-MM-DD
    end := ctx.Query("end")
    
    // Untuk sekarang, passing string ke service atau parsing di service.
    // Agar cepat, kita skip parsing date dulu di contoh ini.
    transactions, err := c.service.GetAllTransactions(start, end, search)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"data": transactions})
}