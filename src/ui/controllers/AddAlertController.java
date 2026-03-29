package ui.controllers;

import javafx.fxml.FXML;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import models.Alert;
import models.Category;
import services.MarketplaceService;
import ui.MainApp;

import java.math.BigDecimal;

public class AddAlertController {

    @FXML private ComboBox<Category> categoryCombo;
    @FXML private TextField minPriceField;
    @FXML private TextField maxPriceField;
    @FXML private ComboBox<String> conditionCombo;
    @FXML private Label statusLabel;

    private final MarketplaceService service = new MarketplaceService();

    @FXML
    public void initialize() {
        if (categoryCombo != null) {
            categoryCombo.getItems().addAll(service.getAllCategories());
            categoryCombo.getSelectionModel().selectFirst();
        }
        if (conditionCombo != null) {
            conditionCombo.getSelectionModel().select("Any");
        }
    }

    @FXML
    public void handleCreateAlert() {
        try {
            Category selectedCategory = categoryCombo.getValue();
            if (selectedCategory == null) {
                showStatus("Please select a category.", false);
                return;
            }

            BigDecimal minPrice = null;
            if (!minPriceField.getText().isEmpty()) {
                minPrice = new BigDecimal(minPriceField.getText());
            }

            BigDecimal maxPrice = null;
            if (!maxPriceField.getText().isEmpty()) {
                maxPrice = new BigDecimal(maxPriceField.getText());
            }

            String condition = conditionCombo.getValue();
            if (condition == null || condition.isEmpty() || condition.equalsIgnoreCase("Any")) {
                condition = "Any";
            }

            Alert newAlert = new Alert(
                MainApp.currentUser.getUserId(),
                selectedCategory.getCategoryId(),
                minPrice,
                maxPrice,
                condition.toLowerCase()
            );

            boolean success = service.createAlert(newAlert);

            if (success) {
                showStatus("Alert created successfully!", true);
                clearFields();
            } else {
                showStatus("Failed to create alert. Please try again.", false);
            }

        } catch (NumberFormatException e) {
            showStatus("Invalid price format. Please enter valid numbers.", false);
        }
    }

    private void clearFields() {
        minPriceField.clear();
        maxPriceField.clear();
        categoryCombo.getSelectionModel().selectFirst();
        conditionCombo.getSelectionModel().select("Any");
    }

    private void showStatus(String msg, boolean isSuccess) {
        statusLabel.setText(msg);
        statusLabel.setStyle(isSuccess ? "-fx-text-fill: #198754;" : "-fx-text-fill: #dc3545;");
        statusLabel.setVisible(true);
    }

    @FXML
    public void navigateBack() {
        MainApp.switchScene("scenes/Dashboard.fxml");
    }
}
