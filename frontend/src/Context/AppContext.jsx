import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate()
    const { user } = useAuth(); // Use real authenticated user

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [topChallenges, setTopChallenges] = useState(null);
    const [isProfiling, setIsProfiling] = useState(false);
    const [currentProjectResult, setCurrentProjectResult] = useState(null);

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const fetchUsersChats = async () => {
        if (!user) {
            setChats([]);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user.$id || user.user_id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Filter projects that do NOT have a solution plan yet
            const activeProjects = data.filter(project => !project.solution_plan || project.solution_plan.trim() === "");

            // Map projects to chat format for sidebar
            const mappedChats = activeProjects.map(project => ({
                _id: project.id,
                name: project.title,
                updatedAt: project.created_at,
                messages: [{ content: project.original_problem }]
            }));

            setChats(mappedChats);
        } catch (error) {
            console.error("Error fetching chats:", error);
            setChats([]);
        }
    }

    // New Function to clear existing dummy chats
    const clearChatHistory = () => {
        setChats([]);
        setSelectedChat(null);
    }

    // New Function to start a new chat session and reset state
    const startNewChat = () => {
        setSelectedChat(null);
        setMessages([]);
        setTopChallenges(null);
        setIsProfiling(false);
        navigate('/');
    }

    // Function to handle creation of a new chat from a project
    const createNewChat = (newChat) => {
        setChats(prev => [newChat, ...prev]);
        setSelectedChat(newChat);
        setMessages(newChat.messages);
        setTopChallenges(null);
        setIsProfiling(false);
        navigate('/');
    }

    // Toggle theme logic
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    // Fetch chats when user changes
    useEffect(() => {
        if (user) {
            fetchUsersChats()
        } else {
            setChats([])
            setSelectedChat(null)
        }
    }, [user])

    useEffect(() => {
        startNewChat()
    }, [])

    const value = {
        navigate, user, chats, setChats, selectedChat, setSelectedChat,
        theme, setTheme,
        messages, setMessages,
        topChallenges, setTopChallenges,
        isProfiling, setIsProfiling,
        currentProjectResult, setCurrentProjectResult,
        startNewChat,
        createNewChat,
        clearChatHistory
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)