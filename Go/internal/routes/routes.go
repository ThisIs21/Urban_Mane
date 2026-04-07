package routes

import (
	"os"
	"path/filepath"

	"urban-mane/internal/controller"
	"urban-mane/internal/middleware"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes attaches all route groups to the main engine
func RegisterRoutes(
	r *gin.Engine,
	 authController *controller.AuthController,
	 userController *controller.UserController,
	  productController *controller.ProductController,
	   serviceController *controller.ServiceController,
	    bundleController *controller.BundleController,
		 transactionController *controller.TransactionController,
		 orderController *controller.OrderController,
		 dashboardController *controller.DashboardController,
		 logController *controller.LogController,
		) {

	// Public
	auth := r.Group("/api/v1/auth")
	{
		auth.POST("/register", authController.Register)
		auth.POST("/login", authController.Login)
	}

	// Protected
	api := r.Group("/api/v1")
	api.Use(middleware.AuthMiddleware())
	{
		// profile endpoint returns current logged-in user
		api.GET("/profile", authController.GetProfile)

		// User Management (Admin Only)
		users := api.Group("/users")
		users.Use(middleware.RoleMiddleware("admin", "cashier")) // Admin & Kasir bisa akses user
		{
			users.GET("", userController.GetUsers)
			users.POST("", userController.CreateUser)
			users.PUT("/:id", userController.UpdateUser)
			users.DELETE("/:id", userController.DeleteUser)
		}

		// Products Management (Admin Only)
		products := api.Group("/products")
		products.Use(middleware.RoleMiddleware("admin", "cashier", "owner")) // Admin & Kasir bisa akses produk
		{
			products.GET("", productController.GetProducts)
			products.POST("", productController.CreateProduct)
			products.PUT("/:id", productController.UpdateProduct)
			products.DELETE("/:id", productController.DeleteProduct)
		}

		// Upload endpoint untuk file
		api.POST("/upload", productController.UploadFile)

		// Services Management (Admin Only)
		services := api.Group("/services")
		services.Use(middleware.RoleMiddleware("admin", "cashier")) // Admin & Kasir bisa akses services
		{
			services.GET("", serviceController.GetServices)
			services.POST("", serviceController.CreateService)
			services.PUT("/:id", serviceController.UpdateService)
			services.DELETE("/:id", serviceController.DeleteService)
		}

		// Bundles Management (Admin Only)
		bundles := api.Group("/bundles")
		bundles.Use(middleware.RoleMiddleware("admin", "cashier")) // Admin & Kasir bisa akses bundles
		{
			bundles.GET("", bundleController.GetBundles)
			bundles.POST("", bundleController.CreateBundle)
			bundles.PUT("/:id", bundleController.UpdateBundle)
			bundles.DELETE("/:id", bundleController.DeleteBundle)
		}

		
    tx := api.Group("/transactions")
    tx.Use(middleware.RoleMiddleware("admin", "cashier")) 
    {
        tx.POST("", transactionController.CreateTransaction)
        tx.GET("", transactionController.GetTransactions)
    }

	orders := api.Group("/orders")
    orders.Use(middleware.RoleMiddleware("admin", "cashier", "owner")) 
    {
        orders.POST("", orderController.CreateOrder)       // Buat order baru
        orders.GET("/queue", orderController.GetQueue)     // Lihat antrian
        orders.GET("/payment", orderController.GetWaitingPayment) // Lihat yg mau bayar
        
        // Aksi terhadap order spesifik
        orders.PUT("/:id/start", orderController.StartOrder)
        orders.PUT("/:id/finish", orderController.FinishOrder)
        orders.PUT("/:id/pay", orderController.ProcessPayment)
        orders.PUT("/:id/cancel", orderController.CancelOrder)
		// Di dalam group orders
		orders.GET("/history", orderController.GetHistory)
    }

	dash := api.Group("/dashboard")
    dash.Use(middleware.RoleMiddleware("owner"))
    {
        dash.GET("/owner", dashboardController.GetOwnerDashboard)
    }

	logs := api.Group("/logs")
logs.Use(middleware.RoleMiddleware("owner"))
{
    logs.GET("", logController.GetLogs)
}
}

	

	// Static files untuk uploaded images
	workDir, _ := os.Getwd()
	uploadsPath := filepath.Join(workDir, "../uploads")
	if _, err := os.Stat(uploadsPath); err != nil {
		uploadsPath = filepath.Join(workDir, "uploads")
	}
	r.Static("/uploads", uploadsPath)
}
