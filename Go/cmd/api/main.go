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
	repository.InitUserCollection()
	repository.InitProductCollection()
	repository.InitServiceCollection()
	repository.InitBundleCollection()

	// === INIT LAYERS ===

	// Auth
	authService := service.NewAuthService()
	authService.SeedUsers()
	authController := controller.NewAuthController(authService)

	// User
	userService := service.NewUserService()
	userController := controller.NewUserController(userService)

	// Product
	productService := service.NewProductService()
	productController := controller.NewProductController(productService)

	// Service
	serviceService := service.NewServiceService()
	serviceController := controller.NewServiceController(serviceService)

	// Bundle
	bundleService := service.NewBundleService()
	bundleController := controller.NewBundleController(bundleService)

	// Router
	r := gin.Default()

	// CORS
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

	// Register Routes
	routes.RegisterRoutes(r, authController, userController, productController, serviceController, bundleController)

	// Run
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Server running on port " + port)
	r.Run(":" + port)
}
