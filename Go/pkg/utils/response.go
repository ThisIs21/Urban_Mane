package utils

import "github.com/gin-gonic/gin"

// ResponseJSON sends a generic JSON response payload.
func ResponseJSON(c *gin.Context, status int, payload interface{}) {
	c.JSON(status, payload)
}

// ResponseError is a convenience for error messages.
func ResponseError(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{"error": message})
}
