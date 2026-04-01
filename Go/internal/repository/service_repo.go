package repository

import (
	"context"
	"errors"
	"time"
	"urban-mane/internal/model"
	"urban-mane/pkg/db"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// GetAllServices mengambil semua services dengan opsi search
func GetAllServices(search string) ([]model.Service, error) {
	collection := db.GetCollection("services")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{}

	// Jika ada search, filter berdasarkan nama atau kategori
	if search != "" {
		filter = bson.M{
			"$or": []bson.M{
				{"name": bson.M{"$regex": search, "$options": "i"}},
				{"category": bson.M{"$regex": search, "$options": "i"}},
			},
		}
	}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var services []model.Service
	if err = cursor.All(ctx, &services); err != nil {
		return nil, err
	}

	if services == nil {
		services = []model.Service{}
	}

	return services, nil
}

// CreateService membuat service baru di database
func CreateService(service model.Service) (*model.Service, error) {
	collection := db.GetCollection("services")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	service.ID = bson.NewObjectID()
	service.CreatedAt = time.Now()
	service.UpdatedAt = time.Now()

	result, err := collection.InsertOne(ctx, service)
	if err != nil {
		return nil, err
	}

	service.ID = result.InsertedID.(bson.ObjectID)
	return &service, nil
}

// FindServiceByID mencari service berdasarkan ID
func FindServiceByID(id string) (*model.Service, error) {
	collection := db.GetCollection("services")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("ID tidak valid")
	}

	var service model.Service
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&service)
	if err == mongo.ErrNoDocuments {
		return nil, errors.New("service tidak ditemukan")
	}
	if err != nil {
		return nil, err
	}

	return &service, nil
}

// UpdateService mengupdate service yang ada
func UpdateService(id string, svc model.Service) (*model.Service, error) {
	collection := db.GetCollection("services")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("ID tidak valid")
	}

	update := bson.M{
		"$set": bson.M{
			"name":             svc.Name,
			"price":            svc.Price,
			"duration":         svc.Duration,
			"category":         svc.Category,
			"requiredProducts": svc.RequiredProducts,
			"isActive":         svc.IsActive,
			"updatedAt":        time.Now(),
		},
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		return nil, err
	}

	svc.ID = objID
	return &svc, nil
}

// DeleteService menghapus service
func DeleteService(id string) error {
	collection := db.GetCollection("services")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID tidak valid")
	}

	result, err := collection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return errors.New("service tidak ditemukan")
	}

	return nil
}

// GetServicesByCategory mengambil services berdasarkan kategori
func GetServicesByCategory(category string) ([]model.Service, error) {
	collection := db.GetCollection("services")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"category": category, "isActive": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var services []model.Service
	if err = cursor.All(ctx, &services); err != nil {
		return nil, err
	}

	if services == nil {
		services = []model.Service{}
	}

	return services, nil
}
