package services;

import dao.ItemDAO;
import models.Item;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.List;
import dao.ItemMediaDAO;
import models.ItemMedia;

public class ItemService {
    private final ItemDAO itemDAO = new ItemDAO();
    private final ItemMediaDAO itemMediaDAO = new ItemMediaDAO();

    public int addItem(Item item, File imageFile) {
        int itemId = itemDAO.addItem(item);
        if (itemId > 0 && imageFile != null) {
            try {
                // Ensure uploads directory exists
                File uploadDir = new File("uploads");
                if (!uploadDir.exists()) uploadDir.mkdir();

                // Generate a unique filename
                String fileName = System.currentTimeMillis() + "_" + imageFile.getName();
                File destFile = new File(uploadDir, fileName);
                
                // Copy the file
                Files.copy(imageFile.toPath(), destFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                
                // Save to ItemMedia
                ItemMedia media = new ItemMedia(itemId, "uploads/" + fileName, "image");
                itemMediaDAO.addMedia(media);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return itemId;
    }

    public boolean updateItem(Item item, File imageFile) {
        boolean updated = itemDAO.updateItem(item);
        if (updated && imageFile != null) {
            try {
                // Delete old media
                itemMediaDAO.deleteMediaByItemId(item.getItemId());
                
                File uploadDir = new File("uploads");
                if (!uploadDir.exists()) uploadDir.mkdir();

                String fileName = System.currentTimeMillis() + "_" + imageFile.getName();
                File destFile = new File(uploadDir, fileName);
                Files.copy(imageFile.toPath(), destFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                
                ItemMedia media = new ItemMedia(item.getItemId(), "uploads/" + fileName, "image");
                itemMediaDAO.addMedia(media);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return updated;
    }

    public boolean deleteItem(int itemId) {
        // Also delete associated media (using DB cascade or doing it manually)
        itemMediaDAO.deleteMediaByItemId(itemId);
        // We assume Orders will be handled either by cascade or manually
        return itemDAO.deleteItem(itemId);
    }

    public Item getItemById(int itemId) {
        return itemDAO.getItemById(itemId);
    }

    public List<Item> getAllItems(int excludeUserId) {
        return itemDAO.getAllItemsExcludeUser(excludeUserId);
    }

    public List<Item> filterItems(int categoryId, BigDecimal minPrice, BigDecimal maxPrice, String condition, int excludeUserId) {
        return itemDAO.filterItems(categoryId, minPrice, maxPrice, condition, excludeUserId);
    }
}
