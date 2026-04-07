package main

import (
	"log"
	"os"
	"path/filepath"

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
	repository.InitTransactionCollection()
	repository.InitOrderCollection()
	repository.InitLogCollection()

	// === INIT LAYERS ===

	// Auth
	authService := service.NewAuthService()
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

	// Transaction
	transactionService := service.NewTransactionService(productService, bundleService, userService)
	transactionController := controller.NewTransactionController(transactionService)

	// ORDER SERVICE
	orderService := service.NewOrderService()
	orderController := controller.NewOrderController(orderService)

	// Dashboard
	dashboardController := controller.NewDashboardController()

	// Log
	logController := controller.NewLogController()

	// Router
	r := gin.Default()

	// Tentukan path folder images - cari di parent directory
	workDir, err := os.Getwd()
	if err != nil {
		log.Println("Error getting working directory:", err)
		workDir = "."
	}

	// Cari folder images dari project root
	imagesPath := filepath.Join(workDir, "../images")
	if _, err := os.Stat(imagesPath); err != nil {
		// Jika tidak ketemu, coba dari current dir
		imagesPath = filepath.Join(workDir, "images")
	}

	// Pastikan folder images ada
	if _, err := os.Stat(imagesPath); err == nil {
		log.Println("Serving images from:", imagesPath)
		r.Static("/images", imagesPath)
	} else {
		log.Println("Images folder not found at:", imagesPath)
	}

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
	routes.RegisterRoutes(
		r, authController,
		userController,
		productController,
		serviceController,
		bundleController,
		transactionController,
		orderController,
		dashboardController,
		logController)

	// Run
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Server running on port " + port)
	r.Run(":" + port)
}
