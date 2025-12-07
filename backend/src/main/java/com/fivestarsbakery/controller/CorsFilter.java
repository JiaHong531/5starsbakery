package com.fivestarsbakery.controller;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

// 1. "@WebFilter" means: Intercept EVERY request coming to the server
@WebFilter("/*")
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;

        // 2. Add the "Permission Slips" (Headers)

        // Allow the React Frontend to access us
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

        // Allow these actions (Get data, Send data, Delete data)
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

        // Allow JSON content
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        // Allow cookies (for Login later)
        response.setHeader("Access-Control-Allow-Credentials", "true");

        // 3. Pass the request along to the actual Servlet (ProductServlet)
        chain.doFilter(req, res);
    }
}