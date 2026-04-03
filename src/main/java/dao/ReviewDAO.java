package dao;

import db.DBConnection;
import models.Review;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ReviewDAO {

    public List<Review> getReviewsByUser(int reviewedUserId) {
        List<Review> reviews = new ArrayList<>();
        String sql = "SELECT r.*, u.name AS reviewer_name, i.title AS item_name " +
                     "FROM Reviews r " +
                     "LEFT JOIN Users u ON r.reviewer_id = u.user_id " +
                     "LEFT JOIN Orders o ON r.order_id = o.order_id " +
                     "LEFT JOIN Items i ON o.item_id = i.item_id " +
                     "WHERE r.reviewed_user_id = ? ORDER BY r.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, reviewedUserId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Review review = new Review(
                        rs.getInt("review_id"),
                        rs.getInt("reviewer_id"),
                        rs.getInt("reviewed_user_id"),
                        rs.getInt("order_id"),
                        rs.getInt("rating"),
                        rs.getString("comment"),
                        rs.getTimestamp("created_at")
                    );
                    review.setReviewerName(rs.getString("reviewer_name"));
                    review.setItemName(rs.getString("item_name"));
                    reviews.add(review);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return reviews;
    }

    public boolean addReview(Review review) {
        // First check if the order is completed and belongs to the reviewer
        String statusSql = "SELECT status, buyer_id FROM Orders WHERE order_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement statusStmt = conn.prepareStatement(statusSql)) {
            statusStmt.setInt(1, review.getOrderId());
            try (ResultSet rs = statusStmt.executeQuery()) {
                if (rs.next()) {
                    String status = rs.getString("status");
                    int buyerId = rs.getInt("buyer_id");
                    
                    if (!"completed".equalsIgnoreCase(status)) {
                        System.err.println("Cannot review an order that is not completed. Current status: " + status);
                        return false;
                    }
                    if (buyerId != review.getReviewerId()) {
                        System.err.println("Only the buyer can review this order.");
                        return false;
                    }
                } else {
                    System.err.println("Order not found.");
                    return false;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }

        String sql = "INSERT INTO Reviews (reviewer_id, reviewed_user_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, review.getReviewerId());
            stmt.setInt(2, review.getReviewedUserId());
            stmt.setInt(3, review.getOrderId());
            stmt.setInt(4, review.getRating());
            stmt.setString(5, review.getComment());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            // Likely a duplicate PK error because order_id is UNIQUE in Reviews table
            e.printStackTrace();
            return false;
        }
    }
}
