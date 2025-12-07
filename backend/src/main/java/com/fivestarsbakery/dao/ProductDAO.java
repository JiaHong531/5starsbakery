package com.fivestarsbakery.dao;

import com.fivestarsbakery.model.Product;
import com.fivestarsbakery.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class ProductDAO {

    public List<Product> getAllProducts() {
        List<Product> products = new ArrayList<>();
        String sql = "SELECT * FROM products";

        // Try-with-resources (Automatically closes connection)
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                // Map the DB Row to a Java Object
                Product p = new Product(
                        rs.getInt("product_id"),
                        rs.getString("name"),
                        rs.getString("description"),
                        rs.getString("ingredients"),
                        rs.getDouble("price"),
                        rs.getInt("stock_quantity"),
                        rs.getString("category"),
                        rs.getString("image_url")
                );
                products.add(p);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return products;
    }
}