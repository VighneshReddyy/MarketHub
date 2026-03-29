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
    @FXML private TableColumn<Order, HBox> actionCol;
    @FXML private RadioButton radioPurchases;
    @FXML private RadioButton radioSales;
    @FXML private Label statusLabel;

    private final OrderService orderService = new OrderService();
    private ObservableList<Order> orderList = FXCollections.observableArrayList();
    private ToggleGroup toggleGroup = new ToggleGroup();

    @FXML
    public void initialize() {
        radioPurchases.setToggleGroup(toggleGroup);
        radioSales.setToggleGroup(toggleGroup);
        
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
        } else {
            orders = orderService.getSellerTransactions(MainApp.currentUser.getUserId());
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
