package dao;

import db.DBConnection;
import models.User;
import models.Item;
import models.Category;
import models.Report;
import models.Review;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

public class AdminDAO {
    
    // --- Dashboard Counts ---
    public Map<String, Integer> getDashboardCounts() {
        Map<String, Integer> counts = new HashMap<>();
        String query = "SELECT " +
                       "(SELECT COUNT(*) FROM Users) AS users_count, " +
                       "(SELECT COUNT(*) FROM Items) AS items_count, " +
                       "(SELECT COUNT(*) FROM Reports) AS reports_count, " +
                       "(SELECT COUNT(*) FROM Orders) AS orders_count";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                counts.put("users", rs.getInt("users_count"));
                counts.put("items", rs.getInt("items_count"));
                counts.put("reports", rs.getInt("reports_count"));
                counts.put("orders", rs.getInt("orders_count"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return counts;
    }

    // --- Report Management ---
    public List<Map<String, Object>> getPendingReports() {
        List<Map<String, Object>> reports = new ArrayList<>();
        String sql = "SELECT r.*, u.name as reported_user_name, u.email as reported_user_email, " +
                     "i.title as item_title, i.status as item_status, reporter.name as reporter_name " +
                     "FROM Reports r " +
                     "JOIN Users u ON r.reported_user_id = u.user_id " +
                     "JOIN Users reporter ON r.reported_by = reporter.user_id " +
                     "LEFT JOIN Items i ON r.item_id = i.item_id " +
                     "WHERE r.status = 'pending'";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> map = new HashMap<>();
                map.put("report_id", rs.getInt("report_id"));
                map.put("item_id", rs.getObject("item_id"));
                map.put("item_title", rs.getString("item_title"));
                map.put("reported_user_id", rs.getInt("reported_user_id"));
                map.put("reported_user_name", rs.getString("reported_user_name"));
                map.put("reported_by", rs.getInt("reported_by"));
                map.put("reporter_name", rs.getString("reporter_name"));
                map.put("reason", rs.getString("reason"));
                map.put("status", rs.getString("status"));
                map.put("created_at", rs.getTimestamp("created_at"));
                reports.add(map);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return reports;
    }

    public boolean updateReportStatus(int reportId, String status) {
        String sql = "UPDATE Reports SET status = ? WHERE report_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, reportId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // --- Reviews Moderation ---
    public List<Map<String, Object>> getReviewsWithDetails(Integer sellerId, Integer rating) {
        List<Map<String, Object>> reviews = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
                "SELECT r.*, reviewer.name as reviewer_name, reviewed.name as seller_name, i.title as item_title " +
                "FROM Reviews r " +
                "JOIN Users reviewer ON r.reviewer_id = reviewer.user_id " +
                "JOIN Users reviewed ON r.reviewed_user_id = reviewed.user_id " +
                "JOIN Orders o ON r.order_id = o.order_id " +
                "JOIN Items i ON o.item_id = i.item_id " +
                "WHERE 1=1"
        );
        
        if (sellerId != null) sql.append(" AND r.reviewed_user_id = ?");
        if (rating != null) sql.append(" AND r.rating = ?");

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
            
            int paramIndex = 1;
            if (sellerId != null) stmt.setInt(paramIndex++, sellerId);
            if (rating != null) stmt.setInt(paramIndex++, rating);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("review_id", rs.getInt("review_id"));
                    map.put("reviewer_name", rs.getString("reviewer_name"));
                    map.put("seller_name", rs.getString("seller_name"));
                    map.put("item_title", rs.getString("item_title"));
                    map.put("rating", rs.getInt("rating"));
                    map.put("comment", rs.getString("comment"));
                    map.put("created_at", rs.getTimestamp("created_at"));
                    reviews.add(map);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return reviews;
    }

    public boolean deleteReview(int reviewId) {
        String sql = "DELETE FROM Reviews WHERE review_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, reviewId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
