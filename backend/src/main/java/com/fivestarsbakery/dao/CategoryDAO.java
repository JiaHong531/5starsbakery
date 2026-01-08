package com.fivestarsbakery.dao;

import com.fivestarsbakery.model.Category;
import com.fivestarsbakery.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CategoryDAO {

    public List<Category> getAllCategories() {
        List<Category> categories = new ArrayList<>();
        String sql = "SELECT * FROM categories";

        try (Connection conn = DBConnection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                categories.add(new Category(
                        rs.getInt("category_id"),
                        rs.getString("name"),
                        rs.getString("display_name"),
                        rs.getString("icon_url")));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return categories;
    }

    public boolean addCategory(Category category) {
        String sql = "INSERT INTO categories (name, display_name, icon_url) VALUES (?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, category.getName());
            stmt.setString(2, category.getDisplayName());
            stmt.setString(3, category.getIconUrl());

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
