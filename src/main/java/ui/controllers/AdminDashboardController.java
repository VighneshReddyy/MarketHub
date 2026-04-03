package ui.controllers;

import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.layout.HBox;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import models.User;
import models.Item;
import models.Category;
import models.AdminLog;
import services.AdminService;
import ui.MainApp;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public class AdminDashboardController {

    @FXML private Label adminNameLabel;
    @FXML private StackPane contentArea;
    @FXML private VBox dashboardView;
    @FXML private Label totalUsersLabel;
    @FXML private Label totalItemsLabel;
    @FXML private Label pendingReportsLabel;
    @FXML private Label totalOrdersLabel;

    private final AdminService adminService = new AdminService();

    @FXML
    public void initialize() {
        if (MainApp.currentUser != null) {
            adminNameLabel.setText(MainApp.currentUser.getName());
        }
        refreshDashboard();
    }

    private void refreshDashboard() {
        Map<String, Integer> counts = adminService.getDashboardCounts();
        totalUsersLabel.setText(String.valueOf(counts.getOrDefault("users", 0)));
        totalItemsLabel.setText(String.valueOf(counts.getOrDefault("items", 0)));
        pendingReportsLabel.setText(String.valueOf(counts.getOrDefault("reports", 0)));
        totalOrdersLabel.setText(String.valueOf(counts.getOrDefault("orders", 0)));
        
        contentArea.getChildren().setAll(dashboardView);
    }

    @FXML
    public void showDashboard() {
        refreshDashboard();
    }

    @FXML
    public void showUserManagement() {
        VBox userView = new VBox(20);
        userView.setPadding(new Insets(10));
        Label title = new Label("User Management");
        title.getStyleClass().add("title-label");

        HBox searchBar = new HBox(10);
        TextField searchField = new TextField();
        searchField.setPromptText("Search name/email...");
        Button searchBtn = new Button("Search");
        searchBar.getChildren().addAll(searchField, searchBtn);

        TableView<User> userTable = new TableView<>();
        TableColumn<User, Integer> idCol = new TableColumn<>("ID");
        idCol.setCellValueFactory(new PropertyValueFactory<>("userId"));
        TableColumn<User, String> nameCol = new TableColumn<>("Name");
        nameCol.setCellValueFactory(new PropertyValueFactory<>("name"));
        TableColumn<User, String> emailCol = new TableColumn<>("Email");
        emailCol.setCellValueFactory(new PropertyValueFactory<>("email"));
        TableColumn<User, String> statusCol = new TableColumn<>("Status");
        statusCol.setCellValueFactory(new PropertyValueFactory<>("status"));
        
        userTable.getColumns().addAll(idCol, nameCol, emailCol, statusCol);

        HBox actions = new HBox(10);
        Button banBtn = new Button("Ban User");
        banBtn.setStyle("-fx-background-color: #dc3545;");
        Button unbanBtn = new Button("Unban User");
        unbanBtn.setStyle("-fx-background-color: #198754;");
        actions.getChildren().addAll(banBtn, unbanBtn);

        searchBtn.setOnAction(e -> {
            userTable.setItems(FXCollections.observableArrayList(adminService.searchUsers(searchField.getText())));
        });

        banBtn.setOnAction(e -> {
            User selected = userTable.getSelectionModel().getSelectedItem();
            if (selected != null) {
                if (adminService.updateUserStatus(MainApp.currentUser.getUserId(), selected.getUserId(), "banned")) {
                    searchBtn.fire();
                } else {
                    showAlert("Error", "Cannot ban an admin.");
                }
            }
        });

        unbanBtn.setOnAction(e -> {
            User selected = userTable.getSelectionModel().getSelectedItem();
            if (selected != null) {
                adminService.updateUserStatus(MainApp.currentUser.getUserId(), selected.getUserId(), "active");
                searchBtn.fire();
            }
        });

        userView.getChildren().addAll(title, searchBar, userTable, actions);
        contentArea.getChildren().setAll(userView);
        userTable.setItems(FXCollections.observableArrayList(adminService.getAllUsers()));
    }

    @FXML
    public void showItemManagement() {
        VBox itemView = new VBox(20);
        itemView.setPadding(new Insets(10));
        Label title = new Label("Item Management");
        title.getStyleClass().add("title-label");

        HBox filters = new HBox(10);
        TextField titleFilter = new TextField();
        titleFilter.setPromptText("Filter by title...");
        ComboBox<Category> categoryFilter = new ComboBox<>();
        categoryFilter.setPromptText("Category...");
        categoryFilter.setItems(FXCollections.observableArrayList(adminService.getAllCategories()));
        Button filterBtn = new Button("Filter");
        Button removeBtn = new Button("Mark as Removed");
        removeBtn.setStyle("-fx-background-color: #dc3545;");
        filters.getChildren().addAll(titleFilter, categoryFilter, filterBtn, removeBtn);

        TableView<Item> itemTable = new TableView<>();
        TableColumn<Item, Integer> idCol = new TableColumn<>("ID");
        idCol.setCellValueFactory(new PropertyValueFactory<>("itemId"));
        TableColumn<Item, String> titleCol = new TableColumn<>("Title");
        titleCol.setCellValueFactory(new PropertyValueFactory<>("title"));
        TableColumn<Item, String> sellerCol = new TableColumn<>("Seller");
        sellerCol.setCellValueFactory(new PropertyValueFactory<>("sellerName"));
        TableColumn<Item, String> statusCol = new TableColumn<>("Status");
        statusCol.setCellValueFactory(new PropertyValueFactory<>("status"));

        itemTable.getColumns().addAll(idCol, titleCol, sellerCol, statusCol);

        filterBtn.setOnAction(e -> {
            Category selectedCat = categoryFilter.getSelectionModel().getSelectedItem();
            Integer catId = (selectedCat != null) ? selectedCat.getCategoryId() : null;
            itemTable.setItems(FXCollections.observableArrayList(adminService.searchAndFilterItems(titleFilter.getText(), catId, null)));
        });

        removeBtn.setOnAction(e -> {
            Item selected = itemTable.getSelectionModel().getSelectedItem();
            if (selected != null) {
                adminService.removeItem(MainApp.currentUser.getUserId(), selected.getItemId());
                filterBtn.fire();
            }
        });

        itemView.getChildren().addAll(title, filters, itemTable);
        contentArea.getChildren().setAll(itemView);
        itemTable.setItems(FXCollections.observableArrayList(adminService.getAllItems()));
    }

    @FXML
    public void showCategoryManagement() {
        VBox catView = new VBox(20);
        catView.setPadding(new Insets(10));
        Label title = new Label("Category Management");
        title.getStyleClass().add("title-label");

        HBox input = new HBox(10);
        TextField catNameField = new TextField();
        catNameField.setPromptText("New Category Name...");
        Button addBtn = new Button("Add");
        input.getChildren().addAll(catNameField, addBtn);

        ListView<Category> catList = new ListView<>();
        catList.setItems(FXCollections.observableArrayList(adminService.getAllCategories()));

        Button deleteBtn = new Button("Delete Selected");
        deleteBtn.setStyle("-fx-background-color: #dc3545;");

        addBtn.setOnAction(e -> {
            if (!catNameField.getText().isEmpty()) {
                adminService.addCategory(MainApp.currentUser.getUserId(), catNameField.getText());
                catList.setItems(FXCollections.observableArrayList(adminService.getAllCategories()));
                catNameField.clear();
            }
        });

        deleteBtn.setOnAction(e -> {
            Category selected = catList.getSelectionModel().getSelectedItem();
            if (selected != null) {
                if (!adminService.deleteCategory(MainApp.currentUser.getUserId(), selected.getCategoryId())) {
                    showAlert("Error", "Cannot delete category with existing items.");
                } else {
                    catList.setItems(FXCollections.observableArrayList(adminService.getAllCategories()));
                }
            }
        });

        catView.getChildren().addAll(title, input, catList, deleteBtn);
        contentArea.getChildren().setAll(catView);
    }

    @FXML
    public void showReportManagement() {
        VBox reportView = new VBox(20);
        reportView.setPadding(new Insets(10));
        Label title = new Label("Pending Reports");
        title.getStyleClass().add("title-label");

        ListView<Map<String, Object>> reportList = new ListView<>();
        reportList.setItems(FXCollections.observableArrayList(adminService.getPendingReports()));

        reportList.setCellFactory(param -> new ListCell<>() {
            @Override
            protected void updateItem(Map<String, Object> item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || item == null) {
                    setText(null);
                } else {
                    setText(String.format("Report #%s: %s (Target: %s, Item: %s)", 
                        item.get("report_id"), item.get("reason"), item.get("reported_user_name"), item.get("item_title")));
                }
            }
        });

        HBox actions = new HBox(10);
        Button banUserBtn = new Button("Ban User");
        banUserBtn.setStyle("-fx-background-color: #dc3545;");
        Button removeItemBtn = new Button("Remove Item");
        removeItemBtn.setStyle("-fx-background-color: #fd7e14;");
        Button ignoreBtn = new Button("Ignore");
        actions.getChildren().addAll(banUserBtn, removeItemBtn, ignoreBtn);

        banUserBtn.setOnAction(e -> {
            Map<String, Object> selected = reportList.getSelectionModel().getSelectedItem();
            if (selected != null) {
                adminService.processReport(MainApp.currentUser.getUserId(), (int)selected.get("report_id"), "ban_user", null, (int)selected.get("reported_user_id"));
                reportList.setItems(FXCollections.observableArrayList(adminService.getPendingReports()));
            }
        });

        removeItemBtn.setOnAction(e -> {
            Map<String, Object> selected = reportList.getSelectionModel().getSelectedItem();
            if (selected != null && selected.get("item_id") != null) {
                adminService.processReport(MainApp.currentUser.getUserId(), (int)selected.get("report_id"), "remove_item", (int)selected.get("item_id"), null);
                reportList.setItems(FXCollections.observableArrayList(adminService.getPendingReports()));
            }
        });

        ignoreBtn.setOnAction(e -> {
            Map<String, Object> selected = reportList.getSelectionModel().getSelectedItem();
            if (selected != null) {
                adminService.processReport(MainApp.currentUser.getUserId(), (int)selected.get("report_id"), "ignore", null, null);
                reportList.setItems(FXCollections.observableArrayList(adminService.getPendingReports()));
            }
        });

        reportView.getChildren().addAll(title, reportList, actions);
        contentArea.getChildren().setAll(reportView);
    }

    @FXML
    public void showReviewModeration() {
        VBox reviewView = new VBox(20);
        reviewView.setPadding(new Insets(10));
        Label title = new Label("Review Moderation");
        title.getStyleClass().add("title-label");

        ListView<Map<String, Object>> reviewList = new ListView<>();
        reviewList.setItems(FXCollections.observableArrayList(adminService.getReviews(null, null)));

        reviewList.setCellFactory(param -> new ListCell<>() {
            @Override
            protected void updateItem(Map<String, Object> item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || item == null) {
                    setText(null);
                } else {
                    setText(String.format("[%d*] %s (by %s | Seller: %s)", 
                        item.get("rating"), item.get("comment"), item.get("reviewer_name"), item.get("seller_name")));
                }
            }
        });

        Button deleteBtn = new Button("Delete Review");
        deleteBtn.setStyle("-fx-background-color: #dc3545;");
        deleteBtn.setOnAction(e -> {
            Map<String, Object> selected = reviewList.getSelectionModel().getSelectedItem();
            if (selected != null) {
                adminService.deleteReview(MainApp.currentUser.getUserId(), (int)selected.get("review_id"));
                reviewList.setItems(FXCollections.observableArrayList(adminService.getReviews(null, null)));
            }
        });

        reviewView.getChildren().addAll(title, reviewList, deleteBtn);
        contentArea.getChildren().setAll(reviewView);
    }

    @FXML
    public void showAdminLogs() {
        VBox logsView = new VBox(20);
        logsView.setPadding(new Insets(10));
        Label title = new Label("Admin Action Logs");
        title.getStyleClass().add("title-label");

        TableView<AdminLog> logTable = new TableView<>();
        TableColumn<AdminLog, Integer> idCol = new TableColumn<>("ID");
        idCol.setCellValueFactory(new PropertyValueFactory<>("logId"));
        TableColumn<AdminLog, String> actionCol = new TableColumn<>("Action");
        actionCol.setCellValueFactory(new PropertyValueFactory<>("action"));
        TableColumn<AdminLog, String> targetCol = new TableColumn<>("Target");
        targetCol.setCellValueFactory(new PropertyValueFactory<>("targetType"));
        TableColumn<AdminLog, Integer> targetIdCol = new TableColumn<>("Target ID");
        targetIdCol.setCellValueFactory(new PropertyValueFactory<>("targetId"));
        TableColumn<AdminLog, String> timeCol = new TableColumn<>("Timestamp");
        timeCol.setCellValueFactory(new PropertyValueFactory<>("createdAt"));

        logTable.getColumns().addAll(idCol, actionCol, targetCol, targetIdCol, timeCol);
        logTable.setItems(FXCollections.observableArrayList(adminService.getAdminLogs()));

        logsView.getChildren().addAll(title, logTable);
        contentArea.getChildren().setAll(logsView);
    }

    private void showAlert(String title, String msg) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(msg);
        alert.showAndWait();
    }

    @FXML
    public void handleLogout() {
        MainApp.currentUser = null;
        MainApp.switchScene("scenes/Login.fxml");
    }
}
