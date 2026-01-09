import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for token in localStorage on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
            // Optionally validate token with backend here
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });

            const userData = data.user || data; // Handle format variation
            const tokenData = data.token;

            localStorage.setItem('token', tokenData);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(tokenData);
            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData, role: userData.role };
        } catch (error) {
            console.error('Login Failed', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);

            // Auto login or require login depends on API, assuming auto-login for now if token returned
            if (data.token) {
                const userObj = data.user || data;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(userObj));
                setToken(data.token);
                setUser(userObj);
                setIsAuthenticated(true);
            }

            return { success: true };
        } catch (error) {
            console.error('Registration Failed', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        // Clean up current session data if needed
        window.location.href = '/login';
    };

    const updateUser = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
