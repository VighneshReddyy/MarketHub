package dao;

import db.DBConnection;
import models.Item;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

public class ItemDAO {

    public int addItem(Item item) {
        String sql = "INSERT INTO Items (seller_id, category_id, title, description, price, condition_type, status, usage_months) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, item.getSellerId());
            stmt.setInt(2, item.getCategoryId());
            stmt.setString(3, item.getTitle());
            stmt.setString(4, item.getDescription());
            stmt.setBigDecimal(5, item.getPrice());
            stmt.setString(6, item.getConditionType());
            stmt.setString(7, item.getStatus());
            if (item.getUsageMonths() != null) {
                stmt.setInt(8, item.getUsageMonths());
            } else {
                stmt.setNull(8, Types.INTEGER);
            }
            int affected = stmt.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = stmt.getGeneratedKeys()) {
                    if (rs.next()) return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
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
        return getItemsQuery("SELECT i.*, MAX(m.file_path) AS file_path FROM Items i LEFT JOIN ItemMedia m ON i.item_id = m.item_id AND m.media_type = 'image' GROUP BY i.item_id");
    }

    public List<Item> getItemsByCategory(int categoryId) {
        String sql = "SELECT i.*, MAX(m.file_path) AS file_path FROM Items i LEFT JOIN ItemMedia m ON i.item_id = m.item_id AND m.media_type = 'image' WHERE i.category_id = ? GROUP BY i.item_id";
        return getItemsQueryWithIntParam(sql, categoryId);
    }
    
    public List<Item> filterItems(int categoryId, BigDecimal minPrice, BigDecimal maxPrice, String condition) {
        List<Item> items = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT i.*, MAX(m.file_path) AS file_path FROM Items i LEFT JOIN ItemMedia m ON i.item_id = m.item_id AND m.media_type = 'image' WHERE 1=1");

        if (categoryId > 0) sql.append(" AND i.category_id = ?");
        if (minPrice != null && maxPrice != null) sql.append(" AND i.price BETWEEN ? AND ?");
        if (condition != null && !condition.isEmpty() && !"Any".equalsIgnoreCase(condition)) sql.append(" AND i.condition_type = ?");
        sql.append(" GROUP BY i.item_id");

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
            
            int paramIndex = 1;
            if (categoryId > 0) stmt.setInt(paramIndex++, categoryId);
            if (minPrice != null && maxPrice != null) {
                 stmt.setBigDecimal(paramIndex++, minPrice);
                 stmt.setBigDecimal(paramIndex++, maxPrice);
            }
            if (condition != null && !condition.isEmpty() && !"Any".equalsIgnoreCase(condition)) {
                stmt.setString(paramIndex++, condition.toLowerCase());
            }
            
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
        Item item = new Item(
            rs.getInt("item_id"),
            rs.getInt("seller_id"),
            rs.getInt("category_id"),
            rs.getString("title"),
            rs.getString("description"),
            rs.getBigDecimal("price"),
            rs.getString("condition_type"),
            rs.getString("status"),
            rs.getTimestamp("created_at"),
            (Integer) rs.getObject("usage_months")
        );
        try {
             item.setImageUrl(rs.getString("file_path"));
        } catch (SQLException e) {
             // Column may not exist in some simpler queries
        }
        return item;
    }
}
