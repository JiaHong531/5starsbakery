package com.fivestarsbakery.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    // Database Configuration
    private static final String URL = "jdbc:mysql://localhost:3306/bakerydb?allowPublicKeyRetrieval=true&useSSL=false";
    private static final String USER = "bakeryuser";
    private static final String PASSWORD = "bakerypass";

    // 1. The Method that connects to Docker
    public static Connection getConnection() {
        Connection con = null;
        try {
            // Load the MySQL Driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Attempt Connection
            con = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("✅ Database Connected Successfully!");

        } catch (ClassNotFoundException e) {
            System.out.println("❌ Driver Not Found! (Check pom.xml)");
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println("❌ Connection Failed! (Check Docker)");
            e.printStackTrace();
        }
        return con;
    }

    // 2. The Main Method (For Testing Only)
    // Run this file to check if Week 1 is done.
    public static void main(String[] args) {
        getConnection();
    }
}