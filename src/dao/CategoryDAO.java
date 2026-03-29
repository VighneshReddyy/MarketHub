package dao;

import db.DBConnection;
import models.Category;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CategoryDAO {

    public boolean addCategory(Category category) {
        String sql = "INSERT INTO Categories (name, parent_id, path) VALUES (?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, category.getName());
            if (category.getParentId() != null) {
                stmt.setInt(2, category.getParentId());
            } else {
                stmt.setNull(2, Types.INTEGER);
            }
            stmt.setString(3, category.getPath());
            
            int affectedRows = stmt.executeUpdate();
            if (affectedRows > 0) {
               try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                   if (generatedKeys.next()) {
                       int newId = generatedKeys.getInt(1);
                       category.setCategoryId(newId);
                       // Basic path generation logic if not provided correctly (assuming 1 level depth for simple use case or path is provided)
                       if(category.getPath() == null || category.getPath().isEmpty()){
                           String newPath = category.getParentId() != null ? category.getParentId() + "/" + newId : String.valueOf(newId);
                           updatePath(newId, newPath);
                       }
                   }
               }
               return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
    
    private void updatePath(int categoryId, String path) {
         String sql = "UPDATE Categories SET path = ? WHERE category_id = ?";
         try (Connection conn = DBConnection.getConnection();
              PreparedStatement stmt = conn.prepareStatement(sql)) {
             stmt.setString(1, path);
             stmt.setInt(2, categoryId);
             stmt.executeUpdate();
         } catch (SQLException e) {
             e.printStackTrace();
         }
    }

    public List<Category> getAllCategories() {
        List<Category> categories = new ArrayList<>();
        String sql = "SELECT * FROM Categories";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Integer parentId = rs.getInt("parent_id");
                if (rs.wasNull()) parentId = null;
                
                categories.add(new Category(
                    rs.getInt("category_id"),
                    rs.getString("name"),
                    parentId,
                    rs.getString("path")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return categories;
    }
}
