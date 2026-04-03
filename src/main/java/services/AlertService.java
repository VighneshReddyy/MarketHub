package services;

import dao.AlertDAO;
import models.Alert;

public class AlertService {
    private final AlertDAO alertDAO = new AlertDAO();

    public boolean createAlert(Alert alert) {
        return alertDAO.createAlert(alert);
    }
}
