package service

import (
	"errors"
	"time"
	"urban-mane/internal/model"
	"urban-mane/internal/repository"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// Interface untuk ServiceService
type ServiceService interface {
	GetAllServices(search string) ([]model.Service, error)
	CreateService(input model.ServiceInput) (*model.Service, error)
	UpdateService(id string, input model.ServiceInput) (*model.Service, error)
	DeleteService(id string) error
}

type serviceService struct{}

func NewServiceService() ServiceService {
	return &serviceService{}
}

// GetAllServices mengambil semua services dengan fitur search
func (s *serviceService) GetAllServices(search string) ([]model.Service, error) {
	return repository.GetAllServices(search)
}

// CreateService membuat service baru
func (s *serviceService) CreateService(input model.ServiceInput) (*model.Service, error) {
	// Validasi minimal
	if input.Name == "" || input.Price <= 0 {
		return nil, errors.New("nama dan harga harus diisi dengan benar")
	}

	// Siapkan object service
	newService := model.Service{
		Name:             input.Name,
		Price:            input.Price,
		Duration:         input.Duration,
		Category:         input.Category,
		RequiredProducts: input.RequiredProducts,
		IsActive:         true, // Default aktif
		CreatedAt:        time.Now(),
		UpdatedAt:        time.Now(),
	}

	// Simpan ke database
	return repository.CreateService(newService)
}

// UpdateService mengupdate service yang ada
func (s *serviceService) UpdateService(id string, input model.ServiceInput) (*model.Service, error) {
	// Validasi ID
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("ID tidak valid")
	}

	// Ambil service dari database
	existingService, err := repository.FindServiceByID(id)
	if err != nil {
		return nil, errors.New("service tidak ditemukan")
	}

	// Update field jika ada nilai baru
	if input.Name != "" {
		existingService.Name = input.Name
	}
	if input.Price > 0 {
		existingService.Price = input.Price
	}
	if input.Duration > 0 {
		existingService.Duration = input.Duration
	}
	if input.Category != "" {
		existingService.Category = input.Category
	}
	if input.RequiredProducts != nil {
		existingService.RequiredProducts = input.RequiredProducts
	}
	if input.IsActive != nil {
		existingService.IsActive = *input.IsActive
	}
	existingService.UpdatedAt = time.Now()

	// Simpan perubahan
	return repository.UpdateService(id, *existingService)
}

// DeleteService menghapus service
func (s *serviceService) DeleteService(id string) error {
	return repository.DeleteService(id)
}
