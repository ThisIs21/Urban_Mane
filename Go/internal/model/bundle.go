package model

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// BundleProduct untuk melacak produk di dalam bundle
type BundleProduct struct {
	ProductID   bson.ObjectID `bson:"productId" json:"productId"`
	ProductName string        `bson:"productName" json:"productName"`
	Quantity    int           `bson:"quantity" json:"quantity"`
}

// BundleService untuk melacak service di dalam bundle
type BundleService struct {
	ServiceID   bson.ObjectID `bson:"serviceId" json:"serviceId"`
	ServiceName string        `bson:"serviceName" json:"serviceName"`
}

// Bundle struct untuk data paket di database
type Bundle struct {
	ID          bson.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	Name        string          `bson:"name" json:"name"`
	Description string          `bson:"description" json:"description"`
	Image       string          `bson:"image" json:"image"`
	Products    []BundleProduct `bson:"products" json:"products"`
	Services    []BundleService `bson:"services" json:"services"`
	BundlePrice int             `bson:"bundlePrice" json:"bundlePrice"`
	Stock       int             `bson:"stock" json:"stock"`
	IsActive    bool            `bson:"isActive" json:"isActive"`
	CreatedAt   time.Time       `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time       `bson:"updatedAt" json:"updatedAt"`
}

// BundleInput untuk menerima input dari user
type BundleInput struct {
	Name        string          `json:"name" binding:"required"`
	Description string          `json:"description"`
	Image       string          `json:"image"`
	Products    []BundleProduct `json:"products" binding:"required"`
	Services    []BundleService `json:"services"`
	BundlePrice int             `json:"bundlePrice" binding:"required"`
	Stock       int             `json:"stock" binding:"required"`
	IsActive    *bool           `json:"isActive"`
}
