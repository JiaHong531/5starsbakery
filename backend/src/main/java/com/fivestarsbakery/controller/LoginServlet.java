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
            // 1. Read JSON from React
            User loginRequest = gson.fromJson(req.getReader(), User.class);

            // 2. Check Database (Username OR Email)
            User foundUser = userDAO.login(loginRequest.getUsername(), loginRequest.getPassword());

            if (foundUser != null) {
                // Success: Send user data back
                String jsonResponse = gson.toJson(foundUser);
                out.write(jsonResponse);
            } else {
                // Failure: Send 401 Unauthorized
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