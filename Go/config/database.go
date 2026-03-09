package config

import (
    "context"
    "log"
    "os"
    "time"

    "github.com/joho/godotenv"
    // v2: Import mongo dan options
    "go.mongodb.org/mongo-driver/v2/mongo"
    "go.mongodb.org/mongo-driver/v2/mongo/options"
)

var DB *mongo.Database

func ConnectDB() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    uri := os.Getenv("MONGO_URI")
    dbName := os.Getenv("DB_NAME")

    // v2: options.ClientOptions tidak berubah signifikan, tapi pastikan import v2
    client, err := mongo.Connect(options.Client().ApplyURI(uri))
    if err != nil {
        log.Fatal(err)
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    // v2: Ping syntax sedikit berbeda jika context wajib diisi, biasanya sama.
    err = client.Ping(ctx, nil)
    if err != nil {
        log.Fatal("Could not connect to MongoDB: ", err)
    }

    log.Println("Connected to MongoDB (Driver v2)!")
    DB = client.Database(dbName)
}