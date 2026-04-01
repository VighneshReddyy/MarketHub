package ui;

import models.Category;
import models.Item;
import models.User;
import models.AdminLog;
import services.AdminService;

import java.util.List;
import java.util.Map;
import java.util.Scanner;

public class AdminMenu {
    private AdminService adminService = new AdminService();
    private Scanner scanner = new Scanner(System.in);
    private int adminId;

    public void start(int loggedInAdminId) {
        this.adminId = loggedInAdminId;
        while (true) {
            System.out.println("\n=== ADMIN PANEL ===");
            System.out.println("1. Dashboard");
            System.out.println("2. User Management");
            System.out.println("3. Item Management");
            System.out.println("4. Category Management");
            System.out.println("5. Reports Management");
            System.out.println("6. Reviews Moderation");
            System.out.println("7. View Admin Logs");
            System.out.println("0. Logout");
            System.out.print("Select an option: ");

            int choice = -1;
            try {
                choice = Integer.parseInt(scanner.nextLine());
            } catch (NumberFormatException e) {
                System.out.println("Invalid input!");
                continue;
            }

            switch (choice) {
                case 1: showDashboard(); break;
                case 2: userManagement(); break;
                case 3: itemManagement(); break;
                case 4: categoryManagement(); break;
                case 5: reportManagement(); break;
                case 6: reviewModeration(); break;
                case 7: viewAdminLogs(); break;
                case 0: return;
                default: System.out.println("Invalid option.");
            }
        }
    }

    private void showDashboard() {
        System.out.println("\n--- Dashboard ---");
        Map<String, Integer> counts = adminService.getDashboardCounts();
        System.out.println("Total Users: " + counts.get("users"));
        System.out.println("Total Items: " + counts.get("items"));
        System.out.println("Total Reports: " + counts.get("reports"));
        System.out.println("Total Orders: " + counts.get("orders"));
    }

    private void userManagement() {
        while (true) {
            System.out.println("\n--- User Management ---");
            System.out.println("1. View all users");
            System.out.println("2. Search by name/email");
            System.out.println("3. Ban/Unban user");
            System.out.println("0. Back");
            System.out.print("Select: ");
            String opt = scanner.nextLine();
            if (opt.equals("1")) {
                adminService.getAllUsers().forEach(System.out::println);
            } else if (opt.equals("2")) {
                System.out.print("Enter search query: ");
                String query = scanner.nextLine();
                adminService.searchUsers(query).forEach(System.out::println);
            } else if (opt.equals("3")) {
                System.out.print("Enter user ID: ");
                int targetId = Integer.parseInt(scanner.nextLine());
                System.out.print("Enter status (active/banned): ");
                String status = scanner.nextLine();
                if (adminService.updateUserStatus(adminId, targetId, status)) {
                    System.out.println("User status updated successfully.");
                } else {
                    System.out.println("Failed. User might be an admin or does not exist.");
                }
            } else if (opt.equals("0")) {
                break;
            }
        }
    }

    private void itemManagement() {
         while (true) {
            System.out.println("\n--- Item Management ---");
            System.out.println("1. View all items");
            System.out.println("2. Search by title, category, status");
            System.out.println("3. Remove item");
            System.out.println("0. Back");
            System.out.print("Select: ");
            String opt = scanner.nextLine();
            if (opt.equals("1")) {
                for (Item item : adminService.getAllItems()) {
                    System.out.printf("ID:%d | %s | %s | Status:%s | Seller:%s%n", 
                        item.getItemId(), item.getTitle(), item.getPrice(), item.getStatus(), item.getSellerName());
                }
            } else if (opt.equals("2")) {
                System.out.print("Enter title (leave blank for any): ");
                String title = scanner.nextLine();
                System.out.print("Enter category ID (0 for any): ");
                int catId = Integer.parseInt(scanner.nextLine());
                System.out.print("Enter status (leave blank for any): ");
                String status = scanner.nextLine();
                
                for (Item item : adminService.searchAndFilterItems(title, catId, status)) {
                    System.out.printf("ID:%d | %s | %s | Status:%s | Seller:%s%n", 
                        item.getItemId(), item.getTitle(), item.getPrice(), item.getStatus(), item.getSellerName());
                }
            } else if (opt.equals("3")) {
                System.out.print("Enter item ID to remove: ");
                int itemId = Integer.parseInt(scanner.nextLine());
                if (adminService.removeItem(adminId, itemId)) {
                    System.out.println("Item removed successfully.");
                } else {
                    System.out.println("Failed to remove item.");
                }
            } else if (opt.equals("0")) {
                break;
            }
        }
    }

