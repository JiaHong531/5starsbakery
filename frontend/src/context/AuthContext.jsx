import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();


const getStoredUser = () => {
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            return JSON.parse(storedUser);
        }
    } catch (e) {
        console.error("Corrupted user data in storage", e);
        localStorage.removeItem("user"); 
    }
    return null;
};

export const AuthProvider = ({ children }) => {
    
    
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