package services;

import dao.UserDAO;
import models.User;

public class UserService {
    private final UserDAO userDAO = new UserDAO();

    public boolean registerUser(User user) {
        return userDAO.registerUser(user);
    }

    public User login(String email, String password) {
        return userDAO.loginUser(email, password);
    }

    public User getUser(int userId) {
        return userDAO.getUserById(userId);
    }
}
