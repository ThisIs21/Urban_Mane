package service

import (
	"errors"

	"urban-mane/internal/model"
	"urban-mane/internal/repository"
)

type BundleService interface {
	GetAllBundles(search string) ([]model.Bundle, error)
	GetBundleByID(id string) (*model.Bundle, error)
	CreateBundle(input model.BundleInput) (*model.Bundle, error)
	UpdateBundle(id string, input model.BundleInput) (*model.Bundle, error)
	DeleteBundle(id string) error
}

type bundleService struct{}

func NewBundleService() BundleService {
	return &bundleService{}
}

func (s *bundleService) GetAllBundles(search string) ([]model.Bundle, error) {
	bundles, err := repository.GetAllBundles(search)
	if err != nil {
		return nil, err
	}

	for i := range bundles {
		bundles[i].Image = normalizeImageURL(bundles[i].Image)
	}

	return bundles, nil
}

func (s *bundleService) GetBundleByID(id string) (*model.Bundle, error) {
	return repository.GetBundleByID(id)
}

func (s *bundleService) CreateBundle(input model.BundleInput) (*model.Bundle, error) {
	if input.BundlePrice <= 0 {
		return nil, errors.New("bundle price must be greater than 0")
	}

	if input.Stock < 0 {
		return nil, errors.New("stock cannot be negative")
	}

	isActive := true
	if input.IsActive != nil {
		isActive = *input.IsActive
	}

	bundle := model.Bundle{
		Name:        input.Name,
		Description: input.Description,
		Image:       input.Image,
		Products:    input.Products,
		Services:    input.Services,
		BundlePrice: input.BundlePrice,
		Stock:       input.Stock,
		IsActive:    isActive,
	}

	return repository.CreateBundle(bundle)
}

func (s *bundleService) UpdateBundle(id string, input model.BundleInput) (*model.Bundle, error) {
	if len(input.Products) == 0 && len(input.Services) == 0 {
		return nil, errors.New("bundle must contain at least one product or service")
	}

	if input.BundlePrice <= 0 {
		return nil, errors.New("bundle price must be greater than 0")
	}

	if input.Stock < 0 {
		return nil, errors.New("stock cannot be negative")
	}

	isActive := true
	if input.IsActive != nil {
		isActive = *input.IsActive
	}

	bundle := model.Bundle{
		Name:        input.Name,
		Description: input.Description,
		Image:       input.Image,
		Products:    input.Products,
		Services:    input.Services,
		BundlePrice: input.BundlePrice,
		Stock:       input.Stock,
		IsActive:    isActive,
	}

	return repository.UpdateBundle(id, bundle)
}

func (s *bundleService) DeleteBundle(id string) error {
	bundle, err := repository.GetBundleByID(id)
	if err != nil {
		return err
	}
	deleteLocalImage(bundle.Image)
	return repository.DeleteBundle(id)
}

