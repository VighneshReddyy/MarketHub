package dao;

import db.DBConnection;
import models.Order;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class OrderDAO {

    public boolean placeOrder(Order order) {
        String sql = "INSERT INTO Orders (buyer_id, seller_id, item_id, price, status) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, order.getBuyerId());
            stmt.setInt(2, order.getSellerId());
            stmt.setInt(3, order.getItemId());
            stmt.setBigDecimal(4, order.getPrice());
            stmt.setString(5, order.getStatus());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Order> getOrdersByBuyerId(int buyerId) {
        return getOrdersQuery("SELECT O.*, I.title AS item_name, I.created_at AS listing_date FROM Orders O JOIN Items I ON O.item_id = I.item_id WHERE O.buyer_id = ?", buyerId);
    }
    
    public List<Order> getOrdersBySellerId(int sellerId) {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT O.*, U.email AS buyer_email, I.title AS item_name, I.created_at AS listing_date FROM Orders O " +
                     "JOIN Users U ON O.buyer_id = U.user_id " +
                     "JOIN Items I ON O.item_id = I.item_id " +
                     "WHERE O.seller_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, sellerId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    orders.add(new Order(
                        rs.getInt("order_id"),
                        rs.getInt("buyer_id"),
                        rs.getInt("seller_id"),
                        rs.getInt("item_id"),
                        rs.getBigDecimal("price"),
                        rs.getTimestamp("order_date"),
                        rs.getString("status"),
                        rs.getString("buyer_email"),
                        rs.getString("item_name"),
                        rs.getTimestamp("listing_date")
                    ));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
    }

    public boolean updateOrderStatus(int orderId, String status) {
        String sql = "UPDATE Orders SET status = ? WHERE order_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, orderId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private List<Order> getOrdersQuery(String sql, int userId) {
        List<Order> orders = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Order ord = new Order(
                        rs.getInt("order_id"),
                        rs.getInt("buyer_id"),
                        rs.getInt("seller_id"),
                        rs.getInt("item_id"),
                        rs.getBigDecimal("price"),
                        rs.getTimestamp("order_date"),
                        rs.getString("status")
                    );
                    try {
                        ord.setItemName(rs.getString("item_name"));
                        ord.setListingDate(rs.getTimestamp("listing_date"));
                    } catch (SQLException ignore) {}
                    orders.add(ord);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
    }
}
