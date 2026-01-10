package com.fivestarsbakery.controller;

import com.fivestarsbakery.dao.ProductDAO;
import com.fivestarsbakery.model.Product;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.text.Normalizer;

@WebServlet("/api/products/upload")
@MultipartConfig(fileSizeThreshold = 1024 * 1024, // 1MB
        maxFileSize = 1024 * 1024 * 10, // 10MB
        maxRequestSize = 1024 * 1024 * 50 // 50MB
)
public class FileUploadServlet extends HttpServlet {

    /**
     * Sanitizes the product name to create a valid filename.
     * - Removes accents/diacritics
     * - Replaces spaces and special characters with underscores
     * - Converts to lowercase
     */
    private String sanitizeFileName(String productName) {
        if (productName == null || productName.isEmpty()) {
            return "product";
        }
        // Remove accents (e.g., é -> e, ü -> u)
        String normalized = Normalizer.normalize(productName, Normalizer.Form.NFD);
        String withoutAccents = normalized.replaceAll("\\p{M}", "");

        // Replace spaces and special characters with underscores, convert to lowercase
        String sanitized = withoutAccents.replaceAll("[^a-zA-Z0-9]", "_").toLowerCase();

        // Remove multiple consecutive underscores
        sanitized = sanitized.replaceAll("_+", "_");

        // Remove leading/trailing underscores
        sanitized = sanitized.replaceAll("^_|_$", "");

        return sanitized.isEmpty() ? "product" : sanitized;
    }

    /**
     * Extracts the file extension from a filename.
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return ".jpg"; // Default extension
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // 1. Setup upload directory - use the Docker volume path
            String uploadPath = "/opt/product-images";
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists())
                uploadDir.mkdirs();

            // 2. Get product name and create sanitized filename
            String name = request.getParameter("name");
            Part filePart = request.getPart("image");

            String sanitizedName = sanitizeFileName(name);
            String extension = getFileExtension(filePart.getSubmittedFileName());
            String fileName = sanitizedName + "_" + System.currentTimeMillis() + extension;

            // 3. Save the file with the new name
            filePart.write(uploadPath + File.separator + fileName);

            // 4. Extract remaining data
            String desc = request.getParameter("description");
            String ingredients = request.getParameter("ingredients");
            String category = request.getParameter("category");
            double price = Double.parseDouble(request.getParameter("price"));
            int stock = Integer.parseInt(request.getParameter("stock"));

            String finalImageUrl = "/product-images/" + fileName;

            // 5. Save to DB
            ProductDAO dao = new ProductDAO();
            Product p = new Product(0, name, desc, ingredients, price, stock, category, finalImageUrl);
            boolean success = dao.addProduct(p);

            // 6. Return response
            response.getWriter().write("{\"success\": " + success + ", \"imageUrl\": \"" + finalImageUrl
                    + "\", \"fileName\": \"" + fileName + "\"}");

        } catch (Exception e) {
            response.setStatus(500);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}