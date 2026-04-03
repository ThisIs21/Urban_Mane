package service

import (
	"os"
	"path/filepath"
	"strings"
)

func deleteLocalImage(fileURL string) {
	if fileURL == "" {
		return
	}

	workDir, _ := os.Getwd()
	if workDir == "" {
		workDir = "."
	}

	fileURL = strings.TrimPrefix(fileURL, "/")
	candidates := []string{
		filepath.Join(workDir, "..", fileURL),
		filepath.Join(workDir, fileURL),
		filepath.Join(workDir, "images", fileURL),
		filepath.Join(workDir, "..", "images", filepath.Base(fileURL)),
		filepath.Join(workDir, "images", filepath.Base(fileURL)),
	}

	for _, p := range candidates {
		if _, err := os.Stat(p); err == nil {
			_ = os.Remove(p)
			return
		}
	}
}

func normalizeImageURL(fileURL string) string {
	if fileURL == "" {
		return fileURL
	}

	if strings.Contains(fileURL, " ") {
		fileURL = strings.ReplaceAll(fileURL, " ", "%20")
	}

	if strings.HasPrefix(fileURL, "/images/") {
		return fileURL
	}

	if strings.HasPrefix(fileURL, "images/") {
		return "/" + fileURL
	}

	// fallback: assume already path under images
	return "/images/" + strings.TrimPrefix(fileURL, "/")
}
