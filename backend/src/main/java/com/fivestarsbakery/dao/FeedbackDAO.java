package com.fivestarsbakery.dao;

import com.fivestarsbakery.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

public class FeedbackDAO {

    
    public double getAverageRating(int productId) {
        String sql = "SELECT AVG(rating) as avg_rating FROM feedback WHERE product_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, productId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getDouble("avg_rating");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0.0;
    }

    
    public int getReviewCount(int productId) {
        String sql = "SELECT COUNT(*) as review_count FROM feedback WHERE product_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, productId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("review_count");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    
    public Map<Integer, ProductRating> getAllProductRatings() {
        Map<Integer, ProductRating> ratings = new HashMap<>();
        String sql = "SELECT product_id, AVG(rating) as avg_rating, COUNT(*) as review_count " +
                     "FROM feedback GROUP BY product_id";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                int productId = rs.getInt("product_id");
                double avgRating = rs.getDouble("avg_rating");
                int count = rs.getInt("review_count");
                ratings.put(productId, new ProductRating(avgRating, count));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ratings;
    }

    
    public static class ProductRating {
        public double avgRating;
        public int count;

        public ProductRating(double avgRating, int count) {
            this.avgRating = avgRating;
            this.count = count;
        }
    }

    
    public boolean addFeedback(int userId, int productId, int orderId, int rating, String comment) {
        String sql = "INSERT INTO feedback (user_id, product_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, productId);
            stmt.setInt(3, orderId);
            stmt.setInt(4, rating);
            stmt.setString(5, comment);
            return stmt.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    
    public java.util.List<Review> getProductReviews(int productId) {
        java.util.List<Review> reviews = new java.util.ArrayList<>();
        String sql = "SELECT f.feedback_id, f.user_id, f.rating, f.comment, f.created_at, u.username " +
                     "FROM feedback f " +
                     "JOIN users u ON f.user_id = u.user_id " +
                     "WHERE f.product_id = ? " +
                     "ORDER BY f.created_at DESC";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, productId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Review review = new Review();
                    review.feedbackId = rs.getInt("feedback_id");
                    review.userId = rs.getInt("user_id");
                    review.username = rs.getString("username");
                    review.rating = rs.getInt("rating");
                    review.comment = rs.getString("comment");
                    review.createdAt = rs.getTimestamp("created_at");
                    reviews.add(review);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return reviews;
    }

    
    public static class Review {
        public int feedbackId;
        public int userId;
        public String username;
        public int rating;
        public String comment;
        public java.sql.Timestamp createdAt;
    }
}
