package controller

import (
    "net/http"
    "urban-mane/internal/model"
    "urban-mane/internal/service"

    "github.com/gin-gonic/gin"
)

type UserController struct {
    userService service.UserService
}

func NewUserController(userService service.UserService) *UserController {
    return &UserController{userService: userService}
}

func (c *UserController) CreateUser(ctx *gin.Context) {
    var input model.RegisterInput

    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Validasi sederhana: Role harus diisi
    if input.Role == "" {
        input.Role = "cashier" // Default role jika kosong
    }

    user, err := c.userService.CreateUser(input)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusCreated, gin.H{
        "message": "User created successfully",
        "data":    user,
    })
}

// GetUsers handles GET /users
func (c *UserController) GetUsers(ctx *gin.Context) {
    search := ctx.Query("search")
    
    users, err := c.userService.GetAllUsers(search)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"data": users})
}

// UpdateUser handles PUT /users/:id
func (c *UserController) UpdateUser(ctx *gin.Context) {
    id := ctx.Param("id")
    var input model.UpdateUserInput

    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user, err := c.userService.UpdateUser(id, input)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"message": "User updated successfully", "data": user})
}

// DeleteUser handles DELETE /users/:id
func (c *UserController) DeleteUser(ctx *gin.Context) {
    id := ctx.Param("id")

    err := c.userService.DeleteUser(id)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}