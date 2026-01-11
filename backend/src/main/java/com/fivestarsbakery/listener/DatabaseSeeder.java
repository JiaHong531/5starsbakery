package com.fivestarsbakery.listener;

import com.fivestarsbakery.util.DBConnection;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.stream.Collectors;

@WebListener
public class DatabaseSeeder implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("🌱 DatabaseSeeder: Checking database state...");

        try (Connection con = DBConnection.getConnection()) {
            if (con == null) {
                System.out.println("⚠️ DatabaseSeeder: Could not connect to database. Skipping seeding.");
                return;
            }

            boolean needsInit = false;
            boolean needsReviews = false;

            try (Statement stmt = con.createStatement()) {
                // 1. Check if 'products' table exists and has data
                try (ResultSet rs = con.getMetaData().getTables(null, null, "products", null)) {
                    if (!rs.next()) {
                        System.out.println("🌱 DatabaseSeeder: 'products' table not found. Full init required.");
                        needsInit = true;
                    } else {
                        // Check if empty
                        try (ResultSet countRs = stmt.executeQuery("SELECT count(*) FROM products")) {
                            if (countRs.next() && countRs.getInt(1) == 0) {
                                System.out.println("🌱 DatabaseSeeder: 'products' table is empty. Full init required.");
                                needsInit = true;
                            }
                        }
                    }
                }

                // 2. If 'products' exists/will be created, check if 'feedback' is empty
                // (Only check if we aren't already doing a full init, because full init includes reviews)
                if (!needsInit) {
                     try (ResultSet rs = con.getMetaData().getTables(null, null, "feedback", null)) {
                        if (rs.next()) { // feedback table exists
                            try (ResultSet countRs = stmt.executeQuery("SELECT count(*) FROM feedback")) {
                                if (countRs.next() && countRs.getInt(1) == 0) {
                                    System.out.println("🌱 DatabaseSeeder: 'feedback' table is empty. Seeding reviews only.");
                                    needsReviews = true;
                                }
                            }
                        }
                    }
                }
            } catch (Exception e) {
                System.out.println("⚠️ DatabaseSeeder: Error checking table state: " + e.getMessage());
            }

            if (needsInit) {
                seedUsingScript(con, "init.sql");
            } else if (needsReviews) {
                seedUsingScript(con, "reviews.sql");
            } else {
                System.out.println("✅ DatabaseSeeder: Database already populated.");
            }

        } catch (Exception e) {
            System.err.println("❌ DatabaseSeeder: Critical Error during initialization.");
            e.printStackTrace();
        }
    }

    private void seedUsingScript(Connection con, String filename) {
        System.out.println("🚀 DatabaseSeeder: Seeding from " + filename + "...");
        
        try (InputStream input = getClass().getClassLoader().getResourceAsStream(filename)) {
            if (input == null) {
                System.out.println("❌ DatabaseSeeder: " + filename + " not found in resources!");
                return;
            }

            String sqlScript = new BufferedReader(new InputStreamReader(input))
                .lines().collect(Collectors.joining("\n"));

            // Split by semicolon, but ignore semicolons inside comments or strings if possible.
            // For simple sql files, splitting by ";" is usually okay.
            String[] statements = sqlScript.split(";");

            try (Statement stmt = con.createStatement()) {
                con.setAutoCommit(false); // Transactional
                
                int count = 0;
                for (String sql : statements) {
                    if (sql.trim().isEmpty()) continue;
                    
                    try {
                        stmt.execute(sql);
                        count++;
                    } catch (Exception e) {
                        // Log but continue? Or fail?
                        System.out.println("⚠️ Warning executing statement: " + (sql.length() > 50 ? sql.substring(0, 50) + "..." : sql));
                        System.out.println("   Error: " + e.getMessage());
                    }
                }
                
                con.commit();
                con.setAutoCommit(true);
                System.out.println("✅ DatabaseSeeder: Successfully executed " + count + " statements from " + filename);
                
            } catch (Exception e) {
                con.rollback();
                System.out.println("❌ DatabaseSeeder: Transaction failed. Rolled back.");
                e.printStackTrace();
            }

        } catch (Exception e) {
            System.out.println("❌ DatabaseSeeder: Failed to read " + filename);
            e.printStackTrace();
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Cleanup if needed
    }
}
