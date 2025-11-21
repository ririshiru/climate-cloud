import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext'; // Removed .jsx
import { assets } from '../assets/assets'; // Removed .jsx
// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken, 
    onAuthStateChanged,
    setPersistence,
    browserSessionPersistence
} from 'firebase/auth';

const Login = () => {
    const navigate = useNavigate();
    // Get user state and theme from context
    const { user, setUser, theme } = useAppContext(); 
    
    const [status, setStatus] = useState('Initializing authentication...');
    
    // Mock input states for UI (These are for visual form display only, auth is automatic)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Global environment variables (must be accessed safely)
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
    
    useEffect(() => {
        // If the user context is already set, redirect immediately
        if (user) {
            setStatus('Login successful. Redirecting...');
            const redirectTimer = setTimeout(() => navigate('/'), 1000);
            return () => clearTimeout(redirectTimer);
        }

        if (!firebaseConfig) {
            setStatus('Error: Firebase configuration not found. Cannot proceed.');
            console.error('Firebase Config not found.');
            return;
        }

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        
        // 1. Auth State Listener: Updates global context on sign-in/out
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log("User signed in with UID:", currentUser.uid);
                setStatus('Authenticated. Setting user context and redirecting...');
                
                // Set the user in the global context 
                setUser({ uid: currentUser.uid, name: "Canvas User" }); 
                
            } else {
                setStatus('Ready to sign in...');
            }
        });
        
        // 2. Initial Sign-in Attempt: Use provided token or sign in anonymously
        const handleSignIn = async () => {
            try {
                // Set persistence to session to avoid token issues on refresh
                await setPersistence(auth, browserSessionPersistence);

                if (initialAuthToken) {
                    setStatus("Signing in with secure environment token...");
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    setStatus("No secure token found. Signing in anonymously...");
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Authentication Error:", error);
                setStatus(`Authentication failed: ${error.code}. Please refresh or check configuration.`);
            }
        };

        handleSignIn();
        
        // Cleanup listener on component unmount
        return () => unsubscribe();
        
    }, [firebaseConfig, initialAuthToken, navigate, setUser, user]);


    // Mock login handler (actual auth is automatic via useEffect)
    const handleMockLogin = (e) => {
        e.preventDefault();
        // Since auth is automatic, this just serves to reassure the user
        if (user) {
             navigate('/');
        } else {
            setStatus('Attempting automatic sign-in... Please wait.');
        }
    };

    // Tailwind Classes for Theming
    const cardClass = `w-full max-w-sm p-8 rounded-2xl shadow-2xl transition-all duration-500 
                       ${theme === 'dark' ? 'bg-[#282136] text-white border border-[#583C79]' : 'bg-white text-gray-800 border border-gray-200'}`;

    const inputClass = `w-full p-3 mt-1 rounded-lg border text-sm outline-none 
                        ${theme === 'dark' ? 'bg-[#3E3452] border-[#583C79] text-white focus:border-primary' : 'bg-gray-50 border-gray-300 focus:border-[#80609F]'}`;

    const buttonClass = `w-full py-3 mt-6 font-semibold rounded-lg transition duration-300 
                         ${user ? 'bg-green-600 hover:bg-green-700' : 'bg-[#80609F] hover:bg-[#6A4D85] dark:bg-primary dark:text-gray-900 dark:hover:bg-[#E6CCFF]'}`;


    return (
        <div className='flex items-center justify-center h-screen w-full dark:bg-black'>
            <div className={cardClass}>
                <div className="text-center mb-6">
                    <img 
                        src={theme === 'dark' ? assets.logo_dark_mode : assets.logo_light_mode}
                        alt="App Logo"
                        className='w-16 mx-auto mb-4'
                    />
                    <h2 className='text-3xl font-bold'>Welcome Back</h2>
                    <p className='text-sm mt-2 dark:text-gray-400'>
                        Sign in to continue your project discovery.
                    </p>
                </div>

                <form onSubmit={handleMockLogin} className='space-y-4'>
                    <div>
                        <label htmlFor="email" className='block text-sm font-medium'>Email (Mock)</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                            placeholder="user@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className='block text-sm font-medium'>Password (Mock)</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClass}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className={buttonClass} disabled={!!user}>
                        {user ? 'Logged In! Redirecting...' : 'Log In (Automatic Auth)'}
                    </button>
                </form>

                <p className={`text-center text-xs mt-4 font-semibold ${user ? 'text-green-500' : 'dark:text-gray-500'}`}>
                    Status: {status}
                </p>
            </div>
        </div>
    );
};

export default Login;