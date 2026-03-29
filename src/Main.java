import models.*;
import services.MarketplaceService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Scanner;

public class Main {
    private static MarketplaceService service = new MarketplaceService();
    private static Scanner scanner = new Scanner(System.in);
    private static User currentUser = null;

    public static void main(String[] args) {
        boolean exit = false;
        while (!exit) {
            System.out.println("\n--- Electronic Marketplace System ---");
            if (currentUser == null) {
                System.out.println("1. Register User");
                System.out.println("2. Login User");
                System.out.println("3. Exit");
                System.out.print("Enter choice: ");
                int choice = getUserChoice();

                switch (choice) {
                    case 1:
                        registerUser();
                        break;
                    case 2:
                        loginUser();
                        break;
                    case 3:
                        exit = true;
                        break;
                    default:
                        System.out.println("Invalid choice.");
                }
            } else {
                System.out.println("Logged in as: " + currentUser.getName());
                System.out.println("1. Add Category");
                System.out.println("2. View Categories");
                System.out.println("3. Add Item to Sell");
                System.out.println("4. View All Items");
                System.out.println("5. Filter Items (Category & Price)");
                System.out.println("6. Place Order");
                System.out.println("7. View My Purchases");
                System.out.println("8. Manage My Sales (Accept/Reject Offers)");
                System.out.println("9. Create Alert");
                System.out.println("10. View Notifications");
                System.out.println("11. Logout");
                System.out.println("12. Exit");
                System.out.print("Enter choice: ");
                int choice = getUserChoice();

                switch (choice) {
                    case 1:
                        addCategory();
                        break;
                    case 2:
                        viewCategories();
                        break;
                    case 3:
                        addItem();
                        break;
                    case 4:
                        viewItems(service.getAllItems());
                        break;
                    case 5:
                        filterItems();
                        break;
                    case 6:
                        placeOrder();
                        break;
                    case 7:
                        viewTransactions();
                        break;
                    case 8:
                        manageSales();
                        break;
                    case 9:
                        createAlert();
                        break;
                    case 10:
                        viewNotifications();
                        break;
                    case 11:
                        currentUser = null;
                        System.out.println("Logged out successfully.");
                        break;
                    case 12:
                        exit = true;
                        break;
                    default:
                        System.out.println("Invalid choice.");
                }
            }
        }
        System.out.println("Exiting Marketplace...");
        scanner.close();
    }

