package dao;

import db.DBConnection;
import models.Alert;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AlertDAO {

    public boolean createAlert(Alert alert) {
        String sql = "INSERT INTO Alerts (user_id, category_id, min_price, max_price, condition_type) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, alert.getUserId());
            stmt.setInt(2, alert.getCategoryId());
            stmt.setBigDecimal(3, alert.getMinPrice());
            stmt.setBigDecimal(4, alert.getMaxPrice());
            stmt.setString(5, alert.getConditionType());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Alert> getAlertsByUserId(int userId) {
        List<Alert> alerts = new ArrayList<>();
        String sql = "SELECT * FROM Alerts WHERE user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    alerts.add(new Alert(
                        rs.getInt("alert_id"),
                        rs.getInt("user_id"),
                        rs.getInt("category_id"),
                        rs.getBigDecimal("min_price"),
                        rs.getBigDecimal("max_price"),
                        rs.getString("condition_type")
                    ));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return alerts;
    }
}