    private void categoryManagement() {
        while (true) {
            System.out.println("\n--- Category Management ---");
            System.out.println("1. View all categories");
            System.out.println("2. Add category");
            System.out.println("3. Update category");
            System.out.println("4. Delete category");
            System.out.println("0. Back");
            System.out.print("Select: ");
            String opt = scanner.nextLine();
            if (opt.equals("1")) {
                adminService.getAllCategories().forEach(c -> System.out.println(c.getCategoryId() + ": " + c.getName()));
            } else if (opt.equals("2")) {
                System.out.print("Enter category name: ");
                String name = scanner.nextLine();
                if (adminService.addCategory(adminId, name)) {
                    System.out.println("Category added.");
                }
            } else if (opt.equals("3")) {
                System.out.print("Enter category ID: ");
                int catId = Integer.parseInt(scanner.nextLine());
                System.out.print("Enter new name: ");
                String newName = scanner.nextLine();
                if (adminService.updateCategory(adminId, catId, newName)) {
                    System.out.println("Category updated.");
                }
            } else if (opt.equals("4")) {
                System.out.print("Enter category ID: ");
                int catId = Integer.parseInt(scanner.nextLine());
                if (adminService.deleteCategory(adminId, catId)) {
                    System.out.println("Category deleted.");
                } else {
                    System.out.println("Deletion failed (items might exist).");
                }
            } else if (opt.equals("0")) {
                break;
            }
        }
    }

    private void reportManagement() {
        while (true) {
            System.out.println("\n--- Reports Management ---");
            System.out.println("1. View pending reports");
            System.out.println("2. Process report");
            System.out.println("0. Back");
            System.out.print("Select: ");
            String opt = scanner.nextLine();
            if (opt.equals("1")) {
                for (Map<String, Object> r : adminService.getPendingReports()) {
                    System.out.println("Report #" + r.get("report_id") + " | Reporter: " + r.get("reporter_name"));
                    System.out.println("Item: ID " + r.get("item_id") + " (" + r.get("item_title") + ")");
                    System.out.println("Reported User: ID " + r.get("reported_user_id") + " (" + r.get("reported_user_name") + ")");
                    System.out.println("Reason: " + r.get("reason") + " | Status: " + r.get("status"));
                    System.out.println("-------------------------");
                }
            } else if (opt.equals("2")) {
                System.out.print("Enter report ID: ");
                int repId = Integer.parseInt(scanner.nextLine());
                System.out.print("Enter action (remove_item/ban_user/ignore): ");
                String action = scanner.nextLine();
                System.out.print("Provide target Item ID (if removing item) or 0: ");
                int itemId = Integer.parseInt(scanner.nextLine());
                System.out.print("Provide target User ID (if banning user) or 0: ");
                int userId = Integer.parseInt(scanner.nextLine());
                
                Integer paramItem = (itemId > 0) ? itemId : null;
                Integer paramUser = (userId > 0) ? userId : null;
                
                if (adminService.processReport(adminId, repId, action, paramItem, paramUser)) {
                    System.out.println("Report processed.");
                } else {
                    System.out.println("Failed to process report.");
                }
            } else if (opt.equals("0")) {
                break;
            }
        }
    }

    private void reviewModeration() {
         while (true) {
            System.out.println("\n--- Reviews Moderation ---");
            System.out.println("1. View/Filter reviews");
            System.out.println("2. Delete review");
            System.out.println("0. Back");
            System.out.print("Select: ");
            String opt = scanner.nextLine();
            if (opt.equals("1")) {
                System.out.print("Filter by Seller ID (0 for all): ");
                int sId = Integer.parseInt(scanner.nextLine());
                System.out.print("Filter by Rating (0 for all): ");
                int rat = Integer.parseInt(scanner.nextLine());
                
                Integer paramSeller = (sId > 0) ? sId : null;
                Integer paramRating = (rat > 0) ? rat : null;
                
                for (Map<String, Object> r : adminService.getReviews(paramSeller, paramRating)) {
                    System.out.println("Review #" + r.get("review_id") + " | Rating: " + r.get("rating"));
                    System.out.println("Reviewer: " + r.get("reviewer_name") + " | Seller: " + r.get("seller_name"));
                    System.out.println("Item: " + r.get("item_title"));
                    System.out.println("Comment: " + r.get("comment"));
                    System.out.println("-------------------------");
                }
            } else if (opt.equals("2")) {
                System.out.print("Enter review ID to delete: ");
                int revId = Integer.parseInt(scanner.nextLine());
                if (adminService.deleteReview(adminId, revId)) {
                    System.out.println("Review deleted.");
                }
            } else if (opt.equals("0")) {
                break;
            }
        }
    }

    private void viewAdminLogs() {
        System.out.println("\n--- Admin Logs ---");
        for (AdminLog log : adminService.getAdminLogs()) {
            System.out.printf("Log ID:%d | Admin D:%d | Action:%s | Type:%s | Target:%s | Time:%s%n",
                log.getLogId(), log.getAdminId(), log.getAction(), log.getTargetType(),
                log.getTargetId(), log.getCreatedAt());
        }
    }
}
