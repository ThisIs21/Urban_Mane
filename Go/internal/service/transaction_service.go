package service

import (
	"errors"
	"fmt"
	"time"

	"urban-mane/internal/model"
	"urban-mane/internal/repository"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type TransactionService interface {
	CreateTransaction(input model.TransactionInput, cashierID string) (*model.Transaction, error)
	GetAllTransactions(startDate, endDate string, search string) ([]model.Transaction, error)
}

// 1. Ubah Struct: Tambahkan field untuk menampung dependency
type transactionService struct {
	productService ProductService
	bundleService  BundleService
	userService    UserService
}

// 2. Ubah Constructor: Terima parameter sesuai yg dikirim main.go
func NewTransactionService(ps ProductService, bs BundleService, us UserService) TransactionService {
	return &transactionService{
		productService: ps,
		bundleService:  bs,
		userService:    us,
	}
}

func (s *transactionService) CreateTransaction(input model.TransactionInput, cashierID string) (*model.Transaction, error) {
	var items []model.TransactionItem
	var totalPrice int = 0

	// Validasi & Kalkulasi Item
	for _, v := range input.Items {
		var itemName string
		var itemPrice int

		if v.Type == "product" {
			// Gunakan productService yang sudah di-inject
			product, err := s.productService.GetProductByID(v.ItemID)
			if err != nil {
				return nil, errors.New("product not found: " + v.ItemID)
			}

			if product.Stock < v.Quantity {
				return nil, errors.New("stok tidak cukup untuk: " + product.Name)
			}

			itemName = product.Name
			itemPrice = product.Price

			// Kurangi Stok
			objID, _ := bson.ObjectIDFromHex(v.ItemID)
			if err := repository.UpdateProductStock(objID, v.Quantity); err != nil {
				return nil, err
			}

		} else if v.Type == "bundle" {
			// Gunakan bundleService yang sudah di-inject
			bundle, err := s.bundleService.GetBundleByID(v.ItemID)
			if err != nil {
				return nil, errors.New("bundle not found: " + v.ItemID)
			}
			itemName = bundle.Name
			itemPrice = bundle.BundlePrice

			// Kurangi stok untuk tiap produk di dalam bundle
			for _, prod := range bundle.Products {
				totalQtyToDeduct := prod.Quantity * v.Quantity
				
				// Optional: Cek apakah stok produk di dalam bundle cukup
				productInfo, pErr := s.productService.GetProductByID(prod.ProductID.Hex())
				if pErr == nil && productInfo.Stock < totalQtyToDeduct {
					return nil, errors.New("stok produk " + productInfo.Name + " dalam bundle tidak cukup")
				}
				
				if err := repository.UpdateProductStock(prod.ProductID, totalQtyToDeduct); err != nil {
					return nil, err
				}
			}

			// Kurangi stok dari bundlenya sendiri (harus setelah cek stok mencukupi)
			if bundle.Stock < v.Quantity {
				return nil, errors.New("stok paket bundle habis: " + bundle.Name)
			}
			repository.DeductBundleStock(v.ItemID, v.Quantity)
		} else {
			return nil, errors.New("invalid item type")
		}

		subTotal := itemPrice * v.Quantity
		totalPrice += subTotal

		objID, _ := bson.ObjectIDFromHex(v.ItemID)
		items = append(items, model.TransactionItem{
			ItemID:   objID,
			Name:     itemName,
			Price:    itemPrice,
			Quantity: v.Quantity,
			SubTotal: subTotal,
			Type:     v.Type,
		})
	}

	// Kalkulasi Total
	grandTotal := totalPrice - input.Discount
	change := input.PayAmount - grandTotal

	if change < 0 {
		return nil, errors.New("uang pembayaran kurang")
	}

	// Ambil Nama Kasir
	cashierObjID, _ := bson.ObjectIDFromHex(cashierID)
	cashier, _ := s.userService.GetProfile(cashierID) // Pastikan ada method ini di UserService
	cashierName := "Unknown"
	if cashier != nil {
		cashierName = cashier.Name
	}

	today := time.Now()
	invoice := fmt.Sprintf("URM-%s-%d", today.Format("20060102"), time.Now().UnixNano()%10000)

	transaction := model.Transaction{
		InvoiceNumber: invoice,
		CashierID:     cashierObjID,
		CashierName:   cashierName,
		CustomerName:  input.CustomerName,
		Items:         items,
		TotalPrice:    totalPrice,
		Discount:      input.Discount,
		GrandTotal:    grandTotal,
		PayAmount:     input.PayAmount,
		Change:        change,
		PaymentMethod: input.PaymentMethod,
		Status:        "success",
	}

	createdTransaction, err := repository.CreateTransaction(transaction)

	// Log activity
	if err == nil && createdTransaction != nil {
		itemDetails := ""
		for _, item := range items {
			itemDetails += item.Name + " x" + intToString(item.Quantity) + ", "
		}
		LogActivity("CREATE", "Transaction", createdTransaction.ID.Hex(),
			"Membuat transaksi invoice "+invoice+" untuk "+input.CustomerName+" dengan items: "+itemDetails,
			cashierID, cashierName, "cashier")
	}

	return createdTransaction, err
}

func (s *transactionService) GetAllTransactions(startDate, endDate string, search string) ([]model.Transaction, error) {
	return repository.GetAllTransactions(time.Time{}, time.Time{}, search)
}
