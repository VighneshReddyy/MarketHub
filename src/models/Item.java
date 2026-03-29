package models;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class Item {
    private int itemId;
    private int sellerId;
    private int categoryId;
    private String title;
    private String description;
    private BigDecimal price;
    private String conditionType; // 'new', 'used'
    private String status; // 'available', 'sold'
    private Timestamp createdAt;
    private Integer usageMonths;
    private String imageUrl; // For UI display purposes (populated via JOIN in DAO)

    public Item() {}

    public Item(int itemId, int sellerId, int categoryId, String title, String description, BigDecimal price, String conditionType, String status, Timestamp createdAt, Integer usageMonths) {
        this.itemId = itemId;
        this.sellerId = sellerId;
        this.categoryId = categoryId;
        this.title = title;
        this.description = description;
        this.price = price;
        this.conditionType = conditionType;
        this.status = status;
        this.createdAt = createdAt;
        this.usageMonths = usageMonths;
    }

    public Item(int sellerId, int categoryId, String title, String description, BigDecimal price, String conditionType) {
        this.sellerId = sellerId;
        this.categoryId = categoryId;
        this.title = title;
        this.description = description;
        this.price = price;
        this.conditionType = conditionType;
        this.status = "available";
    }

    // Getters and Setters
    public int getItemId() { return itemId; }
    public void setItemId(int itemId) { this.itemId = itemId; }
    public int getSellerId() { return sellerId; }
    public void setSellerId(int sellerId) { this.sellerId = sellerId; }
    public int getCategoryId() { return categoryId; }
    public void setCategoryId(int categoryId) { this.categoryId = categoryId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getConditionType() { return conditionType; }
    public void setConditionType(String conditionType) { this.conditionType = conditionType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    public Integer getUsageMonths() { return usageMonths; }
    public void setUsageMonths(Integer usageMonths) { this.usageMonths = usageMonths; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    @Override
    public String toString() {
        return String.format("Item #%d: [%s] %s | Price: ₹%.2f | Condition: %s | Status: %s",
                itemId, categoryId, title, price, conditionType, status);
    }
}
