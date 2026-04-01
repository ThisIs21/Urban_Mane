package model

import (
    "time"
    "go.mongodb.org/mongo-driver/v2/bson"
)

// Struct untuk data di Database
type Product struct {
    ID          bson.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    Name        string        `bson:"name" json:"name"`
    Description string        `bson:"description" json:"description"`
    Price       int           `bson:"price" json:"price"`
    Stock       int           `bson:"stock" json:"stock"`
    Category    string        `bson:"category" json:"category"` 
    SKU         string        `bson:"sku" json:"sku"`           
    Image       string        `bson:"image" json:"image"`
    IsActive    bool          `bson:"isActive" json:"isActive"`
    CreatedAt   time.Time     `bson:"createdAt" json:"createdAt"`
    UpdatedAt   time.Time     `bson:"updatedAt" json:"updatedAt"`
}

// Struct untuk Input dari User (Create/Update)
type ProductInput struct {
    Name        string `json:"name" binding:"required"`
    Description string `json:"description"`
    Price       int    `json:"price" binding:"required"`
    Stock       int    `json:"stock"`
    Category    string `json:"category"`
    SKU         string `json:"sku"`
    Image       string `json:"image"`
    IsActive    *bool  `json:"isActive"` 
}