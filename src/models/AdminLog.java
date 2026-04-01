package models;

import java.sql.Timestamp;

public class AdminLog {
    private int logId;
    private int adminId;
    private String action;
    private String targetType;
    private Integer targetId;
    private Timestamp createdAt;

    public AdminLog() {}

    public AdminLog(int logId, int adminId, String action, String targetType, Integer targetId, Timestamp createdAt) {
        this.logId = logId;
        this.adminId = adminId;
        this.action = action;
        this.targetType = targetType;
        this.targetId = targetId;
        this.createdAt = createdAt;
    }

    public AdminLog(int adminId, String action, String targetType, Integer targetId) {
        this.adminId = adminId;
        this.action = action;
        this.targetType = targetType;
        this.targetId = targetId;
    }

    public int getLogId() { return logId; }
    public void setLogId(int logId) { this.logId = logId; }

    public int getAdminId() { return adminId; }
    public void setAdminId(int adminId) { this.adminId = adminId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }

    public Integer getTargetId() { return targetId; }
    public void setTargetId(Integer targetId) { this.targetId = targetId; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "AdminLog{" +
                "logId=" + logId +
                ", adminId=" + adminId +
                ", action='" + action + '\'' +
                ", targetType='" + targetType + '\'' +
                ", targetId=" + targetId +
                '}';
    }
}
