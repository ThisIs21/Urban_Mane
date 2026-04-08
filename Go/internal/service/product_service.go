package service

import (
	"errors"
	"fmt"
	"time"


	"urban-mane/internal/model"
	"urban-mane/internal/repository"
)

type ProductService interface {
	CreateProduct(input model.ProductInput) (*model.Product, error)
	GetAllProducts(search string) ([]model.Product, error)
	GetProductByID(id string) (*model.Product, error) // <--- TAMBAHKAN INI
	UpdateProduct(id string, input model.ProductInput) (*model.Product, error)
	DeleteProduct(id string) error
	DeductProductStock(productId string, quantity int) error
	UpdateStock(id string, quantity int, operationType string) (*model.Product, error)
}

type productService struct{}

func (s *productService) GetProductByID(id string) (*model.Product, error) {
	return repository.FindProductByID(id)
}

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
		Image:       input.Image,
		IsActive:    true,
	}

	if input.IsActive != nil {
		newProduct.IsActive = *input.IsActive
	}

	// Log activity (SYNC - not in goroutine)
	LogActivity("CREATE", "Product", newProduct.ID.Hex(), "Membuat produk baru: "+newProduct.Name+" dengan harga "+intToString(newProduct.Price), "", "", "")

	return &newProduct, nil
}

func (s *productService) GetAllProducts(search string) ([]model.Product, error) {
	products, err := repository.GetAllProducts(search)
	if err != nil {
		return nil, err
	}

	for i := range products {
		products[i].Image = normalizeImageURL(products[i].Image)
	}

	return products, nil
}

func (s *productService) UpdateProduct(id string, input model.ProductInput) (*model.Product, error) {
	existing, err := repository.FindProductByID(id)
	if err != nil {
		return nil, err
	}

	existing.Name = input.Name
	existing.Description = input.Description
	existing.Price = input.Price
	existing.Stock = input.Stock
	existing.Category = input.Category
	existing.Image = input.Image

	if input.IsActive != nil {
		existing.IsActive = *input.IsActive
	}

	err = repository.UpdateProduct(id, *existing)
	if err != nil {
		return nil, err
	}

	// Log activity
	LogActivity("UPDATE", "Product", id, "Mengubah produk: "+existing.Name, "", "", "")

	return existing, nil
}

func (s *productService) DeleteProduct(id string) error {
	product, err := repository.FindProductByID(id)
	if err != nil {
		return err
	}
	deleteLocalImage(product.Image)
	err = repository.DeleteProduct(id)
	if err != nil {
		return err
	}

	// Log activity
	LogActivity("DELETE", "Product", id, "Menghapus produk: "+product.Name, "", "", "")

	return nil
}

func (s *productService) DeductProductStock(productId string, quantity int) error {
	if quantity <= 0 {
		return errors.New("quantity harus lebih dari 0")
	}

	product, err := repository.FindProductByID(productId)
	if err != nil {
		return err
	}

	if product.Stock < quantity {
		return errors.New("stok produk tidak cukup")
	}

	product.Stock -= quantity

	err = repository.UpdateProduct(productId, *product)
	if err != nil {
		return err
	}

	// Log activity (SYNC - not in goroutine)
	LogActivity("UPDATE", "Product", productId, "Mengurangi stok: "+product.Name+" sebanyak "+intToString(quantity), "", "", "")

	return nil
}

func (s *productService) UpdateStock(id string, quantity int, operationType string) (*model.Product, error) {
    product, err := repository.FindProductByID(id)
    if err != nil {
        return nil, errors.New("produk tidak ditemukan")
    }

    switch operationType {
    case "add":
        product.Stock += quantity
    case "subtract":
        if product.Stock < quantity {
            return nil, errors.New("stok tidak cukup")
        }
        product.Stock -= quantity
    default: // "set" atau kosong
        product.Stock = quantity
    }

    product.UpdatedAt = time.Now()

    err = repository.UpdateProduct(id, *product)
    if err != nil {
        return nil, err
    }

    LogActivity("UPDATE", "Product", id, 
        fmt.Sprintf("Update stok %s: %s → %d unit", operationType, product.Name, product.Stock), 
        "", "", "")

    return product, nil
}