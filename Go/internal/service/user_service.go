package service

import (
	"errors"
	"time"

	"urban-mane/internal/model"
	"urban-mane/internal/repository"

	"go.mongodb.org/mongo-driver/v2/bson"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	Register(input model.RegisterInput) (*model.User, error)
	Login(input model.LoginInput) (*model.User, string, error)
	GetAllUsers(search string) ([]model.User, error)
	GetUserByID(userID string) (*model.User, error)
	GetProfile(userID string) (*model.User, error) // <-- Ini yang diminta oleh transaction_service
	UpdateUser(userID string, input model.UpdateUserInput) (*model.User, error)
	DeleteUser(userID string) error
}

type userService struct{}

func NewUserService() UserService {
	return &userService{}
}

func (s *userService) Register(input model.RegisterInput) (*model.User, error) {
	// Cek email sudah ada atau belum (menggunakan FindUserByEmail dari repo kamu)
	existingUser, _ := repository.FindUserByEmail(input.Email)
	if existingUser != nil {
		return nil, errors.New("email sudah terdaftar")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("gagal mengenkripsi password")
	}

	// Set default role jika kosong
	role := input.Role
	if role == "" {
		role = "staff" // atau sesuai default kamu
	}

	user := model.User{
		ID:        bson.NewObjectID(),
		Name:      input.Name,
		Email:     input.Email,
		Password:  string(hashedPassword),
		Role:      role,
		Phone:     input.Phone,
		IsActive:  true,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Menggunakan CreateUser dari repo kamu
	createdUser, err := repository.CreateUser(user)
	if err != nil {
		return nil, err
	}

	// Log activity
	LogActivity("CREATE", "User", createdUser.ID.Hex(), "Membuat user baru: "+createdUser.Name+" ("+createdUser.Role+")", "", "", "")

	return createdUser, nil
}

func (s *userService) Login(input model.LoginInput) (*model.User, string, error) {
	// Menggunakan FindUserByEmail dari repo kamu
	user, err := repository.FindUserByEmail(input.Email)
	if err != nil {
		return nil, "", errors.New("email atau password salah")
	}

	// Cek apakah user aktif
	if !user.IsActive {
		return nil, "", errors.New("akun dinonaktifkan")
	}

	// Cek password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return nil, "", errors.New("email atau password salah")
	}

	// Generate token (sesuaikan dengan helper JWT yang kamu pakai)
	token, err := generateJWTToken(user)
	if err != nil {
		return nil, "", errors.New("gagal membuat token")
	}

	return user, token, nil
}

func (s *userService) GetAllUsers(search string) ([]model.User, error) {
	// Menggunakan GetAllUsers dari repo kamu yang butuh parameter search
	users, err := repository.GetAllUsers(search)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (s *userService) GetUserByID(userID string) (*model.User, error) {
	// Menggunakan FindUserByID dari repo kamu (langsung lempar string)
	user, err := repository.FindUserByID(userID)
	if err != nil {
		return nil, errors.New("user tidak ditemukan")
	}
	return user, nil
}

// INI METHOD YANG TADI ERROR DI TRANSACTION SERVICE
func (s *userService) GetProfile(userID string) (*model.User, error) {
	user, err := repository.FindUserByID(userID)
	if err != nil {
		return nil, errors.New("user tidak ditemukan")
	}
	return user, nil
}

func (s *userService) UpdateUser(userID string, input model.UpdateUserInput) (*model.User, error) {
	// 1. Cek user ada atau tidak
	existingUser, err := repository.FindUserByID(userID)
	if err != nil {
		return nil, errors.New("user tidak ditemukan")
	}

	// 2. Cek email duplikat jika user mengganti email
	if input.Email != "" && input.Email != existingUser.Email {
		existingEmail, _ := repository.FindUserByEmail(input.Email)
		if existingEmail != nil {
			return nil, errors.New("email sudah digunakan user lain")
		}
	}

	// 3. Siapkan data yang akan diupdate (sesuai tipe repo kamu: model.User)
	updatedData := *existingUser // Copy data lama
	updatedData.UpdatedAt = time.Now()

	if input.Name != "" {
		updatedData.Name = input.Name
	}
	if input.Email != "" {
		updatedData.Email = input.Email
	}
	if input.Phone != "" {
		updatedData.Phone = input.Phone
	}
	// Role tidak bisa diedit setelah user dibuat
	if input.PhotoUrl != "" {
		updatedData.PhotoUrl = input.PhotoUrl
	}

	// Update IsActive secara eksplisit (karena bool tidak bisa dicek dengan != "")
	updatedData.IsActive = input.IsActive

	if input.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, errors.New("gagal mengenkripsi password")
		}
		updatedData.Password = string(hashedPassword)
	}

	// 4. Eksekusi update ke repo (repo kamu return error, bukan user)
	err = repository.UpdateUser(userID, updatedData)
	if err != nil {
		return nil, err
	}

	// 5. Fetch ulang user yang sudah diupdate untuk dikembalikan
	finalUser, err := repository.FindUserByID(userID)
	if err != nil {
		return nil, errors.New("gagal mengambil data user terbaru")
	}

	// Log activity
	LogActivity("UPDATE", "User", userID, "Mengubah data user: "+finalUser.Name, "", "", "")

	return finalUser, nil
}

func (s *userService) DeleteUser(userID string) error {
	// Ambil data user sebelum dihapus untuk log
	user, _ := repository.FindUserByID(userID)
	userName := ""
	if user != nil {
		userName = user.Name
	}

	// Menggunakan DeleteUser dari repo kamu (langsung lempar string)
	err := repository.DeleteUser(userID)
	if err != nil {
		return err
	}

	// Log activity (SYNC - bukan goroutine)
	LogActivity("DELETE", "User", userID, "Menghapus user: "+userName, "", "", "")

	return nil
}

// Dummy function untuk JWT, silahkan ganti dengan implementasi asli kamu di folder helper/auth.go atau dimanapun kamu meletakkannya
func generateJWTToken(user *model.User) (string, error) {
	// TODO: Implementasikan logic JWT disini
	return "dummy-jwt-token", nil
}
