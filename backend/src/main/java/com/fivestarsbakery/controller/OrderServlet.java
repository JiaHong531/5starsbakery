package com.fivestarsbakery.controller;

import com.fivestarsbakery.dao.OrderDAO;
import com.fivestarsbakery.model.Order;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Handles Order-related API endpoints.
 * Supports:
 * - GET /api/orders?userId=X (Get order history)
 * - GET /api/orders?all=true (Get all orders for admin)
 * - POST /api/orders (Create new order)
 * - PUT /api/orders/:id (Update order status)
 */
@WebServlet("/api/orders/*")
public class OrderServlet extends HttpServlet {

    private OrderDAO orderDAO = new OrderDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        // Check if admin is requesting all orders

        
        String allParam = req.getParameter("all");
        if ("true".equalsIgnoreCase(allParam)) {
            java.util.List<Order> orders = orderDAO.getAllOrders();
            String json = gson.toJson(orders);
            out.write(json);
            return;
        }

        String userIdParam = req.getParameter("userId");
        if (userIdParam == null || userIdParam.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"message\": \"Missing userId parameter\"}");
            return;
        }

        try {
            int userId = Integer.parseInt(userIdParam);
            java.util.List<Order> orders = orderDAO.getOrdersByUserId(userId);
            String json = gson.toJson(orders);
            out.write(json);
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"message\": \"Invalid userId parameter\"}");
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"message\": \"Server Error\"}");
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"message\": \"Missing Order ID\"}");
            return;
        }

        try {
            int orderId = Integer.parseInt(pathInfo.substring(1));
            
            Order statusUpdate = gson.fromJson(req.getReader(), Order.class);
            if (statusUpdate == null || statusUpdate.getStatus() == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.write("{\"message\": \"Missing status in body\"}");
                return;
            }

            boolean success = orderDAO.updateOrderStatus(orderId, statusUpdate.getStatus());

            if (success) {
                out.write("{\"message\": \"Order status updated\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.write("{\"message\": \"Failed to update status\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"message\": \"Invalid Order ID\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        try {
            
            Order newOrder = gson.fromJson(req.getReader(), Order.class);

            
            if (newOrder.getItems() == null || newOrder.getItems().isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.write("{\"message\": \"Order items are required\"}");
                return;
            }

            
            boolean success = orderDAO.createOrder(newOrder);

            if (success) {
                out.write("{\"message\": \"Order placed successfully\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.write("{\"message\": \"Failed to save order\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"message\": \"Server Error: " + e.getMessage() + "\"}");
        }
    }
}
