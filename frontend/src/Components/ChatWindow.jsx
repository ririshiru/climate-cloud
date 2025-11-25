import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../Context/AppContext';
import { assets } from '../assets/assets';
import Message from './Message.jsx';
import Loading from './Loading.jsx';
import ChallengeCard from './ChallengeCard.jsx';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const ChatWindow = () => {
  // ============================
  // 1. Configuration & State
  // ============================
  const API_URL = 'http://localhost:5000/api/discover'; // Backend URL

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const { selectedChat, theme, createNewChat } = useAppContext();
  const { user } = useAuth();

  // Chat State
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [isProfiling, setIsProfiling] = useState(false);
  const [error, setError] = useState(null);

  // Form State 
  const [formData, setFormData] = useState({
    profession: '',
    qualification: '',
    domain: '',
    specificGoal: '',
    location: ''
  });

  // Results State
  const [topChallenges, setTopChallenges] = useState(null);

  const showWelcomeScreen = !selectedChat && !topChallenges;

  // ============================
  // 2. API & Logic Handlers
  // ============================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { profession, qualification, domain, specificGoal, location } = formData;

    // Basic Validation
    if (!profession || !qualification || !domain || !specificGoal || !location) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setIsProfiling(false);

    try {
      const payload = { profession, qualification, domain, specificGoal, location };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.statusText}`);

      const data = await response.json();

      if (data.success && Array.isArray(data.problems)) {
        setTopChallenges(data.problems);
      } else {
        throw new Error('Invalid response format from server');
      }

    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || "Failed to fetch challenges.");
      setIsProfiling(true);
    } finally {
      setLoading(false);
    }
  };

  const startProjectHandler = async (challengeData) => {
    if (!user) {
      alert("You must be logged in to start a project.");
      return;
    }

    try {
      // Create project in Supabase
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: user.$id || user.user_id, // Handle both Appwrite/Supabase structure
            title: challengeData.title,
            description: challengeData.description,
            original_problem: challengeData.description, // Assuming description is the problem
            original_source: challengeData.source || "AI Generated",
            sdg_tags: challengeData.sdgs || [],
            solution_plan: "", // Initially empty
            is_public: false
          }
        ])
        .select();

      if (error) throw error;

      console.log("Project started:", data);
      alert("Project saved to your Impact Dashboard!");

      const initialMessage = `I want to work on: "${challengeData.title}". Description: ${challengeData.description}`;
      setTopChallenges(null);

      // This triggers the chat view
      if (createNewChat) {
        createNewChat(initialMessage);
      } else {
        setMessages(m => [...m, { role: 'system', content: initialMessage }]);
      }

    } catch (err) {
      console.error("Error starting project:", err);
      alert("Failed to save project. Please try again.");
    }
  };

  const onChatSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: prompt, timestamp: Date.now() }]);
    setPrompt('');
  };

  // ============================
  // 3. Effects
  // ============================
  useEffect(() => {
    if (selectedChat?.messages) {
      setMessages(selectedChat.messages);
      setIsProfiling(false);
      setTopChallenges(null);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, topChallenges, loading]);

  // ============================
  // 4. Render
  // ============================
  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">

      {/* Scrollable Content Area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto pb-5 no-scrollbar relative">

        {loading && <Loading />}

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Results View */}
        {!loading && topChallenges && (
          <div className="p-4 space-y-6 max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-3xl font-bold text-center text-[#80609F] dark:text-primary pt-2">Discovery Results</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Based on your profile in {formData.location}</p>
            <div className="space-y-6">
              {topChallenges.map((challenge, index) => (
                <ChallengeCard key={index} data={challenge} index={index} onStartProject={startProjectHandler} />
              ))}
            </div>
            <button
              onClick={() => { setTopChallenges(null); setIsProfiling(true); }}
              className="mx-auto block mt-8 text-sm text-gray-500 hover:text-[#80609F] underline"
            >
              Search Again
            </button>
          </div>
        )}

        {/* Main Interface */}
        {!loading && !topChallenges && (
          <>
            {/* Welcome Screen */}
            {showWelcomeScreen && !isProfiling && (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <img src={theme === 'dark' ? assets.logo_dark_mode : assets.logo_light_mode} alt="Logo" className="w-full max-w-56 sm:max-w-68" />
                <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white font-light">What will you solve today?</p>
                <button
                  onClick={() => setIsProfiling(true)}
                  className="mt-8 px-8 py-3 bg-[#80609F] text-white text-lg font-semibold rounded-full shadow-lg hover:bg-[#6A4D85] transition-all hover:scale-105 dark:bg-primary dark:text-gray-900"
                >
                  Find a Problem
                </button>
              </div>
            )}

            {/* Profile Form */}
            {isProfiling && (
              <div className="h-full flex items-center justify-center p-4 animate-slideUp">
                <form onSubmit={handleProfileSubmit} className="w-full max-w-xl bg-white dark:bg-[#282136] p-8 rounded-2xl shadow-2xl space-y-5 border border-gray-100 dark:border-[#583C79]">
                  <h2 className="text-2xl font-bold text-[#80609F] dark:text-primary text-center mb-4">Project Parameters</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Profession</label>
                      <input name="profession" value={formData.profession} onChange={handleInputChange} placeholder="e.g. Student" className="w-full p-3 mt-1 rounded-lg bg-gray-50 dark:bg-[#3E3452] border border-gray-200 dark:border-[#583C79] dark:text-white focus:ring-2 focus:ring-[#80609F] outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Qualification</label>
                      <input name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="e.g. B.Sc" className="w-full p-3 mt-1 rounded-lg bg-gray-50 dark:bg-[#3E3452] border border-gray-200 dark:border-[#583C79] dark:text-white focus:ring-2 focus:ring-[#80609F] outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Domain</label>
                    <input name="domain" value={formData.domain} onChange={handleInputChange} placeholder="e.g. Climate Change" className="w-full p-3 mt-1 rounded-lg bg-gray-50 dark:bg-[#3E3452] border border-gray-200 dark:border-[#583C79] dark:text-white focus:ring-2 focus:ring-[#80609F] outline-none" />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Location</label>
                    <input name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. California" className="w-full p-3 mt-1 rounded-lg bg-gray-50 dark:bg-[#3E3452] border border-gray-200 dark:border-[#583C79] dark:text-white focus:ring-2 focus:ring-[#80609F] outline-none" />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Specific Goal</label>
                    <textarea name="specificGoal" value={formData.specificGoal} onChange={handleInputChange} rows="3" placeholder="What do you want to achieve?" className="w-full p-3 mt-1 rounded-lg bg-gray-50 dark:bg-[#3E3452] border border-gray-200 dark:border-[#583C79] dark:text-white focus:ring-2 focus:ring-[#80609F] outline-none resize-none"></textarea>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setIsProfiling(false)} className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-[#80609F] text-white font-bold rounded-lg hover:bg-[#6A4D85] dark:bg-primary dark:text-gray-900">Discover</button>
                  </div>
                </form>
              </div>
            )}

            {/* Chat Messages */}
            {selectedChat && messages.length > 0 && (
              <div className="space-y-6">
                {messages.map((msg, index) => <Message key={index} message={msg} />)}
              </div>
            )}
          </>
        )}
      </div>

      {/* =========================================
        CHAT INPUT AREA (COMPLETELY REMOVED ON WELCOME)
        =========================================
        Only renders if a chat is actually selected/active
      */}
      {selectedChat && (
        <div className="mt-4 w-full max-w-2xl mx-auto animate-fadeIn">
          <form onSubmit={onChatSubmit} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-4 pr-12 rounded-full border bg-white dark:bg-[#282136] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#80609F] transition-all"
              disabled={loading}
            />
            <button type="submit" disabled={loading} className="absolute right-2 p-2 text-[#80609F] dark:text-primary hover:bg-gray-100 dark:hover:bg-[#3E3452] rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default ChatWindow;