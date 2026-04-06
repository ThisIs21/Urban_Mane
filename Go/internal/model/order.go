package model

import (
    "time"
    "go.mongodb.org/mongo-driver/v2/bson"
)

// Order Status
const (
    OrderStatusWaiting       = "waiting"         // Menunggu antrian/barber
    OrderStatusInProgress    = "in_progress"    // Sedang dikerjakan
    OrderStatusWaitingPayment = "waiting_payment" // Selesai, menunggu bayar
    OrderStatusCompleted     = "completed"       // Selesai bayar
    OrderStatusCancelled     = "cancelled"       // Dibatalkan
)

// Barber Status (untuk field di User)
const (
    BarberStatusIdle  = "idle"  // Sedia
    BarberStatusBusy  = "busy"  // Sibuk
)

// OrderItem: Detail item di dalam order
type OrderItem struct {
    ItemID   bson.ObjectID `bson:"item_id" json:"itemId"`
    Name     string        `bson:"name" json:"name"`
    Price    int           `bson:"price" json:"price"`
    Quantity int           `bson:"quantity" json:"quantity"`
    SubTotal int           `bson:"sub_total" json:"subTotal"`
    Type     string        `bson:"type" json:"type"` // "product", "service", "bundle"
}

// Order: Header transaksi
type Order struct {
    ID            bson.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    InvoiceNumber string          `bson:"invoice_number" json:"invoiceNumber"`
    
    // Customer Info
    CustomerName string `bson:"customer_name" json:"customerName"`
    
    // Barber Info (Assignee)
    BarberID   bson.ObjectID `bson:"barber_id,omitempty" json:"barberId"`
    BarberName string        `bson:"barber_name,omitempty" json:"barberName"`
    
    // Items
    Items      []OrderItem `bson:"items" json:"items"`
    TotalPrice int         `bson:"total_price" json:"totalPrice"`
    Discount   int         `bson:"discount" json:"discount"`
    GrandTotal int         `bson:"grand_total" json:"grandTotal"`
    
    // Payment
    PayAmount     int    `bson:"pay_amount" json:"payAmount"`
    Change        int    `bson:"change" json:"change"`
    PaymentMethod string `bson:"payment_method" json:"paymentMethod"`
    
    // Status & Time
    Status     string    `bson:"status" json:"status"`
    CreatedAt  time.Time `bson:"created_at" json:"createdAt"`
    StartedAt  *time.Time `bson:"started_at,omitempty" json:"startedAt"`
    FinishedAt *time.Time `bson:"finished_at,omitempty" json:"finishedAt"`
}

// Input untuk buat order baru
type CreateOrderInput struct {
    CustomerName string              `json:"customerName"`
    Items        []OrderItemInput `json:"items" binding:"required"`
    BarberID     string              `json:"barberId"` // ID Barber yang dipilih
}

// Input untuk item
type OrderItemInput struct {
    ItemID   string `json:"itemId" binding:"required"`
    Quantity int    `json:"quantity" binding:"required"`
    Type     string `json:"type" binding:"required"`
}

// Input untuk proses pembayaran
type ProcessPaymentInput struct {
    PayAmount     int    `json:"payAmount" binding:"required"`
    PaymentMethod string `json:"paymentMethod" binding:"required"`
    Discount      int    `json:"discount"`
}