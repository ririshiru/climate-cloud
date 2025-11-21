import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { assets } from '../assets/assets';

const Register = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();
    
    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setStatus('');

        if (password !== confirmPassword) {
            setStatus('Passwords do not match');
            return;
        }

        try {
            await register(email, password, name);
            navigate('/');
        } catch (error) {
            console.error("Registration Error:", error);
            
            if (error.code === 409) {
                setStatus('An account with this email already exists.');
            } else {
                setStatus('Registration failed. Please try again.');
            }
        }
    };

    // Styles
    const cardClass = `w-full max-w-sm p-8 rounded-2xl shadow-2xl transition-all duration-500 
                     bg-white dark:bg-[#282136] text-gray-800 dark:text-white`;

    const inputClass = `w-full p-3 mt-1 rounded-lg border text-sm outline-none transition-colors
                      bg-gray-50 dark:bg-[#3E3452] border-gray-300 dark:border-[#583C79] 
                      focus:border-[#80609F] dark:focus:border-primary`;

    const buttonClass = `w-full py-3 mt-6 font-semibold rounded-lg transition duration-300 flex justify-center items-center
                       ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#80609F] hover:bg-[#6A4D85] dark:bg-primary dark:text-gray-900 dark:hover:bg-[#E6CCFF] text-white'}`;

    return (
        <div className='flex items-center justify-center h-screen w-full dark:bg-black transition-colors duration-500'>
            <div className={cardClass}>
                <div className="text-center mb-6">
                    <img 
                        src={theme === 'dark' ? assets.logo_dark_mode : assets.logo_light_mode}
                        className='w-16 mx-auto mb-4'
                        alt="Logo"
                    />
                    <h2 className='text-3xl font-bold'>Create an Account</h2>
                    <p className='text-sm mt-2 text-gray-500 dark:text-gray-400'>
                        Join us to start your project discovery.
                    </p>
                </div>
                
                <form onSubmit={handleRegister} className='space-y-4'>
                    <div>
                        <label htmlFor="name" className='block text-sm font-medium'>Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClass}
                            placeholder="Enter your full name"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className='block text-sm font-medium'>Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                            placeholder="Enter your email"
                            required
                            disabled={loading}
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
                            placeholder="Create a password"
                            required
                            minLength="8"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className='block text-sm font-medium'>Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={inputClass}
                            placeholder="Confirm your password"
                            required
                            minLength="8"
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={buttonClass} 
                        disabled={loading}
                    >
                        {loading ? (
                           <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                {status && (
                    <p className={`text-center text-xs mt-4 font-semibold ${
                        status.includes('successful') ? 'text-green-500' : 'text-red-500'
                    }`}>
                        {status}
                    </p>
                )}

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <button 
                            onClick={() => navigate('/login')}
                            className="text-[#80609F] dark:text-primary hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
