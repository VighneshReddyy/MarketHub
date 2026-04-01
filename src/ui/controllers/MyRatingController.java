package ui.controllers;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.TableView;
import javafx.scene.control.RadioButton;
import models.Report;
import models.Review;
import services.ReportService;
import services.ReviewService;
import ui.MainApp;

import java.util.List;

public class MyRatingController {

    @FXML private TableView<Report> reportsTable;
    @FXML private TableView<Review> reviewsTable;
    @FXML private RadioButton radioReports;
    @FXML private RadioButton radioReviews;
    
    private final ReportService reportService = new ReportService();
    private final ReviewService reviewService = new ReviewService();
    private ObservableList<Report> reportsList = FXCollections.observableArrayList();
    private ObservableList<Review> reviewsList = FXCollections.observableArrayList();

    @FXML
    public void initialize() {
        if (MainApp.currentUser != null) {
            loadReports();
            loadReviews();
        }
    }

    private void loadReports() {
        reportsList.clear();
        List<Report> reports = reportService.getReportsByUser(MainApp.currentUser.getUserId());
        reportsList.addAll(reports);
        reportsTable.setItems(reportsList);
    }

    private void loadReviews() {
        reviewsList.clear();
        List<Review> reviews = reviewService.getReviewsByUser(MainApp.currentUser.getUserId());
        reviewsList.addAll(reviews);
        reviewsTable.setItems(reviewsList);
    }

    @FXML
    public void handleToggleChange() {
        if (radioReports.isSelected()) {
            reportsTable.setVisible(true);
            reviewsTable.setVisible(false);
        } else if (radioReviews.isSelected()) {
            reportsTable.setVisible(false);
            reviewsTable.setVisible(true);
        }
    }

    @FXML
    public void navigateBack() {
        MainApp.switchScene("scenes/Dashboard.fxml");
    }
}
