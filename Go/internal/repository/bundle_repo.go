package repository

import (
	"context"
	"errors"
	"time"

	"urban-mane/config"
	"urban-mane/internal/model"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var bundleCollection *mongo.Collection

func InitBundleCollection() {
	bundleCollection = config.DB.Collection("bundles")
}

func CreateBundle(bundle model.Bundle) (*model.Bundle, error) {
	bundle.ID = bson.NewObjectID()
	bundle.CreatedAt = time.Now()
	bundle.UpdatedAt = time.Now()

	_, err := bundleCollection.InsertOne(context.TODO(), bundle)
	if err != nil {
		return nil, err
	}
	return &bundle, nil
}

func GetAllBundles(search string) ([]model.Bundle, error) {
	var bundles []model.Bundle

	filter := bson.M{}
	if search != "" {
		regex := bson.M{"$regex": search, "$options": "i"}
		filter = bson.M{"$or": []bson.M{
			{"name": regex},
			{"description": regex},
		}}
	}

	opts := options.Find().SetSort(bson.M{"createdAt": -1})
	cursor, err := bundleCollection.Find(context.TODO(), filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	err = cursor.All(context.TODO(), &bundles)
	if err != nil {
		return nil, err
	}

	if bundles == nil {
		bundles = []model.Bundle{}
	}

	return bundles, nil
}

func GetBundleByID(id string) (*model.Bundle, error) {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid bundle id")
	}

	var bundle model.Bundle
	err = bundleCollection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&bundle)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("bundle not found")
		}
		return nil, err
	}

	return &bundle, nil
}

func FindBundleByName(name string) (*model.Bundle, error) {
	filter := bson.M{"name": bson.M{"$regex": "^" + name + "$", "$options": "i"}}
	var bundle model.Bundle
	err := bundleCollection.FindOne(context.TODO(), filter).Decode(&bundle)
	if err != nil {
		return nil, err
	}
	return &bundle, nil
}

func UpdateBundle(id string, bundle model.Bundle) (*model.Bundle, error) {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid bundle id")
	}

	bundle.UpdatedAt = time.Now()

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	result := bundleCollection.FindOneAndUpdate(
		context.TODO(),
		bson.M{"_id": objID},
		bson.M{"$set": bundle},
		opts,
	)

	var updatedBundle model.Bundle
	if err := result.Decode(&updatedBundle); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("bundle not found")
		}
		return nil, err
	}

	return &updatedBundle, nil
}

func DeleteBundle(id string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("invalid bundle id")
	}

	result, err := bundleCollection.DeleteOne(context.TODO(), bson.M{"_id": objID})
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return errors.New("bundle not found")
	}

	return nil
}

func UpdateBundleStock(id string, quantity int) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("invalid bundle id")
	}

	_, err = bundleCollection.UpdateOne(
		context.TODO(),
		bson.M{"_id": objID},
		bson.M{"$inc": bson.M{"stock": -quantity}},
	)

	return err
}

// FindBundleByID is an alias for GetBundleByID to match transaction service naming
func FindBundleByID(id string) (*model.Bundle, error) {
	return GetBundleByID(id)
}

// DeductBundleStock reduces bundle inventory for transactions
func DeductBundleStock(id string, quantity int) error {
	if quantity <= 0 {
		return errors.New("quantity must be greater than 0")
	}

	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("invalid bundle id")
	}

	_, err = bundleCollection.UpdateOne(
		context.TODO(),
		bson.M{"_id": objID},
		bson.M{"$inc": bson.M{"stock": -quantity}},
	)

	return err
}

// RestoreBundleStock restores bundle inventory when transaction is cancelled
func RestoreBundleStock(id string, quantity int) error {
	if quantity <= 0 {
		return errors.New("quantity must be greater than 0")
	}

	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("invalid bundle id")
	}

	_, err = bundleCollection.UpdateOne(
		context.TODO(),
		bson.M{"_id": objID},
		bson.M{"$inc": bson.M{"stock": quantity}},
	)

	return err
}

