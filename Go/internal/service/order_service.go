package service

import (
	"errors"
	"fmt"
	"time"

	"urban-mane/internal/model"
	"urban-mane/internal/repository"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type OrderService interface {
	// Kasir Flow
	CreateOrder(input model.CreateOrderInput) (*model.Order, error)
	GetQueueList() ([]model.Order, error) // Ambil antrian
	StartOrder(orderID string) error      // Mulai kerjakan
	FinishOrder(orderID string) error     // Selesai kerjakan -> tunggu bayar
	ProcessPayment(orderID string, input model.ProcessPaymentInput) (*model.Order, error)
	CancelOrder(orderID string) error
	GetWaitingPayment() ([]model.Order, error)
	GetOrderHistory(start, end string) ([]model.Order, error)
}

type orderService struct{}

func NewOrderService() OrderService {
	return &orderService{}
}

// 1. CreateOrder: Buat order + Kurangi Stok
func (s *orderService) CreateOrder(input model.CreateOrderInput) (*model.Order, error) {
	var items []model.OrderItem
	var totalPrice int = 0

	// Validasi & Kalkulasi Item + Kurangi Stok
	for _, v := range input.Items {
		var itemName string
		var itemPrice int

		// 1. Cek Data & Stok
		if v.Type == "product" {
			if v.ItemID == "" {
				return nil, errors.New(fmt.Sprintf("product itemId cannot be empty"))
			}
			product, err := repository.FindProductByID(v.ItemID)
			if err != nil {
				return nil, errors.New(fmt.Sprintf("product not found: itemId=%s", v.ItemID))
			}
			if product == nil {
				return nil, errors.New(fmt.Sprintf("product is nil: itemId=%s", v.ItemID))
			}
			if product.Stock < v.Quantity {
				return nil, errors.New("stok habis untuk: " + product.Name)
			}
			itemName = product.Name
			itemPrice = product.Price

			// LANGSUNG KURANGI STOK (RESERVASI)
			objID, _ := bson.ObjectIDFromHex(v.ItemID)
			repository.UpdateProductStock(objID, v.Quantity)

		} else if v.Type == "service" {
			if v.ItemID == "" {
				return nil, errors.New(fmt.Sprintf("service itemId cannot be empty"))
			}
			service, err := repository.FindServiceByID(v.ItemID)
			if err != nil {
				return nil, errors.New(fmt.Sprintf("service not found: itemId=%s", v.ItemID))
			}
			if service == nil {
				return nil, errors.New(fmt.Sprintf("service is nil: itemId=%s", v.ItemID))
			}
			itemName = service.Name
			itemPrice = service.Price
		} else {
			// Handle Bundle logic here...
			return nil, errors.New("invalid item type")
		}

		subTotal := itemPrice * v.Quantity
		totalPrice += subTotal
		objID, _ := bson.ObjectIDFromHex(v.ItemID)

		items = append(items, model.OrderItem{
			ItemID: objID, Name: itemName, Price: itemPrice,
			Quantity: v.Quantity, SubTotal: subTotal, Type: v.Type,
		})
	}

	// 2. Handle Barber Assignment
	var barberID bson.ObjectID
	var barberName string

	if input.BarberID != "" {
		bID, err := bson.ObjectIDFromHex(input.BarberID)
		if err == nil {
			barber, _ := repository.FindUserByID(input.BarberID)
			if barber != nil && barber.Role == "barber" {
				// Jika barber sibuk, order tetap masuk tapi status barber nggak diubah dulu
				// Atau kita bisa set order status jadi waiting.
				barberID = bID
				barberName = barber.Name
				// Jika barber IDLE, set jadi BUSY?
				// Sebaiknya set BUSY saat StartOrder() saja.
			}
		}
	}

	invoice := fmt.Sprintf("ORD-%d", time.Now().UnixNano())

	order := model.Order{
		InvoiceNumber: invoice,
		CustomerName:  input.CustomerName,
		Items:         items,
		TotalPrice:    totalPrice,
		GrandTotal:    totalPrice,
		BarberID:      barberID,
		BarberName:    barberName,
		Status:        model.OrderStatusWaiting, // Default status: WAITING
	}

	// 3. Simpan ke DB
	createdOrder, err := repository.CreateOrder(order)

	// Log activity
	if err == nil && createdOrder != nil {
		itemDetails := ""
		for _, item := range items {
			itemDetails += item.Name + " x" + intToString(item.Quantity) + ", "
		}
		LogActivity("CREATE", "Order", createdOrder.ID.Hex(),
			"Membuat order "+invoice+" untuk "+input.CustomerName+" dengan services: "+itemDetails,
			"", "", "")
	}

	return createdOrder, err
}

// 2. StartOrder: Barber mulai bekerja
func (s *orderService) StartOrder(orderID string) error {
	order, err := repository.GetOrderByID(orderID)
	if err != nil {
		return err
	}
	if order.Status != model.OrderStatusWaiting {
		return errors.New("order tidak dalam status waiting")
	}

	now := time.Now()
	update := bson.M{
		"status":     model.OrderStatusInProgress,
		"started_at": now,
	}

	// Set Barber jadi BUSY
	if order.BarberID.Hex() != "000000000000000000000000" {
		repository.UpdateBarberStatus(order.BarberID, model.BarberStatusBusy)
	}

	err = repository.UpdateOrder(orderID, update)
	if err != nil {
		return err
	}

	// Log activity
	LogActivity("UPDATE", "Order", orderID, "Barber "+order.BarberName+" mulai mengerjakan order "+order.InvoiceNumber,
		order.BarberID.Hex(), order.BarberName, "barber")

	return nil
}

// 3. FinishOrder: Selesai mengerjakan, tunggu bayar
func (s *orderService) FinishOrder(orderID string) error {
	order, err := repository.GetOrderByID(orderID)
	if err != nil {
		return err
	}
	if order.Status != model.OrderStatusInProgress {
		return errors.New("order tidak sedang dikerjakan")
	}

	now := time.Now()
	update := bson.M{
		"status":      model.OrderStatusWaitingPayment,
		"finished_at": now,
	}

	// Set Barber jadi IDLE lagi
	if order.BarberID.Hex() != "000000000000000000000000" {
		repository.UpdateBarberStatus(order.BarberID, model.BarberStatusIdle)
	}

	err = repository.UpdateOrder(orderID, update)
	if err != nil {
		return err
	}

	// Log activity
	LogActivity("UPDATE", "Order", orderID, "Barber "+order.BarberName+" selesai mengerjakan order "+order.InvoiceNumber,
		order.BarberID.Hex(), order.BarberName, "barber")

	return nil
}

// 4. ProcessPayment: Proses bayar
func (s *orderService) ProcessPayment(orderID string, input model.ProcessPaymentInput) (*model.Order, error) {
	order, err := repository.GetOrderByID(orderID)
	if err != nil {
		return nil, err
	}
	if order.Status != model.OrderStatusWaitingPayment {
		return nil, errors.New("order tidak siap bayar")
	}

	change := input.PayAmount - (order.GrandTotal - input.Discount)
	if change < 0 {
		return nil, errors.New("uang tidak cukup")
	}

	update := bson.M{
		"status":         model.OrderStatusCompleted,
		"pay_amount":     input.PayAmount,
		"change":         change,
		"payment_method": input.PaymentMethod,
		"discount":       input.Discount,
		"grand_total":    order.GrandTotal - input.Discount,
	}

	err = repository.UpdateOrder(orderID, update)
	if err != nil {
		return nil, err
	}

	updatedOrder, _ := repository.GetOrderByID(orderID)

	// Log activity
	LogActivity("UPDATE", "Order", orderID, "Pembayaran order "+order.InvoiceNumber+" selesai dengan metode "+input.PaymentMethod,
		"", "", "cashier")

	return updatedOrder, nil
}

// 5. CancelOrder: Batalkan + Kembalikan Stok
func (s *orderService) CancelOrder(orderID string) error {
	order, err := repository.GetOrderByID(orderID)
	if err != nil {
		return err
	}
	if order.Status == model.OrderStatusCompleted {
		return errors.New("transaksi selesai tidak bisa dibatalkan")
	}

	// KEMBALIKAN STOK
	for _, item := range order.Items {
		if item.Type == "product" {
			// Tambah stok kembali (+ quantity)
			err := repository.AddProductStock(item.ItemID, item.Quantity)
			if err != nil {
				fmt.Println("Gagal kembalikan stok item:", item.Name)
			}
		}
	}

	// Set Barber jadi IDLE jika sedang sibuk karena order ini
	if order.Status == model.OrderStatusInProgress && order.BarberID.Hex() != "000000000000000000000000" {
		repository.UpdateBarberStatus(order.BarberID, model.BarberStatusIdle)
	}

	update := bson.M{"status": model.OrderStatusCancelled}
	return repository.UpdateOrder(orderID, update)
}

// GetQueueList: Ambil antrian
func (s *orderService) GetQueueList() ([]model.Order, error) {
	// Ambil yang WAITING dan IN_PROGRESS
	waiting, _ := repository.GetOrdersByStatus(model.OrderStatusWaiting)
	progress, _ := repository.GetOrdersByStatus(model.OrderStatusInProgress)

	// Gabungkan
	return append(waiting, progress...), nil
}

func (s *orderService) GetWaitingPayment() ([]model.Order, error) {
	return repository.GetOrdersByStatus(model.OrderStatusWaitingPayment)
}

func (s *orderService) GetOrderHistory(start, end string) ([]model.Order, error) {
	// Parsing string ke time (layout RFC3339 atau "2006-01-02")
	var st, en time.Time
	var err error

	if start != "" {
		st, err = time.Parse("2006-01-02", start)
		if err != nil {
			st = time.Time{}
		}
	}
	if end != "" {
		en, err = time.Parse("2006-01-02", end)
		if err == nil {
			en = en.Add(24*time.Hour - time.Second) // Set ke akhir hari
		}
	}

	return repository.GetOrderHistory(st, en)
}
