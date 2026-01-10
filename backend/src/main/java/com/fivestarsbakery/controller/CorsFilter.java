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
        jakarta.servlet.http.HttpServletRequest request = (jakarta.servlet.http.HttpServletRequest) req;

        // 2. Add the "Permission Slips" (Headers)
        String origin = request.getHeader("Origin");
        
        // List of allowed origins
        java.util.List<String> allowedOrigins = java.util.Arrays.asList(
            "http://localhost:5173",
            "https://5starsbakery.vercel.app"
        );

        // If the request comes from an allowed origin, echo it back
        if (origin != null && allowedOrigins.contains(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        } else {
            // Fallback for tools/direct access, or allow localhost if no origin present? 
            // Just leaving it unset or setting to localhost default if testing locally without origin header
            // response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        }

        // Allow these actions (Get data, Send data, Delete data)
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

        // Allow JSON content
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        // Allow cookies (for Login later)
        response.setHeader("Access-Control-Allow-Credentials", "true");
        
        // Handle Preflight (OPTIONS) requests - Stop them here with OK status
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // 3. Pass the request along to the actual Servlet (ProductServlet)
        chain.doFilter(req, res);
    }
}