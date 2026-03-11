package service

import (
	"errors"
	"log"
	"os"
	"time"

	"urban-mane/internal/model"
	"urban-mane/internal/repository"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// AuthService handles authentication-related business logic.
// It is intentionally very thin; real applications may add logging,
// metrics, transactional boundaries, etc.
type AuthService struct{}

// NewAuthService creates a new AuthService instance.
func NewAuthService() *AuthService {
	return &AuthService{}
}

// Register creates a new user with a hashed password.
func (s *AuthService) Register(input model.RegisterInput) (*model.User, error) {
	// make sure email is not already taken
	if existing, err := repository.FindUserByEmail(input.Email); err == nil && existing != nil {
		return nil, errors.New("email already registered")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := model.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashed),
		Role:     input.Role,
		Phone:    input.Phone,
	}

	return repository.CreateUser(user)
}


func (s *AuthService) Login(input model.LoginInput) (string, error) {
    user, err := repository.FindUserByEmail(input.Email)
    if err != nil {
        return "", errors.New("invalid credentials")
    }

    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
        return "", errors.New("invalid credentials")
    }

    
    claims := jwt.MapClaims{
        "user_id": user.ID.Hex(),
        "email":   user.Email,
        "role":    user.Role, 
        "exp":     time.Now().Add(72 * time.Hour).Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    secret := os.Getenv("JWT_SECRET")
    if secret == "" {
        secret = "secret" 
    }

    tokStr, err := token.SignedString([]byte(secret))
    if err != nil {
        return "", err
    }

    return tokStr, nil
}


func (s *AuthService) GetProfile(userID string) (*model.User, error) {
	return repository.FindUserByID(userID)
}


func (s *AuthService) SeedUsers() {
    defaults := []model.RegisterInput{
        {Name: "Administrator", Email: "admin@local", Password: "admin123", Role: "admin"},
        {Name: "Cashier", Email: "cashier@local", Password: "cashier123", Role: "cashier"}, 
        {Name: "Owner", Email: "owner@local", Password: "owner123", Role: "owner"},
        {Name: "Barber", Email: "barber@local", Password: "barber123", Role: "barber"},
    }

    for _, u := range defaults {
        _, err := s.Register(u)
        if err != nil {
            // UBAH "exists" JADI "registered" SESUAI DENGAN ERROR DI REGISTER
            if err.Error() == "email already registered" {
                continue
            }
            log.Printf("Seeding error for %s: %v", u.Email, err)
        } else {
            log.Printf("User %s created successfully", u.Email)
        }
    }
}
