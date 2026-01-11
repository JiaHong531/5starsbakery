package com.fivestarsbakery.dao;

import com.fivestarsbakery.util.DBConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FeedbackDAO {

    /**
     * Get all reviews for a specific product, including reviewer's name
     */
    public List<Map<String, Object>> getReviewsByProductId(int productId) {
        List<Map<String, Object>> reviews = new ArrayList<>();
        
        String sql = "SELECT f.feedback_id, f.rating, f.comment, f.created_at, " +
                     "u.first_name, u.last_name " +
                     "FROM feedback f " +
                     "JOIN users u ON f.user_id = u.user_id " +
                     "WHERE f.product_id = ? " +
                     "ORDER BY f.created_at DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, productId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> review = new HashMap<>();
                    review.put("feedbackId", rs.getInt("feedback_id"));
                    review.put("rating", rs.getInt("rating"));
                    review.put("comment", rs.getString("comment"));
                    review.put("createdAt", rs.getTimestamp("created_at"));
                    review.put("reviewerName", rs.getString("first_name") + " " + rs.getString("last_name"));
                    reviews.add(review);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return reviews;
    }

    /**
     * Get average rating for a specific product
     */
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

    /**
     * Get review count for a specific product
     */
    public int getReviewCount(int productId) {
        String sql = "SELECT COUNT(*) as count FROM feedback WHERE product_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, productId);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("count");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    /**
     * Add a new review
     */
    public boolean addReview(int userId, int productId, int rating, String comment) {
        String sql = "INSERT INTO feedback (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);
            stmt.setInt(2, productId);
            stmt.setInt(3, rating);
            stmt.setString(4, comment);

            return stmt.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
