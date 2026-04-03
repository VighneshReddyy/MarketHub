package services;

import dao.ReportDAO;
import dao.ItemDAO;
import dao.UserDAO;
import models.Item;
import models.User;
import models.Report;
import java.util.List;

public class ReportService {

    private final ReportDAO reportDAO = new ReportDAO();
    private final ItemDAO itemDAO = new ItemDAO();
    private final UserDAO userDAO = new UserDAO();

    public boolean reportItem(int itemId, int reportedBy, String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("Reason cannot be empty.");
        }

        Item item = itemDAO.getItemById(itemId);
        if (item == null) {
            throw new IllegalArgumentException("Item does not exist.");
        }

        int reportedUserId = item.getSellerId();

        if (reportedBy == reportedUserId) {
            throw new IllegalArgumentException("You cannot report your own item.");
        }

        if (reportDAO.reportExists(itemId, reportedUserId, reportedBy)) {
            throw new IllegalStateException("You have already reported this item.");
        }

        try {
            reportDAO.addReport(itemId, reportedUserId, reportedBy, reason);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean reportUser(int reportedUserId, int reportedBy, String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("Reason cannot be empty.");
        }

        if (reportedUserId == reportedBy) {
            throw new IllegalArgumentException("You cannot report yourself.");
        }

        User user = userDAO.getUserById(reportedUserId);
        if (user == null) {
            throw new IllegalArgumentException("User does not exist.");
        }

        if (reportDAO.reportExists(null, reportedUserId, reportedBy)) {
            throw new IllegalStateException("You have already reported this user.");
        }

        try {
            reportDAO.addReport(null, reportedUserId, reportedBy, reason);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Report> getReportsByUser(int reportedUserId) {
        return reportDAO.getReportsByUser(reportedUserId);
    }
}
