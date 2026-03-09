package routes

import (
	"urban-mane/internal/controller"
	"urban-mane/internal/middleware"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes attaches all route groups to the main engine
func RegisterRoutes(r *gin.Engine, authController *controller.AuthController) {
	api := r.Group("/api/v1")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", authController.Register)
			auth.POST("/login", authController.Login)
		}

		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/profile", authController.GetProfile)
		}
	}
}
