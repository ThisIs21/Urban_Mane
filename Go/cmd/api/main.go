package main

import (
	"log"
	"os"

	"urban-mane/config"
	"urban-mane/internal/controller"
	"urban-mane/internal/repository"
	"urban-mane/internal/routes"
	"urban-mane/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	config.ConnectDB()

	// Init Collections (PENTING di v2 agar repository tidak panic)
	repository.InitUserCollection()

	// Init Layers
	authService := service.NewAuthService()
	// ensure default accounts exist (admin, kasir, owner, barber)
	authService.SeedUsers()

	authController := controller.NewAuthController(authService)

	// Init Router
	r := gin.Default()

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Routes
	routes.RegisterRoutes(r, authController)
	// Run
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Server running on port " + port)
	r.Run(":" + port)
}
