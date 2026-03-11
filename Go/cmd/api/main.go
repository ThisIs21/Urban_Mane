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

    // === INIT LAYERS ===
    
    // Auth
    authService := service.NewAuthService()
    authService.SeedUsers() // Pastikan fungsi seed ada di auth_service
    authController := controller.NewAuthController(authService)

    // User
    userService := service.NewUserService()
    userController := controller.NewUserController(userService)

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

    // Register Routes (Pass both controllers)
    routes.RegisterRoutes(r, authController, userController)

    // Run
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    log.Println("Server running on port " + port)
    r.Run(":" + port)
}