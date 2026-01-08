package com.fivestarsbakery.controller;

import com.fivestarsbakery.dao.CategoryDAO;
import com.fivestarsbakery.model.Category;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.text.Normalizer;
import java.util.List;

@WebServlet("/api/categories/*")
@MultipartConfig(fileSizeThreshold = 1024 * 1024, // 1MB
        maxFileSize = 1024 * 1024 * 5, // 5MB
        maxRequestSize = 1024 * 1024 * 20 // 20MB
)
public class CategoryServlet extends HttpServlet {

    private CategoryDAO categoryDAO = new CategoryDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        setAccessControlHeaders(resp);

        List<Category> categories = categoryDAO.getAllCategories();
        String json = gson.toJson(categories);
        resp.getWriter().write(json);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        setAccessControlHeaders(resp);

        String pathInfo = req.getPathInfo();
        if ("/upload".equals(pathInfo)) {
            handleUpload(req, resp);
        } else {
            resp.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        }
    }

    private void handleUpload(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        try {
            // 1. Setup upload directory - use the Docker volume path
            String uploadPath = "/opt/category-icons";
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists())
                uploadDir.mkdirs();

            // 2. Get data
            String name = request.getParameter("name");
            String displayName = request.getParameter("displayName");
            Part filePart = request.getPart("icon");

            // 3. Create filename
            String sanitizedName = sanitizeFileName(name);
            String extension = getFileExtension(filePart.getSubmittedFileName());
            String fileName = "category_" + sanitizedName + "_" + System.currentTimeMillis() + extension;

            // 4. Save file
            filePart.write(uploadPath + File.separator + fileName);

            // 5. Save to DB
            String iconUrl = "/category-icons/" + fileName;
            Category newCategory = new Category(0, name, displayName, iconUrl);

            if (categoryDAO.addCategory(newCategory)) {
                response.getWriter().write("{\"success\": true, \"category\": " + gson.toJson(newCategory) + "}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"success\": false, \"message\": \"Database error\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\": false, \"message\": \"" + e.getMessage() + "\"}");
        }
    }

    private String sanitizeFileName(String name) {
        if (name == null || name.isEmpty())
            return "icon";
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
        String withoutAccents = normalized.replaceAll("\\p{M}", "");
        String sanitized = withoutAccents.replaceAll("[^a-zA-Z0-9]", "_").toLowerCase();
        return sanitized.replaceAll("_+", "_").replaceAll("^_|_$", "");
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains("."))
            return ".png";
        return fileName.substring(fileName.lastIndexOf("."));
    }

    private void setAccessControlHeaders(HttpServletResponse resp) {
        // Handled by CorsFilter usually, but keeping for safety if filter missing
    }
}
