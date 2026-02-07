import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUser({ username: decoded.username || 'User' });
                } catch (e) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (username, password) => {
        const response = await api.post('login/', { username, password });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        const decoded = jwtDecode(response.data.access);
        setUser({ username: username }); // Simple JWT might not have username, but we passed it
    };

    const register = async (username, email, password) => {
        await api.post('register/', { username, email, password });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};
