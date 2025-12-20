package com.fivestarsbakery.controller;

import com.fivestarsbakery.dao.UserDAO;
import com.fivestarsbakery.model.User;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/api/update-profile")
public class UpdateProfileServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();
    private Gson gson = new Gson();

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        try {
            // 1. Read JSON from React
            User updateRequest = gson.fromJson(req.getReader(), User.class);

            // 2. Validate input (basic check)
            if (updateRequest.getId() == 0) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.write("{\"message\": \"User ID is missing\"}");
                return;
            }

            // 3. Update Database
            boolean success = userDAO.updateUser(updateRequest);

            if (success) {
                // Success: Return the updated user object (or simply success message)
                // Ideally we should return the full updated user, specifically fetched from DB
                // to be sure.
                // But for simplicity/speed, we can just echo back the request or a success
                // message.
                // NOTE: Frontend needs the fields to update context.
                // The updateRequest has the *new* values. The frontend already has them in
                // 'updatedUser'.
                // So returning success is sufficient, or returning the object.
                // Let's return the object for consistency with Login.

                String jsonResponse = gson.toJson(updateRequest);
                out.write(jsonResponse);
            } else {
                // Failure
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.write("{\"message\": \"Failed to update profile\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"message\": \"Server Error\"}");
        }
    }
}
