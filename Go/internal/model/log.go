package model

import (
    "time"
    "go.mongodb.org/mongo-driver/v2/bson"
)

type ActivityLog struct {
    ID        bson.ObjectID `bson:"_id,omitempty" json:"id"`
    UserID    bson.ObjectID `bson:"user_id" json:"user_id"`
    UserName  string        `bson:"user_name" json:"user_name"`
    Role      string        `bson:"role" json:"role"`
    Action    string        `bson:"action" json:"action"` // "CREATE", "UPDATE", "DELETE", "LOGIN"
    Entity    string        `bson:"entity" json:"entity"` // "Product", "User", "Order"
    EntityID  string        `bson:"entity_id" json:"entity_id"` // ID dari object yang disentuh
    Details   string        `bson:"details" json:"details"` // Pesan deskriptif
    CreatedAt time.Time     `bson:"created_at" json:"created_at"`
}