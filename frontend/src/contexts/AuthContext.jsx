import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { account, ID } from '../lib/appwrite';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check if user is logged in on initial load
    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const session = await account.getSession('current');
            if (session) {
                const userData = await account.get();
                setUser(userData);
            }
        } catch (error) {
            console.log('No active session');
        } finally {
            setLoading(false);
        }
    };

    // Register a new user
    const register = async (email, password, name) => {
        try {
            await account.create(ID.unique(), email, password, name);
            await login(email, password);
        } catch (error) {
            throw error;
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            await account.createEmailSession(email, password);
            const userData = await account.get();
            setUser(userData);
            navigate('/');
        } catch (error) {
            throw error;
        }
    };

    // Logout user
    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return user !== null;
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            register,
            login,
            logout,
            isAuthenticated
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
