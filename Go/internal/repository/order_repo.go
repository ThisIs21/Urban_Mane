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

var orderCollection *mongo.Collection

func InitOrderCollection() {
    orderCollection = config.DB.Collection("orders")
}

// CreateOrder: Simpan order baru
func CreateOrder(order model.Order) (*model.Order, error) {
    order.ID = bson.NewObjectID()
    order.CreatedAt = time.Now()
    
    _, err := orderCollection.InsertOne(context.TODO(), order)
    if err != nil {
        return nil, err
    }
    return &order, nil
}

// GetOrderByID: Cari order by ID
func GetOrderByID(id string) (*model.Order, error) {
    var order model.Order
    objID, err := bson.ObjectIDFromHex(id)
    if err != nil {
        return nil, err
    }

    filter := bson.M{"_id": objID}
    err = orderCollection.FindOne(context.TODO(), filter).Decode(&order)
    if err != nil {
        return nil, err
    }
    return &order, nil
}

// UpdateOrder: Update order umum
func UpdateOrder(id string, update bson.M) error {
    objID, _ := bson.ObjectIDFromHex(id)
    filter := bson.M{"_id": objID}
    updateDoc := bson.M{"$set": update}

    _, err := orderCollection.UpdateOne(context.TODO(), filter, updateDoc)
    return err
}

// GetOrdersByStatus: Ambil order berdasarkan status (untuk antrian/kasir)
func GetOrdersByStatus(status string) ([]model.Order, error) {
    var orders []model.Order
    filter := bson.M{}
    if status != "" {
        filter["status"] = status
    }
    
    opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: 1}}) // Urutkan paling lama
    cursor, err := orderCollection.Find(context.TODO(), filter, opts)
    if err != nil {
        return nil, err
    }
    defer cursor.Close(context.TODO())
    cursor.All(context.TODO(), &orders)
    return orders, nil
}

// UpdateBarberStatus: Update status barber (IDLE/BUSY)
func UpdateBarberStatus(barberID bson.ObjectID, status string) error {
    filter := bson.M{"_id": barberID}
    update := bson.M{"$set": bson.M{"status": status}}
    _, err := userCollection.UpdateOne(context.TODO(), filter, update)
    return err
}

// Tambahkan di bawah fungsi lainnya
func GetOrderHistory(startDate, endDate time.Time) ([]model.Order, error) {
    var orders []model.Order
    filter := bson.M{"status": model.OrderStatusCompleted}

    // Filter tanggal jika ada
    if !startDate.IsZero() && !endDate.IsZero() {
        filter["created_at"] = bson.M{
            "$gte": startDate,
            "$lte":  endDate,
        }
    }

    opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})
    cursor, err := orderCollection.Find(context.TODO(), filter, opts)
    if err != nil {
        return nil, err
    }
    defer cursor.Close(context.TODO())
    cursor.All(context.TODO(), &orders)
    return orders, nil
}

func GetTotalRevenue() (int, error) {
    match := bson.M{"status": model.OrderStatusCompleted}
    group := bson.M{
        "_id":   nil,
        "total": bson.M{"$sum": "$grand_total"},
    }

    cursor, err := orderCollection.Aggregate(context.TODO(), []bson.M{
        {"$match": match},
        {"$group": group},
    })
    if err != nil {
        return 0, err
    }
    
    var result []struct {
        Total int `bson:"total"`
    }
    if err = cursor.All(context.TODO(), &result); err != nil {
        return 0, err
    }
    
    if len(result) == 0 {
        return 0, nil
    }
    return result[0].Total, nil
}

func GetTopBarbers(limit int) ([]bson.M, error) {
    pipeline := []bson.M{
        {"$match": bson.M{"status": model.OrderStatusCompleted}},
        {"$group": bson.M{
            "_id":      "$barber_id",
            "barber_name": bson.M{"$first": "$barber_name"},
            "total_revenue": bson.M{"$sum": "$grand_total"},
        }},
        {"$sort": bson.M{"total_revenue": -1}},
        {"$limit": limit},
    }
    
    cursor, err := orderCollection.Aggregate(context.TODO(), pipeline)
    if err != nil { return nil, err }
    
    var results []bson.M
    cursor.All(context.TODO(), &results)
    return results, nil
}

func GetRevenueByDateRange(start, end time.Time) (int, error) {
    match := bson.M{
        "status":      model.OrderStatusCompleted,
        "created_at": bson.M{"$gte": start, "$lte": end},
    }
    group := bson.M{"_id": nil, "total": bson.M{"$sum": "$grand_total"}}

    cursor, err := orderCollection.Aggregate(context.TODO(), []bson.M{{"$match": match}, {"$group": group}})
    if err != nil { return 0, err }

    var result []struct {
        Total int `bson:"total"`
    }
    if err = cursor.All(context.TODO(), &result); err != nil { return 0, err }
    if len(result) == 0 { return 0, nil }
    return result[0].Total, nil
}

func CountCompletedOrders() (int64, error) {
    return orderCollection.CountDocuments(context.TODO(), bson.M{"status": model.OrderStatusCompleted})
}

func GetRecentOrders(limit int) ([]model.Order, error) {
    opts := options.Find().
        SetSort(bson.D{{Key: "created_at", Value: -1}}).
        SetLimit(int64(limit))
    
    cursor, err := orderCollection.Find(context.TODO(), bson.M{"status": model.OrderStatusCompleted}, opts)
    if err != nil { return nil, err }
    var orders []model.Order
    cursor.All(context.TODO(), &orders)
    return orders, nil
}

// Weekly Revenue: Array of { date: "2023-10-27", total: 50000 }
func GetWeeklyRevenue() ([]bson.M, error) {
    // Logic: Group by date string (YYYY-MM-DD) for last 7 days
    // Simplifikasi: Group by "%Y-%m-%d"
    pipeline := []bson.M{
        {"$match": bson.M{"status": model.OrderStatusCompleted}},
        {"$project": bson.M{
            "date": bson.M{"$dateToString": bson.M{"format": "%Y-%m-%d", "date": "$created_at"}},
            "grand_total": 1,
        }},
        {"$group": bson.M{
            "_id":   "$date",
            "total": bson.M{"$sum": "$grand_total"},
        }},
        {"$sort": bson.M{"_id": 1}}, // Ascending for chart
        {"$limit": 7},
    }
    
    cursor, err := orderCollection.Aggregate(context.TODO(), pipeline)
    if err != nil { return nil, err }
    
    var results []bson.M
    cursor.All(context.TODO(), &results)
    return results, nil
}

// Sales Distribution: Group by Item Type (product vs service)
func GetSalesDistribution() ([]bson.M, error) {
    pipeline := []bson.M{
        {"$unwind": "$items"},
        {"$group": bson.M{
            "_id":   "$items.type",
            "total": bson.M{"$sum": "$items.sub_total"},
        }},
    }
    
    cursor, err := orderCollection.Aggregate(context.TODO(), pipeline)
    if err != nil { return nil, err }
    
    var results []bson.M
    cursor.All(context.TODO(), &results)
    return results, nil
}