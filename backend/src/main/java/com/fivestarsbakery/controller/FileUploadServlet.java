package com.fivestarsbakery.controller;

import com.fivestarsbakery.dao.ProductDAO;
import com.fivestarsbakery.model.Product;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.File;
import java.io.IOException;

@WebServlet("/api/products/upload")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024, // 1MB
        maxFileSize = 1024 * 1024 * 10,  // 10MB
        maxRequestSize = 1024 * 1024 * 50 // 50MB
)
public class FileUploadServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // 1. Save File
            String uploadPath = getServletContext().getRealPath("") + File.separator + "images";
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdir();

            Part filePart = request.getPart("image");
            String fileName = filePart.getSubmittedFileName();
            filePart.write(uploadPath + File.separator + fileName);

            // 2. Extract data and save to DB
            String name = request.getParameter("name");
            String desc = request.getParameter("description");
            String ingredients = request.getParameter("ingredients");
            String category = request.getParameter("category");

            double price = Double.parseDouble(request.getParameter("price"));
            int stock = Integer.parseInt(request.getParameter("stock"));

            String finalImageUrl = "/images/" + fileName;

            // 3. Save to DB
            ProductDAO dao = new ProductDAO();
            Product p = new Product(0, name, desc, ingredients, price, stock, category, finalImageUrl);
            boolean success = dao.addProduct(p);

            // 4. Clean Response
            response.getWriter().write("{\"success\": " + success + ", \"imageUrl\": \"" + finalImageUrl + "\"}");

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}