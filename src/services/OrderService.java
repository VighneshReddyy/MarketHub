package services;

import dao.OrderDAO;
import dao.ItemDAO;
import models.Order;
import java.util.List;

public class OrderService {
    private final OrderDAO orderDAO = new OrderDAO();
    private final ItemDAO itemDAO = new ItemDAO();

    public boolean placeOrder(Order order) {
        // Here we could add logic to check if item is still available before placing order
        return orderDAO.placeOrder(order);
    }

    public List<Order> getBuyerTransactions(int buyerId) {
        return orderDAO.getOrdersByBuyerId(buyerId);
    }
    
    public List<Order> getSellerTransactions(int sellerId) {
         return orderDAO.getOrdersBySellerId(sellerId);
    }

    public boolean acceptOrder(int orderId, int itemId) {
        // In a real system, use a transaction here
        boolean orderUpdated = orderDAO.updateOrderStatus(orderId, "completed");
        if (orderUpdated) {
            return itemDAO.updateItemStatus(itemId, "sold");
        }
        return false;
    }

    public boolean rejectOrder(int orderId) {
        return orderDAO.updateOrderStatus(orderId, "cancelled");
    }
}
