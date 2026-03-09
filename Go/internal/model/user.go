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