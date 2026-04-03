package models;

import java.sql.Timestamp;

public class Report {
    private int reportId;
    private Integer itemId; // Nullable
    private int reportedUserId;
    private int reportedBy;
    private String reason;
    private String status; // 'pending', 'resolved', 'ignored'
    private Timestamp createdAt;

    public Report() {}

    public Report(int reportId, Integer itemId, int reportedUserId, int reportedBy, String reason, String status, Timestamp createdAt) {
        this.reportId = reportId;
        this.itemId = itemId;
        this.reportedUserId = reportedUserId;
        this.reportedBy = reportedBy;
        this.reason = reason;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public int getReportId() { return reportId; }
    public void setReportId(int reportId) { this.reportId = reportId; }

    public Integer getItemId() { return itemId; }
    public void setItemId(Integer itemId) { this.itemId = itemId; }

    public int getReportedUserId() { return reportedUserId; }
    public void setReportedUserId(int reportedUserId) { this.reportedUserId = reportedUserId; }

    public int getReportedBy() { return reportedBy; }
    public void setReportedBy(int reportedBy) { this.reportedBy = reportedBy; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
