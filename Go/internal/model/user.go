package model

import (
    "time"
   
    "go.mongodb.org/mongo-driver/v2/bson"
)


type User struct {
    
    ID        bson.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
    Name      string        `json:"name" bson:"name"`
    Email     string        `json:"email" bson:"email"`
    Password  string        `json:"-" bson:"password"` 
    Role      string        `json:"role" bson:"role"`  
    Phone     string        `json:"phone" bson:"phone"`
    PhotoUrl  string        `json:"photoUrl" bson:"photoUrl"`
    IsActive  bool          `json:"isActive" bson:"isActive"`
    CreatedAt time.Time     `json:"createdAt" bson:"createdAt"`
    UpdatedAt time.Time     `json:"updatedAt" bson:"updatedAt"`
}


type LoginInput struct {
    Email    string `json:"email" binding:"required"`
    Password string `json:"password" binding:"required"`
}


type RegisterInput struct {
    Name     string `json:"name" binding:"required"`
    Email    string `json:"email" binding:"required"`
    Password string `json:"password" binding:"required"`
    Role     string `json:"role"` 
    Phone    string `json:"phone"`
}

// Struct khusus untuk Update (Field tidak wajib semua)
type UpdateUserInput struct {
    Name     string `json:"name"`
    Email    string `json:"email"`
    Password string `json:"password"` // Tidak wajib
    Role     string `json:"role"`
    Phone    string `json:"phone"`
    PhotoUrl string `json:"photoUrl"`
    IsActive bool   `json:"isActive"`
}