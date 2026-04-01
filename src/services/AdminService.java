package services;

import dao.*;
import models.*;
import java.util.List;
import java.util.Map;

public class AdminService {
    
    private UserDAO userDAO = new UserDAO();
    private ItemDAO itemDAO = new ItemDAO();
    private CategoryDAO categoryDAO = new CategoryDAO();
    private AdminDAO adminDAO = new AdminDAO();
    private AdminLogDAO adminLogDAO = new AdminLogDAO();
    
    // User Management
    public List<User> getAllUsers() {
        return userDAO.getAllUsers();
    }
    
    public List<User> searchUsers(String query) {
        return userDAO.searchUsers(query);
    }
    
    public boolean updateUserStatus(int adminId, int userId, String status) {
        User target = userDAO.getUserById(userId);
        if (target != null && target.isAdmin()) {
            return false; // Prevent banning admins
        }
        boolean success = userDAO.updateUserStatus(userId, status);
        if (success) {
            logAction(adminId, "UPDATE_USER_STATUS_" + status, "User", userId);
        }
        return success;
    }

    // Item Management
    public List<Item> getAllItems() {
        return itemDAO.getAllItems();
    }

    public List<Item> searchAndFilterItems(String title, Integer categoryId, String status) {
        return itemDAO.searchAndFilterAdminItems(title, categoryId, status);
    }

    public boolean removeItem(int adminId, int itemId) {
        boolean success = itemDAO.updateItemStatus(itemId, "removed");
        if (success) {
            logAction(adminId, "REMOVE_ITEM", "Item", itemId);
        }
        return success;
    }
    
    // Category Management
    public List<Category> getAllCategories() {
        return categoryDAO.getAllCategories();
    }
    
    public boolean addCategory(int adminId, String name) {
        Category c = new Category(name);
        boolean success = categoryDAO.addCategory(c);
        if (success) {
            logAction(adminId, "ADD_CATEGORY", "Category", c.getCategoryId());
        }
        return success;
    }
    
    public boolean updateCategory(int adminId, int categoryId, String name) {
        boolean success = categoryDAO.updateCategory(categoryId, name);
        if (success) {
            logAction(adminId, "UPDATE_CATEGORY", "Category", categoryId);
        }
        return success;
    }

    public boolean deleteCategory(int adminId, int categoryId) {
        boolean success = categoryDAO.deleteCategory(categoryId);
        if (success) {
            logAction(adminId, "DELETE_CATEGORY", "Category", categoryId);
        }
        return success;
    }

    // Report Management
    public List<Map<String, Object>> getPendingReports() {
        return adminDAO.getPendingReports();
    }
    
    public boolean processReport(int adminId, int reportId, String action, Integer itemId, Integer reportedUserId) {
        boolean success = false;
        if ("remove_item".equals(action) && itemId != null) {
            itemDAO.updateItemStatus(itemId, "removed");
            logAction(adminId, "REMOVE_ITEM_VIA_REPORT", "Item", itemId);
            success = adminDAO.updateReportStatus(reportId, "resolved");
        } else if ("ban_user".equals(action) && reportedUserId != null) {
            User target = userDAO.getUserById(reportedUserId);
            if (target == null || target.isAdmin()) return false;
            userDAO.updateUserStatus(reportedUserId, "banned");
            logAction(adminId, "BAN_USER_VIA_REPORT", "User", reportedUserId);
            success = adminDAO.updateReportStatus(reportId, "resolved");
        } else if ("ignore".equals(action)) {
            success = adminDAO.updateReportStatus(reportId, "ignored");
        }
        
        if (success) {
            logAction(adminId, "PROCESS_REPORT_" + action.toUpperCase(), "Report", reportId);
        }
        return success;
    }

    // Review Moderation
    public List<Map<String, Object>> getReviews(Integer sellerId, Integer rating) {
        return adminDAO.getReviewsWithDetails(sellerId, rating);
    }
    
    public boolean deleteReview(int adminId, int reviewId) {
        boolean success = adminDAO.deleteReview(reviewId);
        if (success) {
            logAction(adminId, "DELETE_REVIEW", "Review", reviewId);
        }
        return success;
    }

    // Dashboard
    public Map<String, Integer> getDashboardCounts() {
        return adminDAO.getDashboardCounts();
    }
    
    // Admin Logs
    public List<AdminLog> getAdminLogs() {
        return adminLogDAO.getAllLogs();
    }
    
    private void logAction(int adminId, String action, String targetType, Integer targetId) {
        AdminLog log = new AdminLog(adminId, action, targetType, targetId);
        adminLogDAO.addLog(log);
    }
}
