package models;

import java.sql.Timestamp;

public class Notification {
    private int notificationId;
    private int userId;
    private int itemId;
    private String message;
    private boolean isRead;
    private Timestamp createdAt;

    public Notification() {}

    public Notification(int notificationId, int userId, int itemId, String message, boolean isRead, Timestamp createdAt) {
        this.notificationId = notificationId;
        this.userId = userId;
        this.itemId = itemId;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public Notification(int userId, int itemId, String message) {
        this.userId = userId;
        this.itemId = itemId;
        this.message = message;
        this.isRead = false;
    }

    // Getters and Setters
    public int getNotificationId() { return notificationId; }
    public void setNotificationId(int notificationId) { this.notificationId = notificationId; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public int getItemId() { return itemId; }
    public void setItemId(int itemId) { this.itemId = itemId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return String.format("Notification [%s]: %s (Item: %d) - Date: %s",
                isRead ? "READ" : "UNREAD", message, itemId, createdAt);
    }
}
