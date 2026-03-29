package ui.controllers;

import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import models.Item;
import models.Order;
import services.OrderService;
import ui.MainApp;

import java.io.File;

public class ItemDetailController {

    @FXML private Label titleLabel;
    @FXML private ImageView itemImageView;
    @FXML private Label priceLabel;
    @FXML private Label conditionLabel;
    @FXML private Label statusLabel;
    @FXML private Label descriptionLabel;
    @FXML private Button buyButton;
    @FXML private Label actionStatusLabel;

    private Item currentItem;
    private final OrderService orderService = new OrderService();

    public void initData(Item item) {
        this.currentItem = item;
        titleLabel.setText(item.getTitle());
        priceLabel.setText("Price: ₹" + item.getPrice().toString());
        String conditionText = "Condition: " + item.getConditionType().toUpperCase();
        if (item.getUsageMonths() != null && item.getUsageMonths() > 0) {
            conditionText += " (" + item.getUsageMonths() + " months used)";
        }
        conditionLabel.setText(conditionText);
        statusLabel.setText("Status: " + item.getStatus().toUpperCase());
        descriptionLabel.setText(item.getDescription());

        String url = item.getImageUrl();
        if (url != null && !url.isEmpty()) {
            File file = new File(url);
            if (file.exists()) {
                itemImageView.setImage(new Image(file.toURI().toString()));
            }
        }

        if (item.getSellerId() == MainApp.currentUser.getUserId() || "sold".equalsIgnoreCase(item.getStatus())) {
            buyButton.setDisable(true);
            if ("sold".equalsIgnoreCase(item.getStatus())) {
                buyButton.setText("Sold");
            } else {
                buyButton.setText("Cannot buy your own item");
            }
        }
    }

    @FXML
    public void navigateBack() {
        MainApp.switchScene("scenes/ViewItems.fxml");
    }

    @FXML
    public void handleBuyAction() {
        Order order = new Order(MainApp.currentUser.getUserId(), currentItem.getSellerId(), currentItem.getItemId(), currentItem.getPrice(), "pending");
        boolean success = orderService.placeOrder(order);

        if (success) {
            showStatus("Order placed successfully! The seller must accept your order.", true);
            buyButton.setDisable(true);
        } else {
            showStatus("Failed to place order.", false);
        }
    }

    private void showStatus(String msg, boolean isSuccess) {
        actionStatusLabel.setText(msg);
        actionStatusLabel.setStyle(isSuccess ? "-fx-text-fill: #198754;" : "-fx-text-fill: #dc3545;");
        actionStatusLabel.setVisible(true);
    }
}
