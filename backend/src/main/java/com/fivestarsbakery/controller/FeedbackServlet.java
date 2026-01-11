package com.fivestarsbakery.controller;

import com.fivestarsbakery.dao.FeedbackDAO;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/feedback/*")
public class FeedbackServlet extends HttpServlet {

    private FeedbackDAO feedbackDAO = new FeedbackDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        String pathInfo = req.getPathInfo();
        
        // Expecting: /api/feedback/{productId}
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"message\": \"Product ID required\"}");
            return;
        }

        try {
            int productId = Integer.parseInt(pathInfo.substring(1));
            
            // Get reviews for this product
            List<Map<String, Object>> reviews = feedbackDAO.getReviewsByProductId(productId);
            double averageRating = feedbackDAO.getAverageRating(productId);
            int reviewCount = feedbackDAO.getReviewCount(productId);

            // Build response object
            Map<String, Object> response = new HashMap<>();
            response.put("reviews", reviews);
            response.put("averageRating", Math.round(averageRating * 10.0) / 10.0); // Round to 1 decimal
            response.put("reviewCount", reviewCount);

            out.write(gson.toJson(response));

        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"message\": \"Invalid Product ID\"}");
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"message\": \"Server Error\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        try {
            // Parse request body
            Map<String, Object> body = gson.fromJson(req.getReader(), Map.class);
            
            int userId = ((Double) body.get("userId")).intValue();
            int productId = ((Double) body.get("productId")).intValue();
            int rating = ((Double) body.get("rating")).intValue();
            String comment = (String) body.get("comment");

            boolean success = feedbackDAO.addReview(userId, productId, rating, comment);

            if (success) {
                out.write("{\"message\": \"Review submitted successfully\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.write("{\"message\": \"Failed to submit review\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"message\": \"Invalid request: " + e.getMessage() + "\"}");
        }
    }
}
