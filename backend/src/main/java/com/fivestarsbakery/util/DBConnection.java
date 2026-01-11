package com.fivestarsbakery.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    
    private static final String DEFAULT_URL = "jdbc:mysql://localhost:3306/bakerydb?allowPublicKeyRetrieval=true&useSSL=false";
    private static final String DEFAULT_USER = "bakeryuser";
    private static final String DEFAULT_PASSWORD = "bakerypass";

    
    public static Connection getConnection() {
        Connection con = null;
        try {
            
            Class.forName("com.mysql.cj.jdbc.Driver");

            
            String url = System.getenv("DB_URL");
            String user = System.getenv("DB_USER");
            String password = System.getenv("DB_PASSWORD");

            
            if (url == null || user == null || password == null) {
                try (java.io.InputStream input = DBConnection.class.getClassLoader().getResourceAsStream("application.properties")) {
                    if (input != null) {
                        java.util.Properties prop = new java.util.Properties();
                        prop.load(input);

                        
                        if (url == null) url = prop.getProperty("spring.datasource.url");
                        if (user == null) user = prop.getProperty("spring.datasource.username");
                        if (password == null) password = prop.getProperty("spring.datasource.password");
                        
                        
                        if (url == null) url = prop.getProperty("DB_URL");
                        if (user == null) user = prop.getProperty("DB_USER");
                        if (password == null) password = prop.getProperty("DB_PASSWORD");
                        
                        System.out.println("📄 Loaded configuration from application.properties");
                    }
                } catch (java.io.IOException ex) {
                    System.out.println("⚠️ Could not load application.properties");
                }
            }

            
            if (url == null) url = DEFAULT_URL;
            if (user == null) user = DEFAULT_USER;
            if (password == null) password = DEFAULT_PASSWORD;

            
            

            
            for (int i = 0; i < 15; i++) {
                try {
                    con = DriverManager.getConnection(url, user, password);
                    if (con != null) {
                        System.out.println("✅ Database Connected Successfully to: " + url);
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

    
    
    public static void main(String[] args) {
        getConnection();
    }
}