package ui.controllers;

import javafx.beans.property.SimpleObjectProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.layout.VBox;
import models.Order;
import models.Review;
import services.OrderService;
import services.ReviewService;
import ui.MainApp;

import java.util.List;
import java.util.Optional;

public class MyPurchasesController {

    @FXML private TableView<Order> purchasesTable;
    @FXML private TableColumn<Order, Integer> itemCol;
    @FXML private TableColumn<Order, String> itemNameCol;
    @FXML private TableColumn<Order, java.math.BigDecimal> priceCol;
    @FXML private TableColumn<Order, String> statusCol;
    @FXML private TableColumn<Order, java.sql.Timestamp> dateCol;
    @FXML private TableColumn<Order, Button> actionCol;
    @FXML private Label statusLabel;

    private final OrderService orderService = new OrderService();
    private final ReviewService reviewService = new ReviewService();
    private ObservableList<Order> orderList = FXCollections.observableArrayList();

    @FXML
    public void initialize() {
        actionCol.setCellValueFactory(param -> {
            Order order = param.getValue();
            Button ratingBtn = new Button("Add Rating");
            ratingBtn.setStyle("-fx-background-color: #ffc107; -fx-text-fill: black;");
            
            // Disable if not completed
            if (!"completed".equalsIgnoreCase(order.getStatus())) {
                ratingBtn.setDisable(true);
                ratingBtn.setTooltip(new Tooltip("Review can only be added for completed orders."));
            }
            
            ratingBtn.setOnAction(e -> handleAddRating(order));
            return new SimpleObjectProperty<>(ratingBtn);
        });

        loadPurchases();
    }

    private void loadPurchases() {
        if (MainApp.currentUser == null) return;
        
        orderList.clear();
        List<Order> orders = orderService.getBuyerTransactions(MainApp.currentUser.getUserId());
        orderList.addAll(orders);
        purchasesTable.setItems(orderList);
    }

    private void handleAddRating(Order order) {
        Dialog<ButtonType> dialog = new Dialog<>();
        dialog.setTitle("Add Rating");
        dialog.setHeaderText("Rate your purchase: " + order.getItemName());

        ComboBox<Integer> ratingBox = new ComboBox<>(FXCollections.observableArrayList(1, 2, 3, 4, 5));
        ratingBox.getSelectionModel().select(4); // Default to 5
        TextArea commentArea = new TextArea();
        commentArea.setPromptText("Enter your review comment here...");
        commentArea.setPrefRowCount(3);

        VBox dialogPane = new VBox(10, new Label("Rating (1-5):"), ratingBox, new Label("Comment:"), commentArea);
        dialog.getDialogPane().setContent(dialogPane);
        dialog.getDialogPane().getButtonTypes().addAll(ButtonType.OK, ButtonType.CANCEL);

        Optional<ButtonType> result = dialog.showAndWait();
        if (result.isPresent() && result.get() == ButtonType.OK) {
            Review review = new Review();
            review.setReviewerId(MainApp.currentUser.getUserId());
            review.setReviewedUserId(order.getSellerId());
            review.setOrderId(order.getOrderId());
            review.setRating(ratingBox.getValue());
            review.setComment(commentArea.getText());

            boolean success = reviewService.addReview(review);
            if (success) {
                showStatus("Rating added successfully!", true);
            } else {
                showStatus("Failed to add rating. You may have already rated this order.", false);
            }
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
