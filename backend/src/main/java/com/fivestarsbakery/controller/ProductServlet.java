package com.fivestarsbakery.controller;

import com.fivestarsbakery.dao.ProductDAO;
import com.fivestarsbakery.model.Product;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/products")
public class ProductServlet extends HttpServlet {

    private ProductDAO productDAO = new ProductDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // 1. Get data from Database
        List<Product> productList = productDAO.getAllProducts();

        // 2. Convert to JSON
        String jsonString = gson.toJson(productList);

        // 3. Send Response
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonString);
    }
}