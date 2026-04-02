package controller

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

// UploadFile untuk handle upload file foto produk
func (c *ProductController) UploadFile(ctx *gin.Context) {
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "File harus dikirim"})
		return
	}

	// Validasi tipe file
	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/webp": true,
		"image/gif":  true,
	}

	if !allowedTypes[file.Header.Get("Content-Type")] {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Hanya gambar yang diperbolehkan (JPEG, PNG, WebP, GIF)"})
		return
	}

	// Cari folder images dari working directory
	workDir, err := os.Getwd()
	if err != nil {
		workDir = "."
	}

	// Path untuk disimpan - coba beberapa lokasi
	uploadDir := filepath.Join(workDir, "../images/products")
	if _, err := os.Stat(uploadDir); err != nil {
		// Coba dari current directory
		uploadDir = filepath.Join(workDir, "images/products")
	}

	// Buat folder jika belum ada
	os.MkdirAll(uploadDir, 0755)

	// Buat nama file unik menggunakan timestamp
	timestamp := time.Now().Unix()
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("product_%d%s", timestamp, ext)
	filepath := filepath.Join(uploadDir, filename)

	// Simpan file ke disk
	src, err := file.Open()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuka file"})
		return
	}
	defer src.Close()

	dst, err := os.Create(filepath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan file: " + err.Error()})
		return
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengcopy file"})
		return
	}

	// Return URL relative untuk disimpan ke database
	fileURL := fmt.Sprintf("/images/products/%s", filename)

	ctx.JSON(http.StatusOK, gin.H{
		"url":     fileURL,
		"message": "File berhasil diupload",
	})
}
