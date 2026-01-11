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

            
            boolean needsSeeding = false;
            try (Statement stmt = con.createStatement()) {
                
                try (ResultSet rs = con.getMetaData().getTables(null, null, "products", null)) {
                    if (!rs.next()) {
                        System.out.println("🌱 DatabaseSeeder: 'products' table not found. Seeding required.");
                        needsSeeding = true;
                    } else {
                        
                        try (ResultSet countRs = stmt.executeQuery("SELECT count(*) FROM products")) {
                            if (countRs.next() && countRs.getInt(1) == 0) {
                                System.out.println("🌱 DatabaseSeeder: 'products' table is empty. Seeding required.");
                                needsSeeding = true;
                            }
                        }
                    }
                }
            } catch (Exception e) {
                System.out.println("⚠️ DatabaseSeeder: Error checking table state, attempting to seed anyway: " + e.getMessage());
                needsSeeding = true;
            }

            if (needsSeeding) {
                seedDatabase(con);
            } else {
                System.out.println("✅ DatabaseSeeder: Database already populated.");
            }

        } catch (Exception e) {
            System.err.println("❌ DatabaseSeeder: Critical Error during initialization.");
            e.printStackTrace();
        }
    }

    private void seedDatabase(Connection con) {
        System.out.println("🚀 DatabaseSeeder: Starting database seeding from init.sql...");
        
        try (InputStream input = getClass().getClassLoader().getResourceAsStream("init.sql")) {
            if (input == null) {
                System.out.println("❌ DatabaseSeeder: init.sql not found in resources!");
                return;
            }

            String sqlScript = new BufferedReader(new InputStreamReader(input))
                .lines().collect(Collectors.joining("\n"));

            
            
            
            String[] statements = sqlScript.split(";");

            try (Statement stmt = con.createStatement()) {
                con.setAutoCommit(false); 
                
                int count = 0;
                for (String sql : statements) {
                    if (sql.trim().isEmpty()) continue;
                    
                    try {
                        stmt.execute(sql);
                        count++;
                    } catch (Exception e) {
                        
                        
                        System.out.println("⚠️ Warning executing statement: " + (sql.length() > 50 ? sql.substring(0, 50) + "..." : sql));
                        System.out.println("   Error: " + e.getMessage());
                    }
                }
                
                con.commit();
                con.setAutoCommit(true);
                System.out.println("✅ DatabaseSeeder: Successfully executed " + count + " SQL statements.");
                
            } catch (Exception e) {
                con.rollback();
                System.out.println("❌ DatabaseSeeder: Transaction failed. Rolled back.");
                e.printStackTrace();
            }

        } catch (Exception e) {
            System.out.println("❌ DatabaseSeeder: Failed to read init.sql");
            e.printStackTrace();
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        
    }
}
