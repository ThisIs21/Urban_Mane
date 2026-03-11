package middleware

import (
    "net/http"
    "os"
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v4"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(ctx *gin.Context) {
        authHeader := ctx.GetHeader("Authorization")
        if authHeader == "" {
            ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
            ctx.Abort()
            return
        }

        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization format"})
            ctx.Abort()
            return
        }

        tokenString := parts[1]

        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, jwt.ErrSignatureInvalid
            }
            secret := os.Getenv("JWT_SECRET")
            if secret == "" {
                secret = "secret" // fallback
            }
            return []byte(secret), nil
        })

        if err != nil || !token.Valid {
            ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
            ctx.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok {
            ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse claims"})
            ctx.Abort()
            return
        }

        // DEBUG: Print claims to console to see what we get
        // log.Printf("Claims: %+v", claims) 

        ctx.Set("user_id", claims["user_id"])
        ctx.Set("role", claims["role"]) // PENTING: Set role ke context

        ctx.Next()
    }
}

func RoleMiddleware(roles ...string) gin.HandlerFunc {
    return func(ctx *gin.Context) {
        userRole, exists := ctx.Get("role")
        if !exists {
            // JIKA ERROR INI YANG MUNCUL, BERARTI LINE DI ATAS (ctx.Set) GAGAL
            ctx.JSON(http.StatusForbidden, gin.H{"error": "Role not found in context"})
            ctx.Abort()
            return
        }

        roleStr, ok := userRole.(string)
        if !ok {
            ctx.JSON(http.StatusForbidden, gin.H{"error": "Role is invalid type"})
            ctx.Abort()
            return
        }

        valid := false
        for _, r := range roles {
            if r == roleStr {
                valid = true
                break
            }
        }

        if !valid {
            ctx.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission"})
            ctx.Abort()
            return
        }

        ctx.Next()
    }
}