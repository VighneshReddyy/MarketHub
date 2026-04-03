package dao;

import db.DBConnection;
import models.AdminLog;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AdminLogDAO {

    public boolean addLog(AdminLog log) {
        String sql = "INSERT INTO AdminLogs (admin_id, action, target_type, target_id) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, log.getAdminId());
            stmt.setString(2, log.getAction());
            stmt.setString(3, log.getTargetType());
            if (log.getTargetId() != null) {
                stmt.setInt(4, log.getTargetId());
            } else {
                stmt.setNull(4, Types.INTEGER);
            }
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<AdminLog> getAllLogs() {
        List<AdminLog> logs = new ArrayList<>();
        String sql = "SELECT * FROM AdminLogs ORDER BY created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                logs.add(new AdminLog(
                    rs.getInt("log_id"),
                    rs.getInt("admin_id"),
                    rs.getString("action"),
                    rs.getString("target_type"),
                    rs.getObject("target_id") != null ? rs.getInt("target_id") : null,
                    rs.getTimestamp("created_at")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return logs;
    }
}
