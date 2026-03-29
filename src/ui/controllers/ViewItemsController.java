package ui.controllers;

import javafx.beans.property.SimpleObjectProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import models.Item;
import models.Order;
import services.ItemService;
import services.OrderService;
import ui.MainApp;
import models.Category;
import dao.CategoryDAO;

import java.io.File;
import java.math.BigDecimal;
import java.util.List;

public class ViewItemsController {

    @FXML private TableView<Item> itemsTable;
    @FXML private TableColumn<Item, ImageView> imageCol;
    @FXML private TableColumn<Item, Button> actionCol;
    @FXML private ComboBox<Category> filterCategoryCombo;
    @FXML private ComboBox<String> filterConditionCombo;
    @FXML private TextField filterMinPriceField;
    @FXML private TextField filterMaxPriceField;
    @FXML private Label statusLabel;

    private final ItemService itemService = new ItemService();
    private final OrderService orderService = new OrderService();
    private final CategoryDAO categoryDAO = new CategoryDAO();
    private ObservableList<Item> itemsList = FXCollections.observableArrayList();

    @FXML
    public void initialize() {
        itemsTable.setOnMouseClicked(event -> {
            if (event.getClickCount() == 2 && itemsTable.getSelectionModel().getSelectedItem() != null) {
                MainApp.navigateToItemDetail(itemsTable.getSelectionModel().getSelectedItem());
            }
        });

        // Set up action column
        actionCol.setCellValueFactory(param -> {
            Item item = param.getValue();
            Button buyButton = new Button("Buy");
            buyButton.setStyle("-fx-background-color: #198754; -fx-text-fill: white; -fx-font-weight: bold;");
            
            if (item.getSellerId() == MainApp.currentUser.getUserId() || "sold".equalsIgnoreCase(item.getStatus())) {
                buyButton.setDisable(true);
                if ("sold".equalsIgnoreCase(item.getStatus())) {
                    buyButton.setText("Sold");
                }
            }

            buyButton.setOnAction(event -> handleBuyAction(item));
            return new SimpleObjectProperty<>(buyButton);
        });

        // Set up image column
        imageCol.setCellValueFactory(param -> {
            Item item = param.getValue();
            ImageView imageView = new ImageView();
            imageView.setFitWidth(80);
            imageView.setFitHeight(60);
            imageView.setPreserveRatio(true);

            String url = item.getImageUrl();
            if (url != null && !url.isEmpty()) {
                File file = new File(url);
                if (file.exists()) {
                    imageView.setImage(new Image(file.toURI().toString()));
                }
            }
            
            // If no image or file not found, we could show a placeholder
            // For now just leave it empty or add logic here
            return new SimpleObjectProperty<>(imageView);
        });

        filterCategoryCombo.getItems().addAll(categoryDAO.getAllCategories());
        
        loadAllItems();
    }

    private void loadAllItems() {
        itemsList.clear();
        List<Item> items = itemService.getAllItems();
        itemsList.addAll(items);
        itemsTable.setItems(itemsList);
    }

    @FXML
    public void navigateBack() {
        MainApp.switchScene("scenes/Dashboard.fxml");
    }

    @FXML
    public void handleFilter() {
        try {
            Category selectedCategory = filterCategoryCombo.getValue();
            int categoryId = (selectedCategory != null) ? selectedCategory.getCategoryId() : 0;

            BigDecimal min = filterMinPriceField.getText().isEmpty() ? null : new BigDecimal(filterMinPriceField.getText());
            BigDecimal max = filterMaxPriceField.getText().isEmpty() ? null : new BigDecimal(filterMaxPriceField.getText());
            String condition = filterConditionCombo.getValue();

            itemsList.clear();
            itemsList.addAll(itemService.filterItems(categoryId, min, max, condition));
        } catch (NumberFormatException e) {
            showStatus("Invalid filter numbers.", false);
        }
    }

    @FXML
    public void handleClearFilter() {
        filterCategoryCombo.getSelectionModel().clearSelection();
        filterConditionCombo.getSelectionModel().select("Any");
        filterMinPriceField.clear();
        filterMaxPriceField.clear();
        loadAllItems();
        statusLabel.setVisible(false);
    }

    private void handleBuyAction(Item item) {
        Order order = new Order(MainApp.currentUser.getUserId(), item.getSellerId(), item.getItemId(), item.getPrice(), "pending");
        boolean success = orderService.placeOrder(order);

        if (success) {
            showStatus("Order placed for: " + item.getTitle(), true);
            loadAllItems(); 
        } else {
            showStatus("Failed to place order.", false);
        }
    }

    private void showStatus(String msg, boolean isSuccess) {
        statusLabel.setText(msg);
        statusLabel.setStyle(isSuccess ? "-fx-text-fill: #198754;" : "-fx-text-fill: #dc3545;");
        statusLabel.setVisible(true);
    }
}
