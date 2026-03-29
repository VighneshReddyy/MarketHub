package ui.controllers;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.ListCell;
import javafx.scene.control.ListView;
import models.Notification;
import services.NotificationService;
import ui.MainApp;

import java.util.List;

public class NotificationController {

    @FXML private ListView<Notification> notificationList;
    @FXML private Label statusLabel;

    private final NotificationService notificationService = new NotificationService();
    private ObservableList<Notification> observableNotifications = FXCollections.observableArrayList();

    @FXML
    public void initialize() {
        notificationList.setCellFactory(param -> new ListCell<Notification>() {
            @Override
            protected void updateItem(Notification item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || item == null) {
                    setText(null);
                    setGraphic(null);
                    setStyle("");
                } else {
                    setText(item.getMessage() + " (" + item.getCreatedAt() + ")");
                    // Bold if unread
                    if (!item.isRead()) {
                        setStyle("-fx-font-weight: bold; -fx-text-fill: #0d6efd;");
                    } else {
                        setStyle("-fx-font-weight: normal; -fx-text-fill: #6c757d;");
                    }
                }
            }
        });
        loadNotifications();
    }

    @FXML
    public void loadNotifications() {
        if (MainApp.currentUser == null) return;
        List<Notification> notifs = notificationService.getUserNotifications(MainApp.currentUser.getUserId());
        observableNotifications.clear();
        observableNotifications.addAll(notifs);
        notificationList.setItems(observableNotifications);
    }

    @FXML
    public void handleMarkAsRead() {
        Notification selected = notificationList.getSelectionModel().getSelectedItem();
        if (selected == null) {
             showStatus("Please select a notification first.");
             return;
        }
        
        if (!selected.isRead()) {
             boolean success = notificationService.markNotificationRead(selected.getNotificationId());
             if (success) {
                  showStatus("Marked as read.");
                  loadNotifications(); // Reload to refresh styling
             } else {
                  showStatus("Failed to mark as read.");
             }
        }
    }

    @FXML
    public void navigateBack() {
        MainApp.switchScene("scenes/Dashboard.fxml");
    }

    private void showStatus(String msg) {
        statusLabel.setText(msg);
        statusLabel.setVisible(true);
    }
}
