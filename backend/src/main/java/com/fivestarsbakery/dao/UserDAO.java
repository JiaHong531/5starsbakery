package com.fivestarsbakery.dao;

import com.fivestarsbakery.model.User;
import com.fivestarsbakery.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDAO {

    // REGISTER METHOD
    public boolean register(User user) {
        String sql = "INSERT INTO users (username, first_name, last_name, email, password, phone_number, gender, birthdate, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CUSTOMER')";

        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, user.getUsername());
            ps.setString(2, user.getFirstName());
            ps.setString(3, user.getLastName());
            ps.setString(4, user.getEmail());
            ps.setString(5, user.getPassword());
            ps.setString(6, user.getPhoneNumber()); // Matches User.java
            ps.setString(7, user.getGender());

            // Convert String date to SQL Date
            ps.setDate(8, java.sql.Date.valueOf(user.getBirthdate()));

            int rows = ps.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // LOGIN METHOD
    public User login(String loginInput, String password) {
        User user = null;
        String sql = "SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?";

        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, loginInput);
            ps.setString(2, loginInput);
            ps.setString(3, password);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    user = new User();
                    user.setId(rs.getInt("user_id"));
                    user.setUsername(rs.getString("username"));
                    user.setFirstName(rs.getString("first_name"));
                    user.setLastName(rs.getString("last_name"));
                    user.setEmail(rs.getString("email"));
                    user.setPassword(rs.getString("password")); // Added
                    user.setPhoneNumber(rs.getString("phone_number")); // Added
                    user.setGender(rs.getString("gender")); // Added
                    user.setBirthdate(rs.getString("birthdate")); // Added
                    user.setRole(rs.getString("role"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }

    // UPDATE USER METHOD
    public boolean updateUser(User user) {
        String sql = "UPDATE users SET email = ?, password = ?, phone_number = ? WHERE user_id = ?";

        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, user.getEmail());
            ps.setString(2, user.getPassword());
            ps.setString(3, user.getPhoneNumber());
            ps.setInt(4, user.getId());

            int rows = ps.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}