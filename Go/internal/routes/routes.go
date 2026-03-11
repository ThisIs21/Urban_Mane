package routes

import (
	"urban-mane/internal/controller"
	"urban-mane/internal/middleware"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes attaches all route groups to the main engine
func RegisterRoutes(r *gin.Engine, authController *controller.AuthController, userController *controller.UserController) {

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
		users.Use(middleware.RoleMiddleware("admin"))
		{
			users.GET("", userController.GetUsers)
			users.POST("", userController.CreateUser)
			users.PUT("/:id", userController.UpdateUser)
			users.DELETE("/:id", userController.DeleteUser)
		}

		// ... other routes like products, etc
	}
}
