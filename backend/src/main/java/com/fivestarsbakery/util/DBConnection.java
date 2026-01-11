package com.fivestarsbakery.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    // Database Configuration
    private static final String DEFAULT_URL = "jdbc:mysql://localhost:3306/bakerydb?allowPublicKeyRetrieval=true&useSSL=false";
    private static final String DEFAULT_USER = "bakeryuser";
    private static final String DEFAULT_PASSWORD = "bakerypass";

    // 1. The Method that connects to Docker or Cloud
    public static Connection getConnection() {
        Connection con = null;
        try {
            // Load the MySQL Driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // 1. Try loading from Environment Variables (Docker / Render)
            String url = System.getenv("DB_URL");
            String user = System.getenv("DB_USER");
            String password = System.getenv("DB_PASSWORD");

            // 2. If Env Vars are missing, try loading from application.properties (TiDB / Local)
            if (url == null || user == null || password == null) {
                try (java.io.InputStream input = DBConnection.class.getClassLoader().getResourceAsStream("application.properties")) {
                    if (input != null) {
                        java.util.Properties prop = new java.util.Properties();
                        prop.load(input);

                        // Support "spring.datasource.*" keys since the user added them
                        if (url == null) url = prop.getProperty("spring.datasource.url");
                        if (user == null) user = prop.getProperty("spring.datasource.username");
                        if (password == null) password = prop.getProperty("spring.datasource.password");
                        
                        // Also support standard keys just in case
                        if (url == null) url = prop.getProperty("DB_URL");
                        if (user == null) user = prop.getProperty("DB_USER");
                        if (password == null) password = prop.getProperty("DB_PASSWORD");
                        
                        System.out.println("📄 Loaded configuration from application.properties");
                    }
                } catch (java.io.IOException ex) {
                    System.out.println("⚠️ Could not load application.properties");
                }
            }

            // 3. Fallback to Defaults (Localhost)
            if (url == null) url = DEFAULT_URL;
            if (user == null) user = DEFAULT_USER;
            if (password == null) password = DEFAULT_PASSWORD;

            // Remove potentially conflicting parameters if connecting to TiDB or ensure correct ones
            // For now, we trust the URL provided.

            // Retry logic: Try to connect for 30 seconds
            for (int i = 0; i < 15; i++) {
                try {
                    con = DriverManager.getConnection(url, user, password);
                    if (con != null) {
                        System.out.println("✅ Database Connected Successfully to: " + url);
                        return con;
                    }
                } catch (SQLException e) {
                    System.out.println("⚠️ Connection failed, retrying in 2s... (" + (i + 1) + "/15)");
                    // print minimal error to avoid spam, or full stack trace?
                    // e.printStackTrace(); 
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