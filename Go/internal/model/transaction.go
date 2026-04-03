package model

import (
    "time"
    "go.mongodb.org/mongo-driver/v2/bson"
)

// TransactionItem: Detail barang yang dibeli
type TransactionItem struct {
    ItemID   bson.ObjectID `bson:"item_id" json:"itemId"`
    Name     string        `bson:"name" json:"name"`      // Nama saat transaksi
    Price    int           `bson:"price" json:"price"`    // Harga satuan saat transaksi
    Quantity int           `bson:"quantity" json:"quantity"`
    SubTotal int           `bson:"sub_total" json:"subTotal"`
    Type     string        `bson:"type" json:"type"` // "product" atau "bundle"
}

// Transaction: Data Transaksi Utama
type Transaction struct {
    ID            bson.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
    InvoiceNumber string          `bson:"invoice_number" json:"invoiceNumber"`
    CashierID     bson.ObjectID   `bson:"cashier_id" json:"cashierId"`
    CashierName   string          `bson:"cashier_name" json:"cashierName"`
    CustomerName  string          `bson:"customer_name" json:"customerName"`
    Items         []TransactionItem `bson:"items" json:"items"`
    TotalPrice    int             `bson:"total_price" json:"totalPrice"` // Total harga barang
    Discount      int             `bson:"discount" json:"discount"`      // Diskon (Rp)
    GrandTotal    int             `bson:"grand_total" json:"grandTotal"` // Total Bayar
    PayAmount     int             `bson:"pay_amount" json:"payAmount"`   // Uang yang diterima
    Change        int             `bson:"change" json:"change"`          // Kembalian
    PaymentMethod string          `bson:"payment_method" json:"paymentMethod"` // "cash", "qris", "transfer"
    Status        string          `bson:"status" json:"status"` // "success", "cancelled"
    CreatedAt     time.Time       `bson:"created_at" json:"createdAt"`
}

// Input untuk membuat transaksi dari Frontend
type TransactionInput struct {
    CustomerName  string              `json:"customerName"`
    Items         []TransactionItemInput `json:"items" binding:"required"`
    Discount      int                 `json:"discount"`
    PayAmount     int                 `json:"payAmount" binding:"required"`
    PaymentMethod string              `json:"paymentMethod" binding:"required"`
}

// Input Item
type TransactionItemInput struct {
    ItemID   string `json:"itemId" binding:"required"`
    Quantity int    `json:"quantity" binding:"required"`
    Type     string `json:"type" binding:"required"` // "product" atau "bundle"
}