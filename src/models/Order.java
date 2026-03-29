package models;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class Order {
    private int orderId;
    private int buyerId;
    private int sellerId;
    private int itemId;
    private BigDecimal price;
    private Timestamp orderDate;
    private String status; // 'pending', 'completed', 'cancelled'
    private String buyerEmail; // For display purposes in sales management

    public Order() {}

    public Order(int orderId, int buyerId, int sellerId, int itemId, BigDecimal price, Timestamp orderDate, String status) {
        this.orderId = orderId;
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.itemId = itemId;
        this.price = price;
        this.orderDate = orderDate;
        this.status = status;
    }

    public Order(int orderId, int buyerId, int sellerId, int itemId, BigDecimal price, Timestamp orderDate, String status, String buyerEmail) {
        this(orderId, buyerId, sellerId, itemId, price, orderDate, status);
        this.buyerEmail = buyerEmail;
    }

    public Order(int buyerId, int sellerId, int itemId, BigDecimal price, String status) {
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.itemId = itemId;
        this.price = price;
        this.status = status;
    }

    // Getters and Setters
    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }
    public int getBuyerId() { return buyerId; }
    public void setBuyerId(int buyerId) { this.buyerId = buyerId; }
    public int getSellerId() { return sellerId; }
    public void setSellerId(int sellerId) { this.sellerId = sellerId; }
    public int getItemId() { return itemId; }
    public void setItemId(int itemId) { this.itemId = itemId; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Timestamp getOrderDate() { return orderDate; }
    public void setOrderDate(Timestamp orderDate) { this.orderDate = orderDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBuyerEmail() { return buyerEmail; }
    public void setBuyerEmail(String buyerEmail) { this.buyerEmail = buyerEmail; }

    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", buyerId=" + buyerId +
                ", sellerId=" + sellerId +
                ", itemId=" + itemId +
                ", price=" + price +
                ", orderDate=" + orderDate +
                ", status='" + status + '\'' +
                '}';
    }
}
