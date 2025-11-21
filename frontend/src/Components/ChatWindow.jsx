import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../Context/AppContext';
import { assets } from '../assets/assets';
import Message from './Message.jsx';
import Loading from './Loading.jsx'; // your existing Loading component

// ===================================================================
// Helper Component: ChallengeCard
// ===================================================================
const ChallengeCard = ({ data, index, onStartProject }) => {
  const { theme } = useAppContext();

  const cardClass = `p-6 rounded-xl shadow-lg border transition duration-300 
                     ${theme === 'dark' ? 'bg-[#282136] border-[#583C79] text-white' : 'bg-white border-gray-200 text-gray-800'}
                     hover:shadow-xl hover:scale-[1.01]`;

  const sdgColor = theme === 'dark' ? 'text-primary' : 'text-[#80609F]';

  return (
    <div className={cardClass}>
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold mb-2">
          {index + 1}. {data.title}
        </h3>
        <button
          onClick={() => onStartProject(data)}
          className="ml-4 px-4 py-2 bg-[#80609F] text-white text-sm font-semibold rounded-lg hover:bg-[#6A4D85] transition duration-150 dark:bg-primary dark:text-gray-900 dark:hover:bg-[#E6CCFF]"
        >
          Start Project
        </button>
      </div>

      <p className="text-sm mb-3 dark:text-gray-300">{data.description}</p>

      <p className="text-xs font-semibold">
        <span className={sdgColor}>SDGs:</span> {data.sdgs?.join(', ') || 'N/A'}
      </p>

      <p className="text-xs mt-3 text-gray-400">Source: {data.source || 'Local Research'}</p>
    </div>
  );
};

