import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { account, ID } from '../lib/appwrite';
import { supabase } from '../lib/supabase';

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
                const appwriteUser = await account.get();
                // Fetch extra details from Supabase
                const { data: supabaseUser } = await supabase
                    .from('users')
                    .select('*')
                    .eq('user_id', appwriteUser.$id)
                    .maybeSingle();

                setUser({ ...appwriteUser, ...supabaseUser });
            }
        } catch (error) {
            console.log('No active session');
        } finally {
            setLoading(false);
        }
    };

    // Register a new user
    const register = async (email, password, name, role, profession, interests) => {
        try {
            // 1. Create Appwrite Account
            await account.create(ID.unique(), email, password, name);

            // 2. Login to get session (required for Supabase RLS if enabled, or just to get ID)
            await account.createEmailPasswordSession(email, password);
            const appwriteUser = await account.get();

            // 3. Create Supabase Profile
            const { error } = await supabase
                .from('users')
                .insert([
                    {
                        user_id: appwriteUser.$id,
                        name: name,
                        email: email,
                        role: role,
                        profession: profession,
                        interests: interests.split(',').map(i => i.trim())
                    }
                ]);

            if (error) throw error;

            // 4. Set User State
            const fullUser = { ...appwriteUser, role, profession, interests };
            setUser(fullUser);
            return fullUser;

        } catch (error) {
            console.error("Registration Error:", error);
            throw error;
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            await account.createEmailPasswordSession(email, password);
            const appwriteUser = await account.get();

            // Fetch extra details from Supabase
            const { data: supabaseUser } = await supabase
                .from('users')
                .select('*')
                .eq('user_id', appwriteUser.$id)
                .maybeSingle();

            const fullUser = { ...appwriteUser, ...supabaseUser };
            setUser(fullUser);
            return fullUser;
        } catch (error) {
            throw error;
        }
    };

    // Logout user
    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            navigate('/auth');
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
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
