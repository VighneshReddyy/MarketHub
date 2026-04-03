package dao;

import db.DBConnection;
import models.Item;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

public class ItemDAO {
    
    public List<Item> getAllItemsExcludeUser(int userId) {
        String sql = "SELECT i.*, u.name AS seller_name, u.email AS seller_email, MAX(m.file_path) AS file_path " +
                     "FROM Items i " +
                     "JOIN Users u ON i.seller_id = u.user_id " +
                     "LEFT JOIN ItemMedia m ON i.item_id = m.item_id AND m.media_type = 'image' " +
                     "WHERE i.seller_id <> ? " +
                     "GROUP BY i.item_id, u.name, u.email";
        return getItemsQueryWithIntParam(sql, userId);
    }
    
    public Item getItemById(int itemId) {
        String sql = "SELECT i.*, u.name AS seller_name, u.email AS seller_email, MAX(m.file_path) AS file_path " +
                     "FROM Items i " +
                     "JOIN Users u ON i.seller_id = u.user_id " +
                     "LEFT JOIN ItemMedia m ON i.item_id = m.item_id AND m.media_type = 'image' " +
                     "WHERE i.item_id = ? " +
                     "GROUP BY i.item_id, u.name, u.email";
        List<Item> items = getItemsQueryWithIntParam(sql, itemId);
        if (items != null && !items.isEmpty()) {
            return items.get(0);
        }
        return null;
    }

    public List<Item> getItemsBySellerId(int sellerId) {
        String sql = "SELECT i.*, u.name AS seller_name, u.email AS seller_email, MAX(m.file_path) AS file_path " +
                     "FROM Items i " +
                     "JOIN Users u ON i.seller_id = u.user_id " +
                     "LEFT JOIN ItemMedia m ON i.item_id = m.item_id AND m.media_type = 'image' " +
                     "WHERE i.seller_id = ? " +
                     "GROUP BY i.item_id, u.name, u.email";
        return getItemsQueryWithIntParam(sql, sellerId);
    }

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

    public void matchItemWithRequests(int itemId, int categoryId, java.math.BigDecimal price, String title) {
        String sql = "{CALL MatchItemWithRequests(?, ?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {
            stmt.setInt(1, itemId);
            stmt.setInt(2, categoryId);
            stmt.setBigDecimal(3, price);
            stmt.setString(4, title);
            stmt.execute();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public boolean updateItem(Item item) {
        String sql = "UPDATE Items SET category_id = ?, title = ?, description = ?, price = ?, condition_type = ?, status = ?, usage_months = ? WHERE item_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, item.getCategoryId());
            stmt.setString(2, item.getTitle());
            stmt.setString(3, item.getDescription());
            stmt.setBigDecimal(4, item.getPrice());
            stmt.setString(5, item.getConditionType());
            stmt.setString(6, item.getStatus());
            if (item.getUsageMonths() != null) {
                stmt.setInt(7, item.getUsageMonths());
            } else {
                stmt.setNull(7, Types.INTEGER);
            }
            stmt.setInt(8, item.getItemId());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteItem(int itemId) {
        String sql = "DELETE FROM Items WHERE item_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, itemId);
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
        return getItemsQuery("SELECT i.*, u.name AS seller_name, u.email AS seller_email, MAX(m.file_path) AS file_path " +
                            "FROM Items i " +
                            "JOIN Users u ON i.seller_id = u.user_id " +
                            "LEFT JOIN ItemMedia m ON i.item_id = m.item_id AND m.media_type = 'image' " +
                            "GROUP BY i.item_id, u.name, u.email");
    }

    public List<Item> getItemsByCategory(int categoryId) {
        String sql = "SELECT i.*, u.name AS seller_name, u.email AS seller_email, MAX(m.file_path) AS file_path " +
                     "FROM Items i " +
                     "JOIN Users u ON i.seller_id = u.user_id " +
                     "LEFT JOIN ItemMedia m ON i.item_id = m.item_id AND m.media_type = 'image' " +
                     "WHERE i.category_id = ? " +
                     "GROUP BY i.item_id, u.name, u.email";
        return getItemsQueryWithIntParam(sql, categoryId);
    }
    
    public List<Item> filterItems(int categoryId, BigDecimal minPrice, BigDecimal maxPrice, String condition, int excludeUserId) {
        List<Item> items = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT i.*, u.name AS seller_name, u.email AS seller_email, MAX(m.file_path) AS file_path " +
                                              "FROM Items i " +
                                              "JOIN Users u ON i.seller_id = u.user_id " +
                                              "LEFT JOIN ItemMedia m ON i.item_id = m.item_id AND m.media_type = 'image' " +
                                              "WHERE i.seller_id <> ?");

        if (categoryId > 0) sql.append(" AND i.category_id = ?");
        if (minPrice != null && maxPrice != null) sql.append(" AND i.price BETWEEN ? AND ?");
        if (condition != null && !condition.isEmpty() && !"Any".equalsIgnoreCase(condition)) sql.append(" AND i.condition_type = ?");
        sql.append(" GROUP BY i.item_id, u.name, u.email");

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
            
            int paramIndex = 1;
            stmt.setInt(paramIndex++, excludeUserId);
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

    public List<Item> searchAndFilterAdminItems(String title, Integer categoryId, String status) {
        StringBuilder sql = new StringBuilder("SELECT i.*, u.name AS seller_name, u.email AS seller_email, MAX(m.file_path) AS file_path FROM Items i JOIN Users u ON i.seller_id = u.user_id LEFT JOIN ItemMedia m ON i.item_id = m.item_id AND m.media_type = 'image' WHERE 1=1");
        if (title != null && !title.isEmpty()) sql.append(" AND i.title LIKE ?");
        if (categoryId != null && categoryId > 0) sql.append(" AND i.category_id = ?");
        if (status != null && !status.isEmpty()) sql.append(" AND i.status = ?");
        sql.append(" GROUP BY i.item_id, u.name, u.email");

        List<Item> items = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
            
            int paramIndex = 1;
            if (title != null && !title.isEmpty()) stmt.setString(paramIndex++, "%" + title + "%");
            if (categoryId != null && categoryId > 0) stmt.setInt(paramIndex++, categoryId);
            if (status != null && !status.isEmpty()) stmt.setString(paramIndex++, status);
            
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
             item.setSellerName(rs.getString("seller_name"));
             item.setSellerEmail(rs.getString("seller_email"));
        } catch (SQLException e) {
             // Columns may not exist in some simpler queries
        }
        return item;
    }
}