// ===================================================================
// Main Component: ChatWindow (Mock-only flow)
// ===================================================================
const ChatWindow = () => {
  const containerRef = useRef(null);

  // Context (may include createNewChat, selectedChat, theme)
  const { selectedChat, theme, createNewChat } = useAppContext();

  // Core Chat States
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  // Profiling State
  const [isProfiling, setIsProfiling] = useState(false);
  const [profession, setProfession] = useState('');
  const [domain, setDomain] = useState('');
  const [goal, setGoal] = useState('');

  // Results state (null = no results yet)
  const [topChallenges, setTopChallenges] = useState(null);

  // Show welcome screen when no chat selected and no results
  const showWelcomeScreen = !selectedChat && !topChallenges;

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------

  // Start project from a challenge card -> create a new chat with initial prompt
  const startProjectHandler = (challengeData) => {
    const initialMessage = `
I have decided to work on the following challenge:
Title: ${challengeData.title}
Description: ${challengeData.description}
Related SDGs: ${challengeData.sdgs ? challengeData.sdgs.join(', ') : 'None'}

Please help me start defining the scope of this project. What should I do first?
`;
    // Clear results view and start a new chat (if function provided)
    setTopChallenges(null);
    if (createNewChat && typeof createNewChat === 'function') {
      createNewChat(initialMessage);
    } else {
      // fallback: push into messages locally as a system message
      setMessages((m) => [...m, { role: 'system', content: initialMessage, timestamp: Date.now() }]);
      console.warn('createNewChat not found in AppContext — appended to local messages instead.');
    }
  };

  // Chat input submit (local mock — no backend)
  const onSubmit = async (e) => {
    e.preventDefault();
    if (prompt.trim() === '' || loading) return;

    const userMessage = { role: 'user', content: prompt.trim(), timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');

    // Simulate assistant reply (mock)
    setTimeout(() => {
      const assistant = {
        role: 'assistant',
        content: `Thanks — noted: "${userMessage.content}". I suggest starting with a simple literature scan and a small user interview with 3 farmers.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistant]);
    }, 700);
  };

  // Profile form submit (MOCK) — simulate API latency then set mock problems
  const handleProfileSubmitMock = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Basic validation
    if (!profession || !domain || !goal) {
      alert('Please complete all fields.');
      return;
    }

    setLoading(true);
    setIsProfiling(false); // hide form immediately to show loading

    // Simulate backend processing time
    setTimeout(() => {
      // Two mock challenges tailored slightly by domain
      const domainLabel = domain || 'General';
      const mockProblems = [
        {
          title: `${domainLabel}: Low-cost sensor availability`,
          description:
            'A key gap is the lack of affordable, localised sensors to measure critical parameters; existing options are either too expensive or not rugged for field use.',
          sdgs: ['SDG 2', 'SDG 6'],
          source: 'Nature Sustainability, 2024',
        },
        {
          title: `${domainLabel}: Data integration & farmer adoption`,
          description:
            'Collected sensor data is often siloed and not actionable — farmers lack simple dashboards or alerts tailored to smallholders.',
          sdgs: ['SDG 2', 'SDG 9'],
          source: 'Agritech Reports, 2023',
        },
      ];

      setTopChallenges(mockProblems);
      setLoading(false);

      // Clear profile fields
      setProfession('');
      setDomain('');
      setGoal('');
    }, 4000); // 1.4s simulated latency
  };

  // ------------------------------------------------------------------
  // Effects
  // ------------------------------------------------------------------

  // When selected chat changes, load its messages (if provided)
  useEffect(() => {
    if (selectedChat && Array.isArray(selectedChat.messages)) {
      setMessages(selectedChat.messages);
      setIsProfiling(false);
      setTopChallenges(null);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // Auto-scroll on messages or results change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, topChallenges, loading]);

  // ------------------------------------------------------------------
  // ProfileForm component (inline)
  // ------------------------------------------------------------------
  const ProfileForm = () => (
    <form
      onSubmit={handleProfileSubmitMock}
      className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-[#282136] rounded-xl shadow-2xl space-y-6 text-gray-700 dark:text-primary"
    >
      <h2 className="text-2xl font-bold text-[#80609F] dark:text-primary text-center">Define Your Discovery</h2>

      {/* Profession */}
      <div>
        <label className="block text-sm font-medium mb-2">Your Profession</label>
        <div className="flex flex-wrap gap-2">
          {['Student', 'Engineer', 'Researcher', 'Other'].map((prof) => (
            <button
              key={prof}
              type="button"
              onClick={() => setProfession(prof)}
              className={`px-4 py-2 text-sm rounded-full border transition duration-150 ease-in-out 
                        ${profession === prof ? 'bg-[#80609F] text-white border-[#80609F] dark:bg-primary dark:text-gray-900' : 'bg-gray-100 border-gray-300 dark:bg-[#3E3452] dark:text-primary dark:border-[#583C79] hover:bg-gray-200 dark:hover:bg-[#583C79]'}`}
            >
              {prof}
            </button>
          ))}
        </div>
      </div>

      {/* Domain */}
      <div>
        <label className="block text-sm font-medium mb-2">Your Domain</label>
        <div className="flex flex-wrap gap-2">
          {['Agri-Tech', 'Water Management', 'Public Health'].map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setDomain(dom)}
              className={`px-4 py-2 text-sm rounded-full border transition duration-150 ease-in-out 
                        ${domain === dom ? 'bg-[#80609F] text-white border-[#80609F] dark:bg-primary dark:text-gray-900' : 'bg-gray-100 border-gray-300 dark:bg-[#3E3452] dark:text-primary dark:border-[#583C79] hover:bg-gray-200 dark:hover:bg-[#583C79]'}`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div>
        <label htmlFor="goal" className="block text-sm font-medium mb-2">
          Your Goal
        </label>
        <textarea
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="E.g., I want to find low-cost hardware solutions to monitor water quality in rural areas."
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg text-sm dark:bg-[#3E3452] dark:border-[#583C79] dark:text-white outline-none focus:ring-2 focus:ring-[#80609F]"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={!profession || !domain || !goal || loading}
        className="w-full py-3 bg-[#80609F] text-white font-semibold rounded-lg hover:bg-[#6A4D85] transition duration-150 ease-in-out disabled:bg-gray-400 dark:bg-primary dark:text-gray-900 dark:hover:bg-[#E6CCFF]"
      >
        {loading ? 'Discovering...' : 'Discover Problems'}
      </button>
    </form>
  );

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* Chat Messages / Results Container */}
      <div ref={containerRef} className="flex-1 overflow-y-auto pb-5">
        {/* Loading (full center) */}
        {loading && (
          <div className="h-full w-full flex items-center justify-center">
            <Loading />
          </div>
        )}

        {/* Results page */}
        {!loading && topChallenges && (
          <div className="p-4 space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-[#80609F] dark:text-primary pt-4">
              🎉 Your Top Unsolved Challenges
            </h1>

            <p className="text-center dark:text-gray-400 text-sm">Select a challenge to start defining your project scope.</p>

            <div className="space-y-6">
              {topChallenges.map((challengeData, index) => (
                <ChallengeCard key={`${challengeData.title}-${index}`} data={challengeData} index={index} onStartProject={startProjectHandler} />
              ))}
            </div>
          </div>
        )}

        {/* Welcome screen / Profile form / Chat messages */}
        {!loading && !topChallenges && (
          <>
            {/* Welcome screen */}
            {showWelcomeScreen && !isProfiling && (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-primary">
                <img src={theme === 'dark' ? assets.logo_dark_mode : assets.logo_light_mode} alt="Welcome Logo" className="w-full max-w-56 sm:max-w-68" />

                <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">Ask me anything.</p>

                <button
                  onClick={() => setIsProfiling(true)}
                  className="mt-8 px-6 py-3 bg-[#80609F] text-white text-lg font-semibold rounded-full shadow-lg hover:bg-[#6A4D85] transition duration-200 dark:bg-primary dark:text-gray-900 dark:hover:bg-[#E6CCFF]"
                >
                  Find New Problem
                </button>
              </div>
            )}

            {/* Profile form */}
            {showWelcomeScreen && isProfiling && (
              <div className="h-full flex items-center justify-center">
                <ProfileForm />
              </div>
            )}

            {/* If a chat is selected and has messages, show them */}
            {!showWelcomeScreen && selectedChat && messages.length > 0 && messages.map((msg, index) => <Message key={index} message={msg} />)}
          </>
        )}
      </div>

      {/* Prompt Input Box (visible only when a chat is active and not loading/results) */}
      {selectedChat && !loading && !topChallenges && (
        <form
          onSubmit={onSubmit}
          className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
        >
          <input
            autoFocus
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            type="text"
            placeholder="Type your prompt here..."
            className="flex-1 w-full text-sm outline-none bg-transparent"
            required
          />

          <button disabled={loading} type="submit">
            <img src={loading ? assets.stop_icon : assets.send_icon} className="w-8 cursor-pointer" alt={loading ? 'Stop' : 'Send'} />
          </button>
        </form>
      )}
    </div>
  );
};

export default ChatWindow;
