import { createContext, useEffect, useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";

const AppContext=createContext()

export const AppContextProvider=({children})=>{

    const navigate= useNavigate()
    const [user,setUser]=useState(null);
    const [chats,setChats]=useState([]);
    const [selectedChat,setSelectedChat]=useState(null);
    const [messages, setMessages] = useState([]); // New state for current chat messages
    const [topChallenges, setTopChallenges] = useState(null); // New state for challenges
    const [isProfiling, setIsProfiling] = useState(false); // New state for profiling mode
    // New state to hold the AI output that the user can choose to store in 'My Impact'
    const [currentProjectResult, setCurrentProjectResult] = useState(null); 
    
    const [theme,setTheme] = useState(localStorage.getItem('theme')||'light');


    const fetchUser = async ()=>{
        setUser(dummyUserData)
    }

    const fetchUsersChats= async ()=>{
        setChats(dummyChats)
        setSelectedChat(dummyChats[0])
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
        setIsProfiling(false); // Assuming new chat is not profiling initially
        navigate('/');
    }

    // Toggle theme logic (Uncommented and improved)
    useEffect(()=>{
        if(theme ==='dark'){
            document.documentElement.classList.add('dark');
        }else{
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme)
    },[theme])
    
    useEffect(()=>{
        if (user){
            fetchUsersChats()
        }
        else{
            setChats([])
            setSelectedChat(null)
        }
    },[user])

    useEffect (()=>{
        fetchUser()
        // Issue 5: When the site opens, start a new chat, not an old one.
        startNewChat() 
    },[])

    
    const value={
        navigate, user, setUser, fetchUser,chats,setChats,selectedChat,setSelectedChat,
        theme, setTheme,
        messages, setMessages,
        topChallenges, setTopChallenges,
        isProfiling, setIsProfiling,
        currentProjectResult, setCurrentProjectResult, // Added new project state
        startNewChat, // Added new chat function
        clearChatHistory // Added clear history function
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext=()=> useContext(AppContext)