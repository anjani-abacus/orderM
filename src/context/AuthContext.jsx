import { createContext, useContext, useState, useEffect } from 'react';
import users from '../mock-data/users.json';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for existing session
        const storedUser = localStorage.getItem('orderms_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('orderms_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const foundUser = users.find(
            (u) => u.email === email && u.password === password
        );

        if (foundUser) {
            const userData = {
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name,
                role: foundUser.role,
            };
            setUser(userData);
            localStorage.setItem('orderms_user', JSON.stringify(userData));
            return { success: true, user: userData };
        }

        return { success: false, error: 'Invalid email or password' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('orderms_user');
    };

    const isAdmin = () => user?.role === 'ADMIN';
    const isStaff = () => user?.role === 'STAFF';

    const value = {
        user,
        loading,
        login,
        logout,
        isAdmin,
        isStaff,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
