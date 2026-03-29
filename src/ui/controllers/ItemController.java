package ui.controllers;

import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.stage.FileChooser;
import models.Item;
import services.ItemService;
import ui.MainApp;
import models.Category;
import dao.CategoryDAO;

import java.io.File;
import java.math.BigDecimal;

public class ItemController {

    @FXML private TextField titleField;
    @FXML private TextArea descriptionField;
    @FXML private TextField priceField;
    @FXML private ComboBox<Category> categoryCombo;
    @FXML private ComboBox<String> conditionCombo;
    @FXML private Label imagePathLabel;
    @FXML private Label statusLabel;
    @FXML private Label usageMonthsLabel;
    @FXML private TextField usageMonthsField;

    private File selectedFile;
    private final ItemService itemService = new ItemService();
    private final CategoryDAO categoryDAO = new CategoryDAO();

    @FXML
    public void initialize() {
        if(conditionCombo != null) {
            conditionCombo.getSelectionModel().selectFirst();
        }
        if (categoryCombo != null) {
            categoryCombo.getItems().addAll(categoryDAO.getAllCategories());
            categoryCombo.getSelectionModel().selectFirst();
        }
        if (conditionCombo != null) {
            conditionCombo.valueProperty().addListener((obs, oldVal, newVal) -> {
                boolean isUsed = "used".equals(newVal);
                usageMonthsLabel.setVisible(isUsed);
                usageMonthsField.setVisible(isUsed);
                if (!isUsed) usageMonthsField.clear();
            });
        }
    }

    @FXML
    public void navigateBack() {
        MainApp.switchScene("scenes/Dashboard.fxml");
    }

    @FXML
    public void handleImageUpload() {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Select Item Image");
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("Image Files", "*.png", "*.jpg", "*.jpeg"));
        File file = fileChooser.showOpenDialog(null);
        if (file != null) {
            this.selectedFile = file;
            imagePathLabel.setText(file.getName());
        }
    }

    @FXML
    public void handleSubmit() {
        try {
            String title = titleField.getText();
            String desc = descriptionField.getText();
            BigDecimal price = new BigDecimal(priceField.getText());
            Category selectedCategory = categoryCombo.getValue();
            if (selectedCategory == null) {
                 showStatus("Please select a category.", false);
                 return;
            }
            int categoryId = selectedCategory.getCategoryId();
            String condition = conditionCombo.getValue();
            
            if (title.isEmpty() || desc.isEmpty()) {
                showStatus("Please fill all text fields.", false);
                return;
            }

            Item newItem = new Item(MainApp.currentUser.getUserId(), categoryId, title, desc, price, condition);
            if ("used".equals(condition) && !usageMonthsField.getText().isEmpty()) {
                newItem.setUsageMonths(Integer.parseInt(usageMonthsField.getText()));
            }
            int itemId = itemService.addItem(newItem, selectedFile);

            if (itemId > 0) {
                showStatus("Item added successfully!", true);
                clearFields();
            } else {
                showStatus("Failed to add item.", false);
            }
        } catch (NumberFormatException e) {
            showStatus("Invalid Price or Category ID.", false);
        }
    }

    private void showStatus(String msg, boolean isSuccess) {
        statusLabel.setText(msg);
        statusLabel.setStyle(isSuccess ? "-fx-text-fill: green;" : "-fx-text-fill: red;");
        statusLabel.setVisible(true);
    }
    
    private void clearFields() {
         titleField.clear();
         descriptionField.clear();
         priceField.clear();
         categoryCombo.getSelectionModel().selectFirst();
         usageMonthsField.clear();
         imagePathLabel.setText("No file selected.");
         selectedFile = null;
    }
}