    // Helper to get int bypassing scanner newline issues
    private static int getUserChoice() {
        try {
            return Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private static void registerUser() {
        System.out.print("Enter Name: ");
        String name = scanner.nextLine();
        System.out.print("Enter Email: ");
        String email = scanner.nextLine();
        System.out.print("Enter Password: ");
        String password = scanner.nextLine();
        System.out.print("Enter Phone: ");
        String phone = scanner.nextLine();

        User user = new User(name, email, password, phone);
        if (service.registerUser(user)) {
            System.out.println("Registration successful! You can now login.");
        } else {
            System.out.println("Registration failed. Email might already exist.");
        }
    }

    private static void loginUser() {
        System.out.print("Enter Email: ");
        String email = scanner.nextLine();
        System.out.print("Enter Password: ");
        String password = scanner.nextLine();

        User user = service.login(email, password);
        if (user != null) {
            currentUser = user;
            System.out.println("Login successful!");
        } else {
            System.out.println("Invalid email or password.");
        }
    }

    private static void addCategory() {
        if (!currentUser.isAdmin()) {
            System.out.println("Only administrators can add categories.");
            return;
        }
        System.out.print("Enter Category Name: ");
        String name = scanner.nextLine();
        System.out.print("Enter Parent Category ID (or 0 for top-level): ");
        int parentId = getUserChoice();

        Category category = new Category(name, parentId == 0 ? null : parentId, null);
        if (service.addCategory(category)) {
            System.out.println("Category added successfully.");
        } else {
            System.out.println("Failed to add category.");
        }
    }

    private static void viewCategories() {
        List<Category> categories = service.getAllCategories();
        System.out.println("--- Categories ---");
        for (Category c : categories) {
            System.out.println(c.getCategoryId() + ": " + c.getName() + " (Parent: " + c.getParentId() + ")");
        }
    }

    private static void addItem() {
        System.out.print("Enter Category ID: ");
        int categoryId = getUserChoice();
        System.out.print("Enter Title: ");
        String title = scanner.nextLine();
        System.out.print("Enter Description: ");
        String description = scanner.nextLine();
        System.out.print("Enter Price: ");
        BigDecimal price = new BigDecimal(scanner.nextLine());
        System.out.print("Enter Condition ('new' or 'used'): ");
        String condition = scanner.nextLine();

        Item item = new Item(currentUser.getUserId(), categoryId, title, description, price, condition);
        if (service.addItem(item)) {
            System.out.println("Item listed successfully.");
        } else {
            System.out.println("Failed to list item.");
        }
    }

    private static void filterItems() {
        System.out.print("Enter Category ID: ");
        int categoryId = getUserChoice();
        System.out.print("Enter Min Price (or empty for none): ");
        String minStr = scanner.nextLine();
        System.out.print("Enter Max Price (or empty for none): ");
        String maxStr = scanner.nextLine();

        BigDecimal min = minStr.isEmpty() ? null : new BigDecimal(minStr);
        BigDecimal max = maxStr.isEmpty() ? null : new BigDecimal(maxStr);

        List<Item> items = service.filterItems(categoryId, min, max);
        viewItems(items);
    }

    private static void viewItems(List<Item> items) {
        System.out.println("--- Items ---");
        if (items.isEmpty()) {
            System.out.println("No items found.");
        }
        for (Item i : items) {
            System.out.println(i);
        }
    }

    private static void placeOrder() {
        System.out.print("Enter Item ID to purchase: ");
        int itemId = getUserChoice();
        System.out.print("Enter Seller ID: ");
        int sellerId = getUserChoice();
        System.out.print("Confirm Price: ");
        BigDecimal price = new BigDecimal(scanner.nextLine());

        Order order = new Order(currentUser.getUserId(), sellerId, itemId, price, "pending");
        if (service.placeOrder(order)) {
            System.out.println("Order placed successfully.");
        } else {
            System.out.println("Failed to place order.");
        }
    }

    private static void viewTransactions() {
        List<Order> orders = service.getBuyerTransactions(currentUser.getUserId());
        System.out.println("--- My Purchases ---");
        for (Order o : orders) {
            System.out.println(o);
        }
    }

    private static void manageSales() {
        List<Order> sales = service.getSellerTransactions(currentUser.getUserId());
        System.out.println("--- Incoming Sales/Offers ---");
        if (sales.isEmpty()) {
            System.out.println("No offers found.");
            return;
        }

        for (Order o : sales) {
            System.out.println(o.getOrderId() + ": [Item " + o.getItemId() + "] Buyer: " + o.getBuyerEmail() + 
                    " | Price: " + o.getPrice() + " | Status: " + o.getStatus());
        }

        System.out.print("Enter Order ID to manage (or 0 to go back): ");
        int orderId = getUserChoice();
        if (orderId == 0)
            return;

        System.out.println("1. Accept (Mark as Sold)");
        System.out.println("2. Reject (Cancel)");
        System.out.print("Choice: ");
        int action = getUserChoice();

        if (action == 1) {
            // Find the item ID for this order
            int itemId = -1;
            for (Order o : sales) {
                if (o.getOrderId() == orderId) {
                    itemId = o.getItemId();
                    break;
                }
            }
            if (service.acceptOrder(orderId, itemId)) {
                System.out.println("Order accepted and item marked as sold!");
            } else {
                System.out.println("Failed to accept order.");
            }
        } else if (action == 2) {
            if (service.rejectOrder(orderId)) {
                System.out.println("Order rejected.");
            } else {
                System.out.println("Failed to reject order.");
            }
        }
    }

    private static void createAlert() {
        System.out.print("Enter Category ID to watch: ");
        int categoryId = getUserChoice();
        System.out.print("Enter Max Price: ");
        BigDecimal maxPrice = new BigDecimal(scanner.nextLine());
        System.out.print("Enter Condition ('new', 'used', or 'any'): ");
        String condition = scanner.nextLine();

        Alert alert = new Alert(currentUser.getUserId(), categoryId, BigDecimal.ZERO, maxPrice, condition);
        if (service.createAlert(alert)) {
            System.out.println("Alert created successfully.");
        } else {
            System.out.println("Failed to create alert.");
        }
    }

    private static void viewNotifications() {
        List<Notification> notifications = service.getUserNotifications(currentUser.getUserId());
        System.out.println("--- Notifications ---");
        for (Notification n : notifications) {
            System.out.println(n);
            if (!n.isRead()) {
                service.markNotificationRead(n.getNotificationId());
            }
        }
    }
}
