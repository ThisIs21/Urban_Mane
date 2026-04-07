package service

import (
	"strconv"
	"urban-mane/internal/model"
	"urban-mane/internal/repository"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// LogActivity is a helper function to consistently log activities
func LogActivity(action string, entity string, entityID string, details string, userID string, userName string, role string) {
	log := model.ActivityLog{
		UserID:   bson.ObjectID{},
		UserName: "System",
		Role:     "system",
		Action:   action,
		Entity:   entity,
		EntityID: entityID,
		Details:  details,
	}

	// Set real user info if provided
	if userID != "" {
		if objID, err := bson.ObjectIDFromHex(userID); err == nil {
			log.UserID = objID
		}
	}
	if userName != "" {
		log.UserName = userName
	}
	if role != "" {
		log.Role = role
	}

	// Call CreateLog synchronously (not in goroutine to avoid race conditions)
	repository.CreateLog(log)
}

// Helper to convert int to string for logging
func intToString(val int) string {
	return strconv.Itoa(val)
}
