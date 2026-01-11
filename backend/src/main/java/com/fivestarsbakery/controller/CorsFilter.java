package com.fivestarsbakery.controller;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;


@WebFilter("/*")
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        jakarta.servlet.http.HttpServletRequest request = (jakarta.servlet.http.HttpServletRequest) req;

        
        String origin = request.getHeader("Origin");

        
        java.util.List<String> allowedOrigins = java.util.Arrays.asList(
                "http://localhost:5173",
                "https://5starsbakery.vercel.app"
        );

        
        if (origin != null && allowedOrigins.contains(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        } else {
            
            
            
        }

        
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

        
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        
        response.setHeader("Access-Control-Allow-Credentials", "true");

        
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        
        chain.doFilter(req, res);
    }
}