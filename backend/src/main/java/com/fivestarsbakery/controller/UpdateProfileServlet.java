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
            
            User updateRequest = gson.fromJson(req.getReader(), User.class);

            
            if (updateRequest.getId() == 0) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.write("{\"message\": \"User ID is missing\"}");
                return;
            }

            
            boolean success = userDAO.updateUser(updateRequest);

            if (success) {
                
                
                
                
                
                
                
                
                
                

                String jsonResponse = gson.toJson(updateRequest);
                out.write(jsonResponse);
            } else {
                
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
