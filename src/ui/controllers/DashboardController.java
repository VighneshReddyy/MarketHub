package ui.controllers;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import ui.MainApp;

public class DashboardController {

    @FXML private Label welcomeLabel;

    @FXML
    public void initialize() {
        if (MainApp.currentUser != null) {
            welcomeLabel.setText("Welcome, " + MainApp.currentUser.getName());
        }
    }

    @FXML
    public void navigateToAddItem() {
        MainApp.switchScene("scenes/AddItem.fxml");
    }

    @FXML
    public void navigateToViewItems() {
        MainApp.switchScene("scenes/ViewItems.fxml");
    }

    @FXML
    public void navigateToNotifications() {
        MainApp.switchScene("scenes/Notifications.fxml");
    }

    @FXML
    public void navigateToPurchases() {
        // Shared scene, we will pass a toggle parameter or default state
        MainApp.switchScene("scenes/Transactions.fxml");
    }

    @FXML
    public void navigateToSales() {
        MainApp.switchScene("scenes/Transactions.fxml");
    }

    @FXML
    public void navigateToAddAlert() {
       // Optional: Add an Alert logic if you wish for full UI functionality
       System.out.println("Alert UI logic goes here - for now redirecting to Dashboard");
    }

    @FXML
    public void handleLogout() {
        MainApp.currentUser = null;
        MainApp.switchScene("scenes/Login.fxml");
    }
}
