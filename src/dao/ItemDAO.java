package dao;

import db.DBConnection;
import models.Item;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

public class ItemDAO {

    public boolean addItem(Item item) {
        String sql = "INSERT INTO Items (seller_id, category_id, title, description, price, condition_type, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, item.getSellerId());
            stmt.setInt(2, item.getCategoryId());
            stmt.setString(3, item.getTitle());
            stmt.setString(4, item.getDescription());
            stmt.setBigDecimal(5, item.getPrice());
            stmt.setString(6, item.getConditionType());
            stmt.setString(7, item.getStatus());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean updateItemStatus(int itemId, String status) {
        String sql = "UPDATE Items SET status = ? WHERE item_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, itemId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Item> getAllItems() {
        return getItemsQuery("SELECT * FROM Items");
    }

    public List<Item> getItemsByCategory(int categoryId) {
        String sql = "SELECT * FROM Items WHERE category_id = ?";
        return getItemsQueryWithIntParam(sql, categoryId);
    }
    
    public List<Item> filterItems(int categoryId, BigDecimal minPrice, BigDecimal maxPrice) {
        List<Item> items = new ArrayList<>();
        String sql = "SELECT * FROM Items WHERE category_id = ? AND price BETWEEN ? AND ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, categoryId);
            stmt.setBigDecimal(2, minPrice);
            stmt.setBigDecimal(3, maxPrice);
            try (ResultSet rs = stmt.executeQuery()) {
                 while (rs.next()) {
                    items.add(mapResultSetToItem(rs));
                 }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return items;
    }

    private List<Item> getItemsQuery(String sql) {
        List<Item> items = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                items.add(mapResultSetToItem(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return items;
    }
    
    private List<Item> getItemsQueryWithIntParam(String sql, int param) {
        List<Item> items = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, param);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    items.add(mapResultSetToItem(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return items;
    }
    
    private Item mapResultSetToItem(ResultSet rs) throws SQLException {
        return new Item(
            rs.getInt("item_id"),
            rs.getInt("seller_id"),
            rs.getInt("category_id"),
            rs.getString("title"),
            rs.getString("description"),
            rs.getBigDecimal("price"),
            rs.getString("condition_type"),
            rs.getString("status"),
            rs.getTimestamp("created_at")
        );
    }
}
