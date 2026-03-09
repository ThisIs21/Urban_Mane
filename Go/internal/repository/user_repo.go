package repository

import (
	"context"
	"time"

	"urban-mane/config"
	"urban-mane/internal/model"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var userCollection *mongo.Collection

func InitUserCollection() {
	userCollection = config.DB.Collection("user")
}

func CreateUser(user model.User) (*model.User, error) {

	user.ID = bson.NewObjectID()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	user.IsActive = true

	_, err := userCollection.InsertOne(context.TODO(), user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func FindUserByEmail(email string) (*model.User, error) {
	var user model.User
	// v2: bson.M tetap sama
	filter := bson.M{"email": email}
	err := userCollection.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

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
