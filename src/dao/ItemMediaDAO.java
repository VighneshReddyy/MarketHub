package dao;

import db.DBConnection;
import models.ItemMedia;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ItemMediaDAO {
    public boolean addMedia(ItemMedia media) {
        String sql = "INSERT INTO ItemMedia (item_id, file_path, media_type) VALUES (?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, media.getItemId());
            stmt.setString(2, media.getMediaUrl());
            stmt.setString(3, media.getMediaType());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<ItemMedia> getMediaByItemId(int itemId) {
        List<ItemMedia> mediaList = new ArrayList<>();
        String sql = "SELECT * FROM ItemMedia WHERE item_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, itemId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    mediaList.add(new ItemMedia(
                        rs.getInt("media_id"),
                        rs.getInt("item_id"),
                        rs.getString("file_path"),
                        rs.getString("media_type")
                    ));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return mediaList;
    }

    public boolean deleteMediaByItemId(int itemId) {
        String sql = "DELETE FROM ItemMedia WHERE item_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, itemId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
