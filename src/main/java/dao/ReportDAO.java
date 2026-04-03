package dao;

import db.DBConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import models.Report;

public class ReportDAO {

    public void addReport(Integer itemId, int reportedUserId, int reportedBy, String reason) {
        String sql = "INSERT INTO Reports (item_id, reported_user_id, reported_by, reason, status) VALUES (?, ?, ?, ?, 'pending')";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            if (itemId != null) {
                stmt.setInt(1, itemId);
            } else {
                stmt.setNull(1, Types.INTEGER);
            }
            stmt.setInt(2, reportedUserId);
            stmt.setInt(3, reportedBy);
            stmt.setString(4, reason);
            
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Database error: Could not add report.");
        }
    }

    public boolean reportExists(Integer itemId, int reportedUserId, int reportedBy) {
        StringBuilder sql = new StringBuilder("SELECT 1 FROM Reports WHERE reported_by = ?");
        
        if (itemId != null) {
            sql.append(" AND item_id = ?");
        } else {
            sql.append(" AND reported_user_id = ? AND item_id IS NULL");
        }
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
            
            stmt.setInt(1, reportedBy);
            if (itemId != null) {
                stmt.setInt(2, itemId);
            } else {
                stmt.setInt(2, reportedUserId);
            }
            
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next(); // True if a report already exists for this exact case
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Report> getReportsByUser(int reportedUserId) {
        List<Report> reports = new ArrayList<>();
        String sql = "SELECT * FROM Reports WHERE reported_user_id = ? ORDER BY created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, reportedUserId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    reports.add(new Report(
                        rs.getInt("report_id"),
                        rs.getObject("item_id") != null ? rs.getInt("item_id") : null,
                        rs.getInt("reported_user_id"),
                        rs.getInt("reported_by"),
                        rs.getString("reason"),
                        rs.getString("status"),
                        rs.getTimestamp("created_at")
                    ));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return reports;
    }
}
