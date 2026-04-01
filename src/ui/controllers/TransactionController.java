package ui.controllers;

import javafx.beans.property.SimpleObjectProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.layout.HBox;
import models.Order;
import services.OrderService;
import ui.MainApp;

import java.util.List;

public class TransactionController {

    @FXML private TableView<Order> transactionTable;
    @FXML private TableColumn<Order, Integer> itemCol;
    @FXML private TableColumn<Order, String> itemNameCol;
    @FXML private TableColumn<Order, java.math.BigDecimal> priceCol;
    @FXML private TableColumn<Order, String> statusCol;
    @FXML private TableColumn<Order, java.sql.Timestamp> dateCol;
    @FXML private TableColumn<Order, HBox> actionCol;
    @FXML private RadioButton radioPurchases;
    @FXML private RadioButton radioSales;
    @FXML private RadioButton radioActiveListings;
    @FXML private Label statusLabel;

    private final OrderService orderService = new OrderService();
    private ObservableList<Order> orderList = FXCollections.observableArrayList();
    private ToggleGroup toggleGroup = new ToggleGroup();

    @FXML
    public void initialize() {
        radioPurchases.setToggleGroup(toggleGroup);
        radioSales.setToggleGroup(toggleGroup);
        radioActiveListings.setToggleGroup(toggleGroup);
        
        actionCol.setCellValueFactory(param -> {
            Order order = param.getValue();
            HBox buttonBox = new HBox(5);
            
            // Only show accept/reject buttons for Incoming Sales that are pending
            if (radioSales.isSelected() && "pending".equalsIgnoreCase(order.getStatus())) {
                Button acceptBtn = new Button("Accept");
                acceptBtn.setStyle("-fx-background-color: #198754; -fx-text-fill: white;");
                acceptBtn.setOnAction(e -> handleAccept(order));
                
                Button rejectBtn = new Button("Reject");
                rejectBtn.setStyle("-fx-background-color: #dc3545; -fx-text-fill: white;");
                rejectBtn.setOnAction(e -> handleReject(order));
                
                buttonBox.getChildren().addAll(acceptBtn, rejectBtn);
            } else if (radioActiveListings.isSelected()) {
                Button editBtn = new Button("Edit Listing");
                editBtn.setStyle("-fx-background-color: #0d6efd; -fx-text-fill: white;");
                editBtn.setOnAction(e -> handleEditListing(order));
                buttonBox.getChildren().add(editBtn);
            }
            return new SimpleObjectProperty<>(buttonBox);
        });

        loadTransactions();
    }

    @FXML
    public void handleToggleChange() {
        loadTransactions();
        statusLabel.setVisible(false);
    }

    private void loadTransactions() {
        if (MainApp.currentUser == null) return;
        
        orderList.clear();
        List<Order> orders;
        
        if (radioPurchases.isSelected()) {
            orders = orderService.getBuyerTransactions(MainApp.currentUser.getUserId());
        } else if (radioSales.isSelected()) {
            orders = orderService.getSellerTransactions(MainApp.currentUser.getUserId());
        } else {
            // Re-use Order model for Listing display (mapping Item fields to Order fields for the table)
            List<models.Item> myItems = (new services.MarketplaceService()).getMyListings(MainApp.currentUser.getUserId());
            orders = new java.util.ArrayList<>();
            for (models.Item item : myItems) {
                Order pseudoOrder = new Order(0, item.getSellerId(), item.getItemId(), item.getPrice(), item.getStatus());
                pseudoOrder.setItemName(item.getTitle());
                pseudoOrder.setListingDate(item.getCreatedAt());
                // We can use pseudoOrder to populate the table columns
                orders.add(pseudoOrder);
            }
        }
        
        orderList.addAll(orders);
        transactionTable.setItems(orderList);
    }

    private void handleAccept(Order order) {
         boolean success = orderService.acceptOrder(order.getOrderId(), order.getItemId());
         if (success) {
              showStatus("Order " + order.getOrderId() + " accepted.", true);
              loadTransactions();
         } else {
              showStatus("Failed to accept order.", false);
         }
    }

    private void handleReject(Order order) {
         boolean success = orderService.rejectOrder(order.getOrderId());
         if (success) {
              showStatus("Order " + order.getOrderId() + " rejected.", true);
              loadTransactions();
         } else {
              showStatus("Failed to reject order.", false);
         }
    }

    private void handleEditListing(Order order) {
        models.Item item = (new services.MarketplaceService()).getItemById(order.getItemId());
        if (item != null) {
            MainApp.tempData.put("editItem", item);
            MainApp.switchScene("scenes/EditItem.fxml");
        } else {
            showStatus("Item not found.", false);
        }
    }

    @FXML
    public void navigateBack() {
        MainApp.switchScene("scenes/Dashboard.fxml");
    }

    private void showStatus(String msg, boolean isSuccess) {
        statusLabel.setText(msg);
        statusLabel.setStyle(isSuccess ? "-fx-text-fill: #198754;" : "-fx-text-fill: #dc3545;");
        statusLabel.setVisible(true);
    }
}
