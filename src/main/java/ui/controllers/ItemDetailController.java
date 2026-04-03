package ui.controllers;

import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import models.Item;
import models.Order;
import services.OrderService;
import java.io.File;
import java.util.Optional;
import javafx.scene.control.TextInputDialog;
import services.ReportService;
import ui.MainApp;

public class ItemDetailController {

    @FXML private Label titleLabel;
    @FXML private ImageView itemImageView;
    @FXML private Label priceLabel;
    @FXML private Label conditionLabel;
    @FXML private Label statusLabel;
    @FXML private Label descriptionLabel;
    @FXML private Label sellerLabel;
    @FXML private Button buyButton;
    @FXML private Label actionStatusLabel;

    private Item currentItem;
    private final OrderService orderService = new OrderService();
    private final ReportService reportService = new ReportService();

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
        if (item.getSellerName() != null) {
            sellerLabel.setText("Seller: " + item.getSellerName() + " (" + item.getSellerEmail() + ")");
        } else {
            sellerLabel.setText("Seller ID: " + item.getSellerId());
        }

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

    @FXML
    public void handleReportItem() {
        if (currentItem == null) return;
        TextInputDialog dialog = new TextInputDialog();
        dialog.setTitle("Report Item");
        dialog.setHeaderText("Report Listing: " + currentItem.getTitle());
        dialog.setContentText("Please provide a reason for reporting this item:");

        Optional<String> result = dialog.showAndWait();
        if (result.isPresent()){
            String reason = result.get();
            try {
                boolean success = reportService.reportItem(currentItem.getItemId(), MainApp.currentUser.getUserId(), reason);
                showStatus(success ? "Item reported successfully." : "Failed to report item.", success);
            } catch (Exception e) {
                showStatus(e.getMessage(), false);
            }
        }
    }

    @FXML
    public void handleReportUser() {
        if (currentItem == null) return;
        TextInputDialog dialog = new TextInputDialog();
        dialog.setTitle("Report Seller");
        dialog.setHeaderText("Report Seller: " + (currentItem.getSellerName() != null ? currentItem.getSellerName() : "ID " + currentItem.getSellerId()));
        dialog.setContentText("Please provide a reason for reporting this seller:");

        Optional<String> result = dialog.showAndWait();
        if (result.isPresent()){
            String reason = result.get();
            try {
                boolean success = reportService.reportUser(currentItem.getSellerId(), MainApp.currentUser.getUserId(), reason);
                showStatus(success ? "Seller reported successfully." : "Failed to report seller.", success);
            } catch (Exception e) {
                showStatus(e.getMessage(), false);
            }
        }
    }
}
