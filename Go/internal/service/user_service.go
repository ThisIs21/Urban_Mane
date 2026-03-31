package service

import (
    "errors"
    "urban-mane/internal/model"
    "urban-mane/internal/repository"
    "golang.org/x/crypto/bcrypt"
)

type UserService interface {
    GetAllUsers(search string) ([]model.User, error)
	CreateUser(input model.RegisterInput) (*model.User, error)
    UpdateUser(id string, input model.UpdateUserInput) (*model.User, error)
    DeleteUser(id string) error
}

type userService struct{}

func NewUserService() UserService {
    return &userService{}
}

func (s *userService) GetAllUsers(search string) ([]model.User, error) {
    return repository.GetAllUsers(search)
}

func (s *userService) CreateUser(input model.RegisterInput) (*model.User, error) {
    // 1. Cek apakah email sudah terdaftar
    existingUser, _ := repository.FindUserByEmail(input.Email)
    if existingUser != nil {
        return nil, errors.New("email already registered")
    }

    // 2. Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
    if err != nil {
        return nil, err
    }

    // 3. Siapkan object user
    newUser := model.User{
        Name:     input.Name,
        Email:    input.Email,
        Password: string(hashedPassword),
        Role:     input.Role,
        Phone:    input.Phone,
        PhotoUrl: "",
        IsActive: true, // Default aktif
    }

    // 4. Simpan ke database
    return repository.CreateUser(newUser)
}

func (s *userService) UpdateUser(id string, input model.UpdateUserInput) (*model.User, error) {
    existingUser, err := repository.FindUserByID(id)
    if err != nil {
        return nil, errors.New("user not found")
    }

    // Update field hanya jika tidak kosong
    if input.Name != "" {
        existingUser.Name = input.Name
    }
    if input.Phone != "" {
        existingUser.Phone = input.Phone
    }
    if input.Role != "" {
        existingUser.Role = input.Role
    }

    // Cek Email
    if input.Email != "" && input.Email != existingUser.Email {
        checkUser, _ := repository.FindUserByEmail(input.Email)
        if checkUser != nil {
            return nil, errors.New("email already in use")
        }
        existingUser.Email = input.Email
    }

    // Cek Password
    if input.Password != "" {
        hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
        if err != nil {
            return nil, err
        }
        existingUser.Password = string(hashedPassword)
    }

    // Update PhotoUrl jika ada
    if input.PhotoUrl != "" {
        existingUser.PhotoUrl = input.PhotoUrl
    }

    // Update IsActive
    existingUser.IsActive = input.IsActive

    err = repository.UpdateUser(id, *existingUser)
    if err != nil {
        return nil, err
    }

    return existingUser, nil
}

func (s *userService) DeleteUser(id string) error {
    return repository.DeleteUser(id)
}