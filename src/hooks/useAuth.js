import { useMutation, useApolloClient } from '@apollo/client/react';
import { useState, useCallback } from 'react';
import { LOGIN, LOGOUT } from '../graphql/mutations';

// Hook for authentication
export function useAuth() {
    const [user, setUser] = useState(() => {
        // Try to restore user from localStorage
        const saved = localStorage.getItem('orderms_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const client = useApolloClient();
    const [loginMutation] = useMutation(LOGIN);
    const [logoutMutation] = useMutation(LOGOUT);

    // Login function
    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await loginMutation({
                variables: { input: { email, password } },
            });
            const userData = data.login;
            setUser(userData);
            localStorage.setItem('orderms_user', JSON.stringify(userData));
            return userData;
        } catch (err) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [loginMutation]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await logoutMutation();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            localStorage.removeItem('orderms_user');
            // Clear Apollo cache on logout
            await client.clearStore();
        }
    }, [logoutMutation, client]);

    // Check if user is admin
    const isAdmin = user?.role === 'ADMIN';

    // Check if user is authenticated
    const isAuthenticated = !!user;

    return {
        user,
        loading,
        error,
        login,
        logout,
        isAdmin,
        isAuthenticated,
    };
}
