package repository

import (
    "context"
    "errors"

    "urban-mane/config"
    "urban-mane/internal/model"

    "go.mongodb.org/mongo-driver/v2/bson"
    "go.mongodb.org/mongo-driver/v2/mongo"
    "go.mongodb.org/mongo-driver/v2/mongo/options"
)

var userCollection *mongo.Collection

func InitUserCollection() {
    userCollection = config.DB.Collection("users")
}

// CreateUser (Sudah ada dari step auth)
func CreateUser(user model.User) (*model.User, error) {
    // ... kode sebelumnya ...
    // (Saya asumsikan kode ini sudah ada, jika belum copy dari jawaban sebelumnya)
    _, err := userCollection.InsertOne(context.TODO(), user)
    if err != nil {
        return nil, err
    }
    return &user, nil
}

// FindUserByEmail (Sudah ada)
func FindUserByEmail(email string) (*model.User, error) {
    var user model.User
    filter := bson.M{"email": email}
    err := userCollection.FindOne(context.TODO(), filter).Decode(&user)
    if err != nil {
        return nil, err
    }
    return &user, nil
}

// FindUserByID (Sudah ada)
func FindUserByID(id string) (*model.User, error) {
    var user model.User
    objID, err := bson.ObjectIDFromHex(id)
    if err != nil {
        return nil, err
    }
    filter := bson.M{"_id": objID}
    err = userCollection.FindOne(context.TODO(), filter).Decode(&user)
    if err != nil {
        return nil, err
    }
    return &user, nil
}

// === FUNGSI BARU UNTUK CRUD ===

// GetAllUsers mengambil semua user dengan pagination & search
func GetAllUsers(search string) ([]model.User, error) {
    var users []model.User

    filter := bson.M{}
    if search != "" {
        // Cari di nama atau email (case insensitive)
        regex := bson.M{"$regex": search, "$options": "i"}
        filter = bson.M{"$or": []bson.M{{"name": regex}, {"email": regex}}}
    }

    // Opsi untuk sorting (misal berdasarkan created_at desc)
    opts := options.Find().SetSort(bson.D{{Key: "createdat", Value: -1}})

    cursor, err := userCollection.Find(context.TODO(), filter, opts)
    if err != nil {
        return nil, err
    }
    defer cursor.Close(context.TODO())

    if err = cursor.All(context.TODO(), &users); err != nil {
        return nil, err
    }

    return users, nil
}

// UpdateUser mengupdate data user
func UpdateUser(id string, updatedData model.User) error {
    objID, err := bson.ObjectIDFromHex(id)
    if err != nil {
        return err
    }

    filter := bson.M{"_id": objID}
    update := bson.M{"$set": updatedData}

    result, err := userCollection.UpdateOne(context.TODO(), filter, update)
    if err != nil {
        return err
    }

    if result.MatchedCount == 0 {
        return errors.New("user not found")
    }

    return nil
}

// DeleteUser menghapus user
func DeleteUser(id string) error {
    objID, err := bson.ObjectIDFromHex(id)
    if err != nil {
        return err
    }

    filter := bson.M{"_id": objID}
    result, err := userCollection.DeleteOne(context.TODO(), filter)
    if err != nil {
        return err
    }

    if result.DeletedCount == 0 {
        return errors.New("user not found")
    }

    return nil
}