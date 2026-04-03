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

var productCollection *mongo.Collection

func InitProductCollection() {
	productCollection = config.DB.Collection("products")
}

func CreateProduct(product model.Product) (*model.Product, error) {
	product.ID = bson.NewObjectID()
	product.CreatedAt = time.Now()
	product.UpdatedAt = time.Now()

	// Set default IsActive jika kosong
	if product.IsActive == false { // Perhatikan logika ini, mungkin lebih baik di service
		// biarkan service yang handle default
	}

	_, err := productCollection.InsertOne(context.TODO(), product)
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func GetAllProducts(search string) ([]model.Product, error) {
	var products []model.Product

	filter := bson.M{}
	if search != "" {
		regex := bson.M{"$regex": search, "$options": "i"}
		// Cari di Nama, SKU, atau Kategori
		filter = bson.M{"$or": []bson.M{
			{"name": regex},
			{"sku": regex},
			{"category": regex},
		}}
	}

	opts := options.Find().SetSort(bson.D{{Key: "createdat", Value: -1}})
	cursor, err := productCollection.Find(context.TODO(), filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	if err = cursor.All(context.TODO(), &products); err != nil {
		return nil, err
	}
	return products, nil
}

func FindProductByID(id string) (*model.Product, error) {
	var product model.Product
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": objID}
	err = productCollection.FindOne(context.TODO(), filter).Decode(&product)
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func FindProductByName(name string) (*model.Product, error) {
	var product model.Product
	filter := bson.M{"name": bson.M{"$regex": "^" + name + "$", "$options": "i"}}
	err := productCollection.FindOne(context.TODO(), filter).Decode(&product)
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func UpdateProduct(id string, product model.Product) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	product.UpdatedAt = time.Now()
	filter := bson.M{"_id": objID}
	update := bson.M{"$set": product}

	result, err := productCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}
	if result.MatchedCount == 0 {
		return errors.New("product not found")
	}
	return nil
}

func DeleteProduct(id string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	filter := bson.M{"_id": objID}
	result, err := productCollection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return err
	}
	if result.DeletedCount == 0 {
		return errors.New("product not found")
	}
	return nil
}

func DeductProductStock(id string, quantity int) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("invalid product id")
	}

	_, err = productCollection.UpdateOne(
		context.TODO(),
		bson.M{"_id": objID},
		bson.M{"$inc": bson.M{"stock": -quantity}},
	)

	return err
}

// RestoreProductStock restores product inventory when transaction is cancelled
func RestoreProductStock(id string, quantity int) error {
	if quantity <= 0 {
		return errors.New("quantity must be greater than 0")
	}

	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("invalid product id")
	}

	_, err = productCollection.UpdateOne(
		context.TODO(),
		bson.M{"_id": objID},
		bson.M{"$inc": bson.M{"stock": quantity}},
	)

	return err
}
