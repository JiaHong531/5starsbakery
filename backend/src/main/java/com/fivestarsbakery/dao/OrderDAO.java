package com.fivestarsbakery.dao;

import com.fivestarsbakery.model.Order;
import com.fivestarsbakery.model.OrderItem;
import com.fivestarsbakery.util.DBConnection;

import java.sql.*;
import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.math.BigDecimal;

public class OrderDAO {
    
    // Auto-migrate database to include payment_method column
    static {
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            try (ResultSet rs = conn.getMetaData().getColumns(null, null, "orders", "payment_method")) {
                if (!rs.next()) {
                    stmt.execute("ALTER TABLE orders ADD COLUMN payment_method VARCHAR(20) DEFAULT 'CASH'");
                    System.out.println("Database Migrated: Added 'payment_method' column to 'orders' table.");
                }
            }
            // Add order_id to feedback table and UNIQUE constraint
            try (ResultSet rs = conn.getMetaData().getColumns(null, null, "feedback", "order_id")) {
                if (!rs.next()) {
                    stmt.execute("ALTER TABLE feedback ADD COLUMN order_id INT, ADD FOREIGN KEY (order_id) REFERENCES orders(order_id)");
                    stmt.execute("ALTER TABLE feedback ADD UNIQUE KEY unique_order_review (user_id, order_id, product_id)");
                    System.out.println("Database Migrated: Added 'order_id' and UNIQUE constraint to 'feedback' table.");
                }
            }
        } catch (Exception e) {
            System.err.println("Auto-migration failed: " + e.getMessage());
        }
    }

    
    // Helper method to parse pickup date and time to Timestamp
    private Timestamp parsePickupDateTime(String pickupDate, String pickupTime) {
        if (pickupDate == null || pickupTime == null || pickupDate.isEmpty() || pickupTime.isEmpty()) {
            return new Timestamp(System.currentTimeMillis()); 
        }
        try {
            
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm a");
            java.util.Date date = sdf.parse(pickupDate + " " + pickupTime);
            return new Timestamp(date.getTime());
        } catch (ParseException e) {
            e.printStackTrace();
            return new Timestamp(System.currentTimeMillis()); 
        }
    }

    
    private String formatPickupDate(Timestamp ts) {
        if (ts == null) return null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(ts);
    }

    
    private String formatPickupTime(Timestamp ts) {
        if (ts == null) return null;
        SimpleDateFormat sdf = new SimpleDateFormat("hh:mm a");
        return sdf.format(ts);
    }

    public boolean createOrder(Order order) {
        String insertOrderSql = "INSERT INTO orders (user_id, total_amount, status, pickup_time, payment_method) VALUES (?, ?, 'PENDING', ?, ?)";
        String insertItemSql = "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)";

        Connection conn = null;
        PreparedStatement psOrder = null;
        PreparedStatement psItem = null;

        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); 

            
            // 1. Insert Order
            psOrder = conn.prepareStatement(insertOrderSql, Statement.RETURN_GENERATED_KEYS);
            psOrder.setInt(1, order.getUserId());
            psOrder.setBigDecimal(2, order.getTotalAmount());
            
            // Parse pickup date and time into a Timestamp
            Timestamp pickupTimestamp = parsePickupDateTime(order.getPickupDate(), order.getPickupTime());
            psOrder.setTimestamp(3, pickupTimestamp);
            psOrder.setString(4, order.getPaymentMethod());

            int rows = psOrder.executeUpdate();
            if (rows == 0) {
                throw new SQLException("Creating order failed, no rows affected.");
            }

            
            // 2. Get Generated Order ID
            int orderId = 0;
            try (ResultSet generatedKeys = psOrder.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    orderId = generatedKeys.getInt(1);
                } else {
                    throw new SQLException("Creating order failed, no ID obtained.");
                }
            }

            
            // 3. Insert Order Items
            psItem = conn.prepareStatement(insertItemSql);
            for (OrderItem item : order.getItems()) {
                psItem.setInt(1, orderId);
                psItem.setInt(2, item.getProductId());
                psItem.setInt(3, item.getQuantity());
                psItem.setBigDecimal(4, item.getPrice());
                psItem.addBatch();
            }
            psItem.executeBatch();

            
            // 4. Deduct Stock for each item
            ProductDAO productDAO = new ProductDAO();
            for (OrderItem item : order.getItems()) {
                productDAO.deductStock(conn, item.getProductId(), item.getQuantity());
            }

            conn.commit(); 
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            return false;
        } finally {
            try {
                if (psOrder != null)
                    psOrder.close();
                if (psItem != null)
                    psItem.close();
                if (conn != null)
                    conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public java.util.List<Order> getOrdersByUserId(int userId) {
        java.util.List<Order> orders = new java.util.ArrayList<>();
        String sql = "SELECT o.order_id, o.user_id, o.total_amount, o.status, o.pickup_time, o.created_at, o.payment_method, " +
                "oi.item_id, oi.product_id, oi.quantity, oi.price_at_purchase, " +
                "p.name as product_name, p.image_url, " +
                "f.rating, f.comment as review_comment " +
                "FROM orders o " +
                "JOIN order_items oi ON o.order_id = oi.order_id " +
                "JOIN products p ON oi.product_id = p.product_id " +
                "LEFT JOIN feedback f ON o.order_id = f.order_id AND oi.product_id = f.product_id " +
                "WHERE o.user_id = ? " +
                "ORDER BY o.created_at DESC";

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            rs = ps.executeQuery();

            java.util.Map<Integer, Order> orderMap = new java.util.LinkedHashMap<>();

            while (rs.next()) {
                int orderId = rs.getInt("order_id");
                Order order = orderMap.get(orderId);

                if (order == null) {
                    order = new Order();
                    order.setOrderId(orderId);
                    order.setUserId(rs.getInt("user_id"));
                    order.setTotalAmount(rs.getBigDecimal("total_amount"));
                    order.setStatus(rs.getString("status"));
                    Timestamp pickupTs = rs.getTimestamp("pickup_time");
                    order.setPickupDate(formatPickupDate(pickupTs));
                    order.setPickupTime(formatPickupTime(pickupTs));
                    order.setCreatedAt(rs.getTimestamp("created_at"));
                    order.setPaymentMethod(rs.getString("payment_method"));
                    order.setItems(new java.util.ArrayList<>());
                    orders.add(order);
                    orderMap.put(orderId, order);
                }

                OrderItem item = new OrderItem();
                item.setItemId(rs.getInt("item_id"));
                item.setOrderId(orderId);
                item.setProductId(rs.getInt("product_id"));
                item.setQuantity(rs.getInt("quantity"));
                item.setPrice(rs.getBigDecimal("price_at_purchase"));
                item.setProductName(rs.getString("product_name")); 
                item.setImageUrl(rs.getString("image_url")); 
                
                int rating = rs.getInt("rating");
                if (!rs.wasNull()) {
                    item.setRating(rating);
                    item.setComment(rs.getString("review_comment"));
                }
                order.getItems().add(item);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null)
                    rs.close();
                if (ps != null)
                    ps.close();
                if (conn != null)
                    conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return orders;
    }

    

    public java.util.List<Order> getAllOrders() {
        java.util.List<Order> orders = new java.util.ArrayList<>();
        String sql = "SELECT o.order_id, o.user_id, o.total_amount, o.status, o.pickup_time, o.created_at, o.payment_method, " +
                "u.username, " +
                "oi.item_id, oi.product_id, oi.quantity, oi.price_at_purchase, " +
                "p.name as product_name, p.image_url, " +
                "f.rating, f.comment as review_comment " +
                "FROM orders o " +
                "JOIN users u ON o.user_id = u.user_id " +
                "JOIN order_items oi ON o.order_id = oi.order_id " +
                "JOIN products p ON oi.product_id = p.product_id " +
                "LEFT JOIN feedback f ON o.order_id = f.order_id AND oi.product_id = f.product_id " +
                "ORDER BY o.created_at DESC";

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();

            java.util.Map<Integer, Order> orderMap = new java.util.LinkedHashMap<>();

            while (rs.next()) {
                int orderId = rs.getInt("order_id");
                Order order = orderMap.get(orderId);

                if (order == null) {
                    order = new Order();
                    order.setOrderId(orderId);
                    order.setUserId(rs.getInt("user_id"));
                    order.setTotalAmount(rs.getBigDecimal("total_amount"));
                    order.setStatus(rs.getString("status"));
                    Timestamp pickupTs2 = rs.getTimestamp("pickup_time");
                    order.setPickupDate(formatPickupDate(pickupTs2));
                    order.setPickupTime(formatPickupTime(pickupTs2));
                    order.setCreatedAt(rs.getTimestamp("created_at"));
                    order.setPaymentMethod(rs.getString("payment_method"));
                    order.setUsername(rs.getString("username"));

                    order.setItems(new java.util.ArrayList<>());
                    orders.add(order);
                    orderMap.put(orderId, order);
                }

                OrderItem item = new OrderItem();
                item.setItemId(rs.getInt("item_id"));
                item.setOrderId(orderId);
                item.setProductId(rs.getInt("product_id"));
                item.setQuantity(rs.getInt("quantity"));
                item.setPrice(rs.getBigDecimal("price_at_purchase"));
                item.setProductName(rs.getString("product_name"));
                item.setImageUrl(rs.getString("image_url"));

                int ratingAll = rs.getInt("rating");
                if (!rs.wasNull()) {
                    item.setRating(ratingAll);
                    item.setComment(rs.getString("review_comment"));
                }
                order.getItems().add(item);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null)
                    rs.close();
                if (ps != null)
                    ps.close();
                if (conn != null)
                    conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return orders;
    }

    public boolean updateOrderStatus(int orderId, String newStatus) {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            
            if ("CANCELLED".equalsIgnoreCase(newStatus)) {
                
                String getItemsSql = "SELECT product_id, quantity FROM order_items WHERE order_id = ?";
                try (PreparedStatement psItems = conn.prepareStatement(getItemsSql)) {
                    psItems.setInt(1, orderId);
                    try (ResultSet rs = psItems.executeQuery()) {
                        ProductDAO productDAO = new ProductDAO();
                        while (rs.next()) {
                            int productId = rs.getInt("product_id");
                            int quantity = rs.getInt("quantity");
                            productDAO.restoreStock(conn, productId, quantity);
                        }
                    }
                }
            }

            
            String sql = "UPDATE orders SET status = ? WHERE order_id = ?";
            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setString(1, newStatus);
                ps.setInt(2, orderId);
                int rows = ps.executeUpdate();
                if (rows == 0) {
                    throw new SQLException("Order not found: " + orderId);
                }
            }

            conn.commit();
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            }
            return false;
        } finally {
            if (conn != null) {
                try { conn.close(); } catch (SQLException e) { e.printStackTrace(); }
            }
        }
    }
}
