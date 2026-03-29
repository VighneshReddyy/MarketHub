package services;

import dao.NotificationDAO;
import models.Notification;
import java.util.List;

public class NotificationService {
    private final NotificationDAO notificationDAO = new NotificationDAO();

    public List<Notification> getUserNotifications(int userId) {
        return notificationDAO.getNotificationsByUserId(userId);
    }

    public boolean markNotificationRead(int notificationId) {
        return notificationDAO.markAsRead(notificationId);
    }
}
