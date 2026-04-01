package service

import (
    "urban-mane/internal/model"
    "urban-mane/internal/repository"
)

type ProductService interface {
    CreateProduct(input model.ProductInput) (*model.Product, error)
    GetAllProducts(search string) ([]model.Product, error)
    UpdateProduct(id string, input model.ProductInput) (*model.Product, error)
    DeleteProduct(id string) error
}

type productService struct{}

func NewProductService() ProductService {
    return &productService{}
}

func (s *productService) CreateProduct(input model.ProductInput) (*model.Product, error) {
    newProduct := model.Product{
        Name:        input.Name,
        Description: input.Description,
        Price:       input.Price,
        Stock:       input.Stock,
        Category:    input.Category,
        SKU:         input.SKU,
        Image:       input.Image,
        // Logic Default
        IsActive: true, // Default product aktif
    }

    // Kalau input.IsActive diisi (tidak nil), pakai nilai input
    if input.IsActive != nil {
        newProduct.IsActive = *input.IsActive
    }

    return repository.CreateProduct(newProduct)
}

func (s *productService) GetAllProducts(search string) ([]model.Product, error) {
    return repository.GetAllProducts(search)
}

func (s *productService) UpdateProduct(id string, input model.ProductInput) (*model.Product, error) {
    existing, err := repository.FindProductByID(id)
    if err != nil {
        return nil, err
    }

    // Update fields
    existing.Name = input.Name
    existing.Description = input.Description
    existing.Price = input.Price
    existing.Stock = input.Stock
    existing.Category = input.Category
    existing.SKU = input.SKU
    existing.Image = input.Image

    if input.IsActive != nil {
        existing.IsActive = *input.IsActive
    }

    err = repository.UpdateProduct(id, *existing)
    if err != nil {
        return nil, err
    }
    return existing, nil
}

func (s *productService) DeleteProduct(id string) error {
    return repository.DeleteProduct(id)
}