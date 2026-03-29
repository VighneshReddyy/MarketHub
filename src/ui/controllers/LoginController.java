package ui.controllers;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import models.User;
import services.UserService;
import ui.MainApp;

public class LoginController {

    @FXML private TextField emailField;
    @FXML private PasswordField passwordField;
    @FXML private Label errorLabel;

    private final UserService userService = new UserService();

    @FXML
    public void handleLogin() {
        String email = emailField.getText();
        String password = passwordField.getText();

        if (email.isEmpty() || password.isEmpty()) {
            showError("Please enter both email and password.");
            return;
        }

        User user = userService.login(email, password);
        if (user != null) {
            MainApp.currentUser = user;
            MainApp.switchScene("scenes/Dashboard.fxml");
        } else {
            showError("Invalid email or password.");
        }
    }

    @FXML
    public void handleRegister() {
        // Simplified registration flow for UI demo - normally would open a full registration form
        String email = emailField.getText();
        String password = passwordField.getText();
        if (email.isEmpty() || password.isEmpty()) {
             showError("Please enter email/password to quick-register.");
             return;
        }
        User newUser = new User(email.split("@")[0], email, password, "555-0000"); // Mock data for quick demo
        if (userService.registerUser(newUser)) {
             showError("Registration successful! Click Login.");
             errorLabel.setStyle("-fx-text-fill: #198754;"); // Green
        } else {
             showError("Registration failed. Email exists?");
        }
    }

    private void showError(String message) {
        errorLabel.setText(message);
        errorLabel.setStyle("-fx-text-fill: #dc3545;"); // Red
        errorLabel.setVisible(true);
    }
}
