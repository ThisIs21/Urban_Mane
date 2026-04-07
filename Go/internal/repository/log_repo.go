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

var logCollection *mongo.Collection

func InitLogCollection() {
    logCollection = config.DB.Collection("activity_logs")
}

func CreateLog(log model.ActivityLog) error {
    log.ID = bson.NewObjectID()
    log.CreatedAt = time.Now()
    _, err := logCollection.InsertOne(context.TODO(), log)
    return err
}

func GetLogs(limit int) ([]model.ActivityLog, error) {
    var logs []model.ActivityLog
    opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}}).SetLimit(int64(limit))
    
    cursor, err := logCollection.Find(context.TODO(), bson.M{}, opts)
    if err != nil { 
        return nil, err 
    }
    defer cursor.Close(context.TODO())
    
    err = cursor.All(context.TODO(), &logs)
    if err != nil {
        return nil, err
    }
    return logs, nil
}