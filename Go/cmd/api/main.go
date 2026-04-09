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

	// CORS Middleware FIRST - sebelum semua route dan static files
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "false")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
		
		// Handle preflight requests
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}
		
		c.Next()
	})

	// Tentukan path folder images dengan lebih akurat
	workDir, err := os.Getwd()
	if err != nil {
		log.Println("Error getting working directory, using current dir")
		workDir = "."
	}

	log.Println("Working directory:", workDir)

	// Try multiple paths to find images folder
	// Struktur: Urban_Mane/Go/cmd/api/ → images di Urban_Mane/images
	var imagesPath string
	potentialPaths := []string{
		filepath.Join(workDir, "../../../images"),       // 3 level up from cmd/api
		filepath.Join(workDir, "../../images"),          // 2 level up (fallback)
		filepath.Join(workDir, "../images"),             // 1 level up (fallback)
		filepath.Join(workDir, "images"),                // Current directory
		"../../images",                                  // Relative path
	}

	for _, path := range potentialPaths {
		absPath, _ := filepath.Abs(path)
		if _, err := os.Stat(path); err == nil {
			imagesPath = path
			log.Println("✓ Found images folder at:", absPath)
			break
		}
	}

	if imagesPath != "" {
		r.Static("/images", imagesPath)
	} else {
		log.Println("⚠ Warning: Images folder not found in any expected location")
		log.Println("Tried paths:", potentialPaths)
	}

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
