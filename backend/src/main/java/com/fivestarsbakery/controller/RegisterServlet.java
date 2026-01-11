package com.fivestarsbakery.controller;

import com.fivestarsbakery.dao.UserDAO;
import com.fivestarsbakery.model.User;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/api/register")
public class RegisterServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();
    private Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");

        try {
            
            User newUser = gson.fromJson(req.getReader(), User.class);

            
            boolean isRegistered = userDAO.register(newUser);

            if (isRegistered) {
                resp.getWriter().write("{\"message\": \"Success\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST); 
                resp.getWriter().write("{\"message\": \"Registration failed. Username or Email already exists.\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\": \"Server Error\"}");
        }
    }
}