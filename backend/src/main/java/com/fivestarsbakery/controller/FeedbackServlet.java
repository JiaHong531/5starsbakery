package com.fivestarsbakery.controller;

import com.fivestarsbakery.dao.FeedbackDAO;
import com.fivestarsbakery.dao.FeedbackDAO.ProductRating;
import com.fivestarsbakery.dao.FeedbackDAO.Review;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

@WebServlet("/api/feedback/*")
public class FeedbackServlet extends HttpServlet {

    private FeedbackDAO feedbackDAO = new FeedbackDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        String pathInfo = req.getPathInfo();

        try {
            
            if (pathInfo == null || pathInfo.equals("/") || pathInfo.equals("/ratings")) {
                Map<Integer, ProductRating> allRatings = feedbackDAO.getAllProductRatings();
                
                
                JsonObject result = new JsonObject();
                for (Map.Entry<Integer, ProductRating> entry : allRatings.entrySet()) {
                    JsonObject ratingObj = new JsonObject();
                    ratingObj.addProperty("avgRating", Math.round(entry.getValue().avgRating * 10.0) / 10.0);
                    ratingObj.addProperty("count", entry.getValue().count);
                    result.add(String.valueOf(entry.getKey()), ratingObj);
                }
                out.print(gson.toJson(result));
            }
            
            else if (pathInfo.startsWith("/ratings/")) {
                String productIdStr = pathInfo.substring("/ratings/".length());
                int productId = Integer.parseInt(productIdStr);
                
                double avgRating = feedbackDAO.getAverageRating(productId);
                int count = feedbackDAO.getReviewCount(productId);
                
                JsonObject result = new JsonObject();
                result.addProperty("productId", productId);
                result.addProperty("avgRating", Math.round(avgRating * 10.0) / 10.0);
                result.addProperty("count", count);
                out.print(gson.toJson(result));
            }
            
            else if (pathInfo.startsWith("/reviews/")) {
                String productIdStr = pathInfo.substring("/reviews/".length());
                int productId = Integer.parseInt(productIdStr);
                
                List<Review> reviews = feedbackDAO.getProductReviews(productId);
                out.print(gson.toJson(reviews));
            }
            else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print("{\"error\": \"Endpoint not found\"}");
            }
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"error\": \"Invalid product ID\"}");
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Server error\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        try {
            
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = req.getReader().readLine()) != null) {
                sb.append(line);
            }
            
            JsonObject json = gson.fromJson(sb.toString(), JsonObject.class);
            
            int userId = json.get("userId").getAsInt();
            int productId = json.get("productId").getAsInt();
            int orderId = json.has("orderId") ? json.get("orderId").getAsInt() : 0;
            int rating = json.get("rating").getAsInt();
            String comment = json.has("comment") ? json.get("comment").getAsString() : "";

            boolean success = feedbackDAO.addFeedback(userId, productId, orderId, rating, comment);

            JsonObject result = new JsonObject();
            if (success) {
                result.addProperty("success", true);
                result.addProperty("message", "Review saved successfully");
            } else {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                result.addProperty("success", false);
                result.addProperty("error", "Failed to save review");
            }
            out.print(gson.toJson(result));

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"error\": \"Invalid request data\"}");
        }
    }
}
