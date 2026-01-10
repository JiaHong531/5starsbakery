import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Helper function to safely get user from localStorage
const getStoredUser = () => {
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            return JSON.parse(storedUser);
        }
    } catch (e) {
        console.error("Corrupted user data in storage", e);
        localStorage.removeItem("user"); // Auto-fix bad data
    }
    return null;
};

export const AuthProvider = ({ children }) => {
    // Initialize user state synchronously from localStorage
    // This prevents the race condition where UI renders before user data is loaded
    const [user, setUser] = useState(() => getStoredUser());

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);