package com.fivestarsbakery.model;

import java.sql.Timestamp;

public class Feedback {
    private int feedbackId;
    private int userId;
    private int productId;
    private int rating;
    private String comment;
    private Timestamp createdAt;

    
    public Feedback(int feedbackId, int userId, int productId, int rating, String comment, Timestamp createdAt) {
        this.feedbackId = feedbackId;
        this.userId = userId;
        this.productId = productId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    
    public int getFeedbackId() { return feedbackId; }
    public int getUserId() { return userId; }
    public int getProductId() { return productId; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public Timestamp getCreatedAt() { return createdAt; }
}
