package services;

import dao.CategoryDAO;
import models.Category;
import java.util.List;

public class CategoryService {
    private final CategoryDAO categoryDAO = new CategoryDAO();

    public boolean addCategory(Category category) {
        return categoryDAO.addCategory(category);
    }

    public List<Category> getAllCategories() {
        return categoryDAO.getAllCategories();
    }
}
