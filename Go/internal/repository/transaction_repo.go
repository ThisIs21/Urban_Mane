package repository

import (
    "context"
    "time"

    "urban-mane/config"
    "urban-mane/internal/model"

    "go.mongodb.org/mongo-driver/v2/bson"
    "go.mongodb.org/mongo-driver/v2/mongo"
    "go.mongodb.org/mongo-driver/v2/mongo/options"
)

var transactionCollection *mongo.Collection

func InitTransactionCollection() {
    transactionCollection = config.DB.Collection("transactions")
}

// CreateTransaction menyimpan data transaksi baru
func CreateTransaction(transaction model.Transaction) (*model.Transaction, error) {
    transaction.ID = bson.NewObjectID()
    transaction.CreatedAt = time.Now()
    
    _, err := transactionCollection.InsertOne(context.TODO(), transaction)
    if err != nil {
        return nil, err
    }
    return &transaction, nil
}

// UpdateProductStock mengurangi stok produk
func UpdateProductStock(productID bson.ObjectID, quantity int) error {
    // Kita akan update stok: stok = stok - quantity
    filter := bson.M{"_id": productID}
    update := bson.M{"$inc": bson.M{"stock": -quantity}} // $inc adalah operator increment (bisa minus)

    _, err := productCollection.UpdateOne(context.TODO(), filter, update)
    return err
}

// GetAllTransactions dengan filter tanggal & search
func GetAllTransactions(startDate, endDate time.Time, search string) ([]model.Transaction, error) {
    var transactions []model.Transaction

    filter := bson.M{}

    // Filter Tanggal
    if !startDate.IsZero() && !endDate.IsZero() {
        filter["created_at"] = bson.M{
            "$gte": startDate,
            "$lte": endDate,
        }
    }

    // Filter Search (Invoice atau Customer)
    if search != "" {
        regex := bson.M{"$regex": search, "$options": "i"}
        filter["$or"] = []bson.M{
            {"invoice_number": regex},
            {"customer_name": regex},
        }
    }

    opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})
    cursor, err := transactionCollection.Find(context.TODO(), filter, opts)
    if err != nil {
        return nil, err
    }
    defer cursor.Close(context.TODO())

    if err = cursor.All(context.TODO(), &transactions); err != nil {
        return nil, err
    }

    return transactions, nil
}