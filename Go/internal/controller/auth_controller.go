package controller

import (
	"net/http"

	"urban-mane/internal/model"
	"urban-mane/internal/service"
	"urban-mane/pkg/utils"

	"github.com/gin-gonic/gin"
)

// AuthController binds HTTP requests to authentication service methods.
type AuthController struct {
	service *service.AuthService
}

// NewAuthController constructs a controller with its dependencies.
func NewAuthController(s *service.AuthService) *AuthController {
	return &AuthController{service: s}
}

// Register handles user registration requests.
func (ac *AuthController) Register(c *gin.Context) {
	var input model.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, err.Error())
		return
	}

	user, err := ac.service.Register(input)
	if err != nil {
		utils.ResponseError(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.ResponseJSON(c, http.StatusCreated, user)
}

// Login handles authentication requests. On success it returns a JWT.
func (ac *AuthController) Login(c *gin.Context) {
	var input model.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, err.Error())
		return
	}

	token, err := ac.service.Login(input)
	if err != nil {
		utils.ResponseError(c, http.StatusUnauthorized, err.Error())
		return
	}

	utils.ResponseJSON(c, http.StatusOK, gin.H{"token": token})
}

// GetProfile returns the current user's profile. The middleware must have
// set the "user_id" value in the context.
func (ac *AuthController) GetProfile(c *gin.Context) {
	val, exists := c.Get("user_id")
	if !exists {
		utils.ResponseError(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	id, ok := val.(string)
	if !ok {
		utils.ResponseError(c, http.StatusUnauthorized, "invalid user id")
		return
	}

	user, err := ac.service.GetProfile(id)
	if err != nil {
		utils.ResponseError(c, http.StatusNotFound, err.Error())
		return
	}

	utils.ResponseJSON(c, http.StatusOK, user)
}
