package com.fivestarsbakery.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    // Database Configuration
    private static final String DEFAULT_URL = "jdbc:mysql://localhost:3306/bakerydb?allowPublicKeyRetrieval=true&useSSL=false";
    private static final String DEFAULT_USER = "bakeryuser";
    private static final String DEFAULT_PASSWORD = "bakerypass";

    // 1. The Method that connects to Docker
    public static Connection getConnection() {
        Connection con = null;
        try {
            // Load the MySQL Driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Get Environment Variables (Docker) or Fallback to Defaults (Local)
            String url = System.getenv("DB_URL");
            if (url == null)
                url = DEFAULT_URL;

            String user = System.getenv("DB_USER");
            if (user == null)
                user = DEFAULT_USER;

            String password = System.getenv("DB_PASSWORD");
            if (password == null)
                password = DEFAULT_PASSWORD;

            // Retry logic: Try to connect for 30 seconds
            for (int i = 0; i < 15; i++) {
                try {
                    con = DriverManager.getConnection(url, user, password);
                    if (con != null) {
                        System.out.println("✅ Database Connected Successfully!");
                        return con;
                    }
                } catch (SQLException e) {
                    System.out.println("⚠️ Connection failed, retrying in 2s... (" + (i + 1) + "/15)");
                    try { Thread.sleep(2000); } catch (InterruptedException ex) { 
                        Thread.currentThread().interrupt(); 
                    }
                }
            }
            System.out.println("❌ Could not connect to database after 30 seconds.");
            
        } catch (ClassNotFoundException e) {
            System.out.println("❌ Driver Not Found! (Check pom.xml)");
            e.printStackTrace();
        }
        return null;
    }

    // 2. The Main Method (For Testing Only)
    // Run this file to check if Week 1 is done.
    public static void main(String[] args) {
        getConnection();
    }
}