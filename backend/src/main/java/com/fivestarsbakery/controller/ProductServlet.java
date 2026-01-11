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

@WebServlet("/api/products/*")
public class ProductServlet extends HttpServlet {

    private ProductDAO productDAO = new ProductDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        if (pathInfo == null || pathInfo.equals("/")) {
            
            List<Product> productList = productDAO.getAllProducts();
            String jsonString = gson.toJson(productList);
            response.getWriter().write(jsonString);
        } else {
            
            try {
                String idStr = pathInfo.substring(1); 
                int id = Integer.parseInt(idStr);

                Product product = productDAO.getProductById(id);

                if (product != null) {
                    String jsonString = gson.toJson(product);
                    response.getWriter().write(jsonString);
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    response.getWriter().write("{\"message\": \"Product not found\"}");
                }
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"message\": \"Invalid product ID\"}");
            }
        }
    }

    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setAccessControlHeaders(resp);
        Product newProduct = gson.fromJson(req.getReader(), Product.class);
        if (productDAO.addProduct(newProduct)) {
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write("{\"message\": \"Product created\"}");
        } else {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to create product");
        }
    }

    
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setAccessControlHeaders(resp);
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing Product ID");
            return;
        }

        try {
            int id = Integer.parseInt(pathInfo.substring(1));
            Product product = gson.fromJson(req.getReader(), Product.class);
            
            
            
            
            
            
            
            
            
            
            
            

            
            Product updateRequest = new Product(
                    id,
                    product.getName(),
                    product.getDescription(),
                    product.getIngredients(),
                    product.getPrice(),
                    product.getStock(),
                    product.getCategory(),
                    product.getImageUrl());

            if (productDAO.updateProduct(updateRequest)) {
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("{\"message\": \"Product updated\"}");
            } else {
                resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to update product");
            }
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid ID");
        }
    }

    
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setAccessControlHeaders(resp);
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing Product ID");
            return;
        }

        try {
            int id = Integer.parseInt(pathInfo.substring(1));
            if (productDAO.deleteProduct(id)) {
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("{\"message\": \"Product deleted\"}");
            } else {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Product not found or failed to delete");
            }
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid ID");
        }
    }

    
    private void setAccessControlHeaders(HttpServletResponse resp) {
        
        
        
        
        
        
        
    }
}