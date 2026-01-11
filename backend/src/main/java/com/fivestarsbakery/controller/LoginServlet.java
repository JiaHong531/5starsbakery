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

/**
 * Handles user authentication/login.
 * - POST /api/login (Validates credentials and returns user details)
 */
@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();
    private Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        try {
            
            // 1. Parse JSON body
            User loginRequest = gson.fromJson(req.getReader(), User.class);

            // 2. Validate credentials against DB
            User foundUser = userDAO.login(loginRequest.getUsername(), loginRequest.getPassword());

            if (foundUser != null) {
                
                String jsonResponse = gson.toJson(foundUser);
                out.write(jsonResponse);
            } else {
                
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                out.write("{\"message\": \"Invalid email/username or password\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"message\": \"Server Error\"}");
        }
    }
}