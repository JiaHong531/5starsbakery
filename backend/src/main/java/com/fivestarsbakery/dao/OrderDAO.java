package com.fivestarsbakery.dao;

import com.fivestarsbakery.model.Order;
import com.fivestarsbakery.model.OrderItem;
import com.fivestarsbakery.util.DBConnection;

import java.sql.*;
import java.text.SimpleDateFormat;
import java.text.ParseException;

public class OrderDAO {

    // Helper method to parse pickup date and time to Timestamp
    private Timestamp parsePickupDateTime(String pickupDate, String pickupTime) {
        if (pickupDate == null || pickupTime == null || pickupDate.isEmpty() || pickupTime.isEmpty()) {
            return new Timestamp(System.currentTimeMillis()); // Default to now
        }
        try {
            // Parse "2026-01-11" + "01:00 PM" format
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm a");
            java.util.Date date = sdf.parse(pickupDate + " " + pickupTime);
            return new Timestamp(date.getTime());
        } catch (ParseException e) {
            e.printStackTrace();
            return new Timestamp(System.currentTimeMillis()); // Fallback to now
        }
    }

    // Helper method to format timestamp to date string
    private String formatPickupDate(Timestamp ts) {
        if (ts == null) return null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(ts);
    }

    // Helper method to format timestamp to time string
    private String formatPickupTime(Timestamp ts) {
        if (ts == null) return null;
        SimpleDateFormat sdf = new SimpleDateFormat("hh:mm a");
        return sdf.format(ts);
    }

    public boolean createOrder(Order order) {
        String insertOrderSql = "INSERT INTO orders (user_id, total_amount, status, pickup_time) VALUES (?, ?, 'PENDING', ?)";
        String insertItemSql = "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)";

        Connection conn = null;
        PreparedStatement psOrder = null;
        PreparedStatement psItem = null;

        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Start Transaction

            // 1. Insert Order
            psOrder = conn.prepareStatement(insertOrderSql, Statement.RETURN_GENERATED_KEYS);
            psOrder.setInt(1, order.getUserId());
            psOrder.setBigDecimal(2, order.getTotalAmount());
            // Parse pickup date and time into a Timestamp
            Timestamp pickupTimestamp = parsePickupDateTime(order.getPickupDate(), order.getPickupTime());
            psOrder.setTimestamp(3, pickupTimestamp);

            int rows = psOrder.executeUpdate();
            if (rows == 0) {
                throw new SQLException("Creating order failed, no rows affected.");
            }

            // 2. Get Order ID
            int orderId = 0;
            try (ResultSet generatedKeys = psOrder.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    orderId = generatedKeys.getInt(1);
                } else {
                    throw new SQLException("Creating order failed, no ID obtained.");
                }
            }

            // 3. Insert Items
            psItem = conn.prepareStatement(insertItemSql);
            for (OrderItem item : order.getItems()) {
                psItem.setInt(1, orderId);
                psItem.setInt(2, item.getProductId());
                psItem.setInt(3, item.getQuantity());
                psItem.setBigDecimal(4, item.getPrice());
                psItem.addBatch();
            }
            psItem.executeBatch();

            conn.commit(); // Commit Transaction
            return true;

        } catch (SQLException e) {
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
        String sql = "SELECT o.order_id, o.user_id, o.total_amount, o.status, o.pickup_time, o.created_at, " +
                "oi.item_id, oi.product_id, oi.quantity, oi.price_at_purchase, " +
                "p.name as product_name, p.image_url " +
                "FROM orders o " +
                "JOIN order_items oi ON o.order_id = oi.order_id " +
                "JOIN products p ON oi.product_id = p.product_id " +
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
                item.setProductName(rs.getString("product_name")); // Populated from Join
                item.setImageUrl(rs.getString("image_url")); // Populated from Join

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

    // --- ADMIN METHODS ---

    public java.util.List<Order> getAllOrders() {
        java.util.List<Order> orders = new java.util.ArrayList<>();
        String sql = "SELECT o.order_id, o.user_id, o.total_amount, o.status, o.pickup_time, o.created_at, " +
                "u.username, " +
                "oi.item_id, oi.product_id, oi.quantity, oi.price_at_purchase, " +
                "p.name as product_name, p.image_url " +
                "FROM orders o " +
                "JOIN users u ON o.user_id = u.user_id " +
                "JOIN order_items oi ON o.order_id = oi.order_id " +
                "JOIN products p ON oi.product_id = p.product_id " +
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
        String sql = "UPDATE orders SET status = ? WHERE order_id = ?";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, newStatus);
            ps.setInt(2, orderId);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
