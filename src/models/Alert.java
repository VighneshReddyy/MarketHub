package models;

import java.math.BigDecimal;

public class Alert {
    private int alertId;
    private int userId;
    private int categoryId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String conditionType; // 'new', 'used', 'any'

    public Alert() {}

    public Alert(int alertId, int userId, int categoryId, BigDecimal minPrice, BigDecimal maxPrice, String conditionType) {
        this.alertId = alertId;
        this.userId = userId;
        this.categoryId = categoryId;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.conditionType = conditionType;
    }

    public Alert(int userId, int categoryId, BigDecimal minPrice, BigDecimal maxPrice, String conditionType) {
        this.userId = userId;
        this.categoryId = categoryId;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.conditionType = conditionType;
    }

    // Getters and Setters
    public int getAlertId() { return alertId; }
    public void setAlertId(int alertId) { this.alertId = alertId; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public int getCategoryId() { return categoryId; }
    public void setCategoryId(int categoryId) { this.categoryId = categoryId; }
    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }
    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }
    public String getConditionType() { return conditionType; }
    public void setConditionType(String conditionType) { this.conditionType = conditionType; }

    @Override
    public String toString() {
        return String.format("Alert [categoryId=%d, minPrice=%.2f, maxPrice=%.2f, condition=%s]",
                categoryId, minPrice, maxPrice, conditionType);
    }
}
