package ui.controllers;

import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.stage.FileChooser;
import models.Item;
import models.Category;
import services.MarketplaceService;
import dao.CategoryDAO;
import ui.MainApp;

import java.io.File;
import java.math.BigDecimal;
import java.util.Optional;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;

public class EditItemController {

    @FXML
    private TextField titleField;
    @FXML
    private TextArea descriptionField;
    @FXML
    private TextField priceField;
    @FXML
    private ComboBox<Category> categoryCombo;
    @FXML
    private ComboBox<String> conditionCombo;
    @FXML
    private Label imagePathLabel;
    @FXML
    private Label statusLabel;
    @FXML
    private Label usageMonthsLabel;
    @FXML
    private TextField usageMonthsField;
    @FXML
    private ImageView itemImageView;

    private File selectedFile;
    private Item currentItem;
    private final MarketplaceService marketplaceService = new MarketplaceService();
    private final CategoryDAO categoryDAO = new CategoryDAO();

    @FXML
    public void initialize() {
        if (categoryCombo != null) {
            categoryCombo.getItems().addAll(categoryDAO.getAllCategories());
        }
        if (conditionCombo != null) {
            conditionCombo.valueProperty().addListener((obs, oldVal, newVal) -> {
                boolean isUsed = "used".equals(newVal);
                usageMonthsLabel.setVisible(isUsed);
                usageMonthsField.setVisible(isUsed);
                if (!isUsed)
                    usageMonthsField.clear();
            });
        }
        // Grab the item that was stored temporarily in MainApp
        Item itemToEdit = (Item) MainApp.tempData.get("editItem");
        if (itemToEdit != null) {
            loadItemData(itemToEdit);
            MainApp.tempData.remove("editItem");
        } else {
            showStatus("Error loading item.", false);
        }
    }

    private void loadItemData(Item item) {
        this.currentItem = item;
        titleField.setText(item.getTitle());
        descriptionField.setText(item.getDescription());
        priceField.setText(item.getPrice().toString());

        for (Category cat : categoryCombo.getItems()) {
            if (cat.getCategoryId() == item.getCategoryId()) {
                categoryCombo.getSelectionModel().select(cat);
                break;
            }
        }

        conditionCombo.getSelectionModel().select(item.getConditionType());
        if ("used".equals(item.getConditionType()) && item.getUsageMonths() != null) {
            usageMonthsField.setText(String.valueOf(item.getUsageMonths()));
        }

        if (item.getImageUrl() != null && !item.getImageUrl().isEmpty()) {
            try {
                File file = new File(item.getImageUrl());
                if (file.exists()) {
                    itemImageView.setImage(new Image(file.toURI().toString()));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @FXML
    public void handleImageUpload() {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Select Item Image");
        fileChooser.getExtensionFilters()
                .add(new FileChooser.ExtensionFilter("Image Files", "*.png", "*.jpg", "*.jpeg"));
        File file = fileChooser.showOpenDialog(null);
        if (file != null) {
            this.selectedFile = file;
            imagePathLabel.setText(file.getName());
            try {
                itemImageView.setImage(new Image(file.toURI().toString()));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @FXML
    public void navigateBack() {
        MainApp.switchScene("scenes/Transactions.fxml");
    }

    @FXML
    public void handleUpdate() {
        if (currentItem == null)
            return;
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

            currentItem.setTitle(title);
            currentItem.setDescription(desc);
            currentItem.setPrice(price);
            currentItem.setCategoryId(categoryId);
            currentItem.setConditionType(condition);

            if ("used".equals(condition) && !usageMonthsField.getText().isEmpty()) {
                currentItem.setUsageMonths(Integer.parseInt(usageMonthsField.getText()));
            } else {
                currentItem.setUsageMonths(null);
            }

            boolean updated = marketplaceService.updateItem(currentItem, selectedFile);

            if (updated) {
                showStatus("Listing updated successfully!", true);
            } else {
                showStatus("Failed to update listing.", false);
            }
        } catch (NumberFormatException e) {
            showStatus("Invalid Price or Category ID.", false);
        }
    }

    @FXML
    public void handleDelete() {
        if (currentItem == null)
            return;

        Alert confirmation = new Alert(Alert.AlertType.CONFIRMATION);
        confirmation.setTitle("Delete Listing");
        confirmation.setHeaderText("Delete '" + currentItem.getTitle() + "'");
        confirmation.setContentText("Are you sure you want to permanently delete this listing?");

        Optional<ButtonType> result = confirmation.showAndWait();
        if (result.isPresent() && result.get() == ButtonType.OK) {
            boolean success = marketplaceService.deleteItem(currentItem.getItemId());
            if (success) {
                navigateBack();
            } else {
                showStatus("Failed to delete the listing.", false);
            }
        }
    }

    private void showStatus(String msg, boolean isSuccess) {
        statusLabel.setText(msg);
        statusLabel.setStyle(isSuccess ? "-fx-text-fill: green;" : "-fx-text-fill: red;");
        statusLabel.setVisible(true);
    }
}
