import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ==========================================
// ⚠️ FOR LOCAL VS CODE USE:
// 1. UNCOMMENT the real imports below
// 2. DELETE the "MOCK DATA" section
// ==========================================

/* import { useAppContext } from '../Context/AppContext';
import { assets } from '../assets/assets';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
*/

// ==========================================
// 🛠️ MOCK DATA (FOR PREVIEW ONLY)
// ==========================================

// Mock Assets
const assets = {
  logo_dark_mode: "https://cdn-icons-png.flaticon.com/512/3203/3203907.png",
  logo_light_mode: "https://cdn-icons-png.flaticon.com/512/3203/3203907.png"
};

// Mock Context
const useAppContext = () => {
  const [user, setUser] = useState(null);
  return { user, setUser, theme: 'light' };
};

// Mock Firebase Functions
const auth = {}; // Mock auth instance
const signInWithEmailAndPassword = async (auth, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) resolve({ user: { uid: 'test-uid', email } });
      else reject({ code: 'auth/invalid-credential' });
    }, 1000);
  });
};
const onAuthStateChanged = (auth, callback) => {
  // Does nothing in mock, acts as a placeholder
  return () => {};
};

// ==========================================
// 🚀 MAIN COMPONENT
// ==========================================

const Login = () => {
    const navigate = useNavigate();
    const { user, setUser, theme } = useAppContext(); 
    
    const [status, setStatus] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log("User detected:", currentUser.uid);
                // Update global context
                setUser({ uid: currentUser.uid, email: currentUser.email });
                
                setStatus('Login successful! Redirecting...');
                setTimeout(() => navigate('/'), 1000);
            }
        });

        return () => unsubscribe(); // Cleanup listener
    }, [navigate, setUser]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            // Attempt real Firebase login
            await signInWithEmailAndPassword(auth, email, password);
            
            // FOR LOCAL USE: The onAuthStateChanged hook handles success.
            // FOR MOCK PREVIEW: We manually trigger success here since the mock hook is empty
            setStatus('Login successful! Redirecting...');
            setTimeout(() => navigate('/'), 1000);

        } catch (error) {
            console.error("Login Error:", error);
            
            // User friendly error messages
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                setStatus('Invalid email or password.');
            } else if (error.code === 'auth/wrong-password') {
                setStatus('Incorrect password.');
            } else if (error.code === 'auth/too-many-requests') {
                setStatus('Too many failed attempts. Please try again later.');
            } else {
                setStatus('Login failed. Please check your connection.');
            }
            setLoading(false);
        }
    };

    // Styles
    const cardClass = `w-full max-w-sm p-8 rounded-2xl shadow-2xl transition-all duration-500 
                       ${theme === 'dark' ? 'bg-[#282136] text-white border border-[#583C79]' : 'bg-white text-gray-800 border border-gray-200'}`;

    const inputClass = `w-full p-3 mt-1 rounded-lg border text-sm outline-none transition-colors
                        ${theme === 'dark' ? 'bg-[#3E3452] border-[#583C79] text-white focus:border-primary' : 'bg-gray-50 border-gray-300 focus:border-[#80609F]'}`;

    const buttonClass = `w-full py-3 mt-6 font-semibold rounded-lg transition duration-300 flex justify-center items-center
                         ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#80609F] hover:bg-[#6A4D85] dark:bg-primary dark:text-gray-900 dark:hover:bg-[#E6CCFF] text-white'}`;

    return (
        <div className='flex items-center justify-center h-screen w-full dark:bg-black transition-colors duration-500'>
            <div className={cardClass}>
                <div className="text-center mb-6">
                    <img 
                        src={theme === 'dark' ? assets.logo_dark_mode : assets.logo_light_mode}
                        alt="App Logo"
                        className='w-16 mx-auto mb-4'
                    />
                    <h2 className='text-3xl font-bold'>Welcome Back</h2>
                    <p className='text-sm mt-2 text-gray-500 dark:text-gray-400'>
                        Sign in to continue your project discovery.
                    </p>
                </div>

                <form onSubmit={handleLogin} className='space-y-4'>
                    <div>
                        <label htmlFor="email" className='block text-sm font-medium'>Email</label>
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
                        <label htmlFor="password" className='block text-sm font-medium'>Password</label>
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

                    <button type="submit" className={buttonClass} disabled={loading}>
                        {loading ? (
                           <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'Log In'
                        )}
                    </button>
                </form>

                {status && (
                    <p className={`text-center text-xs mt-4 font-semibold ${status.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;