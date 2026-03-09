package model

import (
	"time"
	"go.mongodb.org/mongo-driver/v2/bson"
)
type Product struct {
    ID          bson.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
    Name        string             `json:"name" bson:"name"`
    SKU         string             `json:"sku" bson:"sku"`
    Description string             `json:"description" bson:"description"`
    Price       int                `json:"price" bson:"price"`
    Stock       int                `json:"stock" bson:"stock"`
    Category    string             `json:"category" bson:"category"`
    Image       string             `json:"image" bson:"image"`
    IsActive    bool               `json:"isActive" bson:"isActive"`
    CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
}
