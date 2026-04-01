package services;

import dao.*;
import models.*;
import java.math.BigDecimal;
import java.util.List;

public class MarketplaceService {
    private final UserDAO userDAO = new UserDAO();
    private final CategoryDAO categoryDAO = new CategoryDAO();
    private final ItemDAO itemDAO = new ItemDAO();
    private final OrderDAO orderDAO = new OrderDAO();
    private final AlertDAO alertDAO = new AlertDAO();
    private final NotificationDAO notificationDAO = new NotificationDAO();
    private final ItemService itemService = new ItemService();

    // User Services
    public boolean registerUser(User user) {
        return userDAO.registerUser(user);
    }

    public User login(String email, String password) {
        return userDAO.loginUser(email, password);
    }

    public User getUser(int userId) {
        return userDAO.getUserById(userId);
    }

    // Category Services
    public boolean addCategory(Category category) {
        return categoryDAO.addCategory(category);
    }

    public List<Category> getAllCategories() {
        return categoryDAO.getAllCategories();
    }

    // Item Services
    public int addItem(Item item) {
        int itemId = itemDAO.addItem(item);
        if (itemId > 0) {
            // Trigger procedural matching
            itemDAO.matchItemWithRequests(itemId, item.getCategoryId(), item.getPrice(), item.getTitle());
        }
        return itemId;
    }

    public List<Item> getAllItems(int excludeUserId) {
        return itemDAO.getAllItemsExcludeUser(excludeUserId);
    }

    public List<Item> filterItems(int categoryId, BigDecimal minPrice, BigDecimal maxPrice, String condition, int excludeUserId) {
         return itemDAO.filterItems(categoryId, minPrice, maxPrice, condition, excludeUserId);
    }

    public List<Item> getMyListings(int userId) {
        return itemDAO.getItemsBySellerId(userId);
    }

    public Item getItemById(int itemId) {
        return itemService.getItemById(itemId);
    }

    public boolean updateItem(Item item, java.io.File imageFile) {
        return itemService.updateItem(item, imageFile);
    }

    public boolean deleteItem(int itemId) {
        return itemService.deleteItem(itemId);
    }

    // Order Services
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
        // Now using the Procedural Block: AcceptOrder Stored Procedure
        return orderDAO.acceptOrderStoredProcedure(orderId, itemId);
    }

    public boolean rejectOrder(int orderId) {
        return orderDAO.updateOrderStatus(orderId, "cancelled");
    }

    // Alert Services
    public boolean createAlert(Alert alert) {
        return alertDAO.createAlert(alert);
    }

    // Notification Services
    public List<Notification> getUserNotifications(int userId) {
        return notificationDAO.getNotificationsByUserId(userId);
    }

    public boolean markNotificationRead(int notificationId) {
        return notificationDAO.markAsRead(notificationId);
    }
}
