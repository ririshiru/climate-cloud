import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../Context/AppContext'; // For theme
import { assets } from '../assets/assets';

const Login = () => {
    const navigate = useNavigate();
    const { login, loading: authLoading } = useAuth();
    const { theme } = useAppContext();

    const [status, setStatus] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            await login(email, password);
            setStatus('Login successful! Redirecting...');
            // Navigation is handled in AuthContext, but we can double check or show success msg
        } catch (error) {
            console.error("Login Error:", error);
            setStatus('Invalid email or password.');
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

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/register')} // Assuming register route exists, check App.jsx
                            className="text-[#80609F] dark:text-primary hover:underline"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;