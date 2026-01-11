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

        
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                
                Product p = new Product(
                        rs.getInt("product_id"),
                        rs.getString("name"),
                        rs.getString("description"),
                        rs.getString("ingredients"),
                        rs.getDouble("price"),
                        rs.getInt("stock_quantity"),
                        rs.getString("category"),
                        rs.getString("image_url"));
                products.add(p);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return products;
    }

    public Product getProductById(int id) {
        Product product = null;
        String sql = "SELECT * FROM products WHERE product_id = ?";

        try (Connection conn = DBConnection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    product = new Product(
                            rs.getInt("product_id"),
                            rs.getString("name"),
                            rs.getString("description"),
                            rs.getString("ingredients"),
                            rs.getDouble("price"),
                            rs.getInt("stock_quantity"),
                            rs.getString("category"),
                            rs.getString("image_url"));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return product;
    }

    
    public boolean addProduct(Product product) {
        String sql = "INSERT INTO products (name, description, ingredients, price, stock_quantity, category, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, product.getName());
            ps.setString(2, product.getDescription());
            ps.setString(3, product.getIngredients());
            ps.setDouble(4, product.getPrice());
            ps.setInt(5, product.getStock());
            ps.setString(6, product.getCategory());
            ps.setString(7, product.getImageUrl());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    
    public boolean updateProduct(Product product) {
        String sql = "UPDATE products SET name=?, description=?, ingredients=?, price=?, stock_quantity=?, category=?, image_url=? WHERE product_id=?";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, product.getName());
            ps.setString(2, product.getDescription());
            ps.setString(3, product.getIngredients());
            ps.setDouble(4, product.getPrice());
            ps.setInt(5, product.getStock());
            ps.setString(6, product.getCategory());
            ps.setString(7, product.getImageUrl());
            ps.setInt(8, product.getId());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    
    public boolean deleteProduct(int id) {
        String sql = "DELETE FROM products WHERE product_id=?";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    
    public boolean deductStock(Connection conn, int productId, int quantity) throws Exception {
        String sql = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ? AND stock_quantity >= ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, quantity);
            ps.setInt(2, productId);
            ps.setInt(3, quantity); 
            int rows = ps.executeUpdate();
            if (rows == 0) {
                throw new Exception("Insufficient stock for product ID: " + productId);
            }
            return true;
        }
    }

    
    public boolean restoreStock(Connection conn, int productId, int quantity) throws Exception {
        String sql = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, quantity);
            ps.setInt(2, productId);
            return ps.executeUpdate() > 0;
        }
    }
    
    public boolean isCategoryUsed(String category) {
        String sql = "SELECT 1 FROM products WHERE category = ? LIMIT 1";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, category);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next(); 
            }
        } catch (Exception e) {
            e.printStackTrace();
            return true; 
        }
    }
}