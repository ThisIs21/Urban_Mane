package model

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// Service struct untuk data layanan di database
type Service struct {
	ID               bson.ObjectID  `bson:"_id,omitempty" json:"id,omitempty"`
	Name             string         `bson:"name" json:"name"`
	Price            int            `bson:"price" json:"price"`
	Duration         int            `bson:"duration" json:"duration"` 
	Category         string         `bson:"category" json:"category"`
	RequiredProducts []ProductUsage `bson:"requiredProducts" json:"requiredProducts"` 
	IsActive         bool           `bson:"isActive" json:"isActive"`
	CreatedAt        time.Time      `bson:"createdAt" json:"createdAt"`
	UpdatedAt        time.Time      `bson:"updatedAt" json:"updatedAt"`
}

// ProductUsage untuk melacak produk mana saja yang dibutuhkan di service
type ProductUsage struct {
	ProductID   bson.ObjectID `bson:"productId" json:"productId"`
	ProductName string        `bson:"productName" json:"productName"`
	Quantity    int           `bson:"quantity" json:"quantity"` 
}

// ServiceInput untuk menerima input dari user
type ServiceInput struct {
	Name             string         `json:"name" binding:"required"`
	Price            int            `json:"price" binding:"required"`
	Duration         int            `json:"duration" binding:"required"`
	Category         string         `json:"category"`
	RequiredProducts []ProductUsage `json:"requiredProducts"`
	IsActive         *bool          `json:"isActive"`
}
