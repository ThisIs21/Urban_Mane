package controller

import (
    "net/http"
    "urban-mane/internal/repository"

    "github.com/gin-gonic/gin"
)

type LogController struct{}

func NewLogController() *LogController {
    return &LogController{}
}

func (c *LogController) GetLogs(ctx *gin.Context) {
    logs, err := repository.GetLogs(50) // Ambil 50 log terakhir
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, gin.H{"data": logs})
}