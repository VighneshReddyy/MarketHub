package ui.controllers;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.MenuButton;
import javafx.scene.control.MenuItem;
import ui.MainApp;

public class DashboardController {

    @FXML private Label welcomeLabel;
    @FXML private MenuButton profileMenu;
    @FXML private MenuItem userInfoItem;
    @FXML private MenuItem emailInfoItem;

    @FXML
    public void initialize() {
        if (MainApp.currentUser != null) {
            welcomeLabel.setText("Welcome, " + MainApp.currentUser.getName());
            profileMenu.setText("Profile");
            userInfoItem.setText("User ID: " + MainApp.currentUser.getUserId());
            emailInfoItem.setText("Email: " + MainApp.currentUser.getEmail());
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
    public void navigateToSales() {
        MainApp.switchScene("scenes/Transactions.fxml");
    }

    @FXML
    public void navigateToMyRating() {
        MainApp.switchScene("scenes/MyRating.fxml");
    }

    @FXML
    public void navigateToMyPurchases() {
        MainApp.switchScene("scenes/MyPurchases.fxml");
    }

    @FXML
    public void navigateToMyListings() {
        MainApp.switchScene("scenes/Transactions.fxml");
    }

    @FXML
    public void navigateToAddAlert() {
       MainApp.switchScene("scenes/AddAlert.fxml");
    }

    @FXML
    public void handleLogout() {
        MainApp.currentUser = null;
        MainApp.switchScene("scenes/Login.fxml");
    }
}
