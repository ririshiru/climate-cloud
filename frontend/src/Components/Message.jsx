import React from 'react';
import { assets } from '../assets/assets';
import moment from'moment'
import Markdown from 'react-markdown'

const Message = ({ message }) => {
    // Determine if the message is from the user or the AI/System
    const isUser = message.role === "user";

    return (
        <div className='w-full'>
            
            {/* ----------------- USER MESSAGE (Right-Aligned) ----------------- */}
            {isUser ? (
                <div className='flex items-start justify-end my-4 gap-2'>
                    
                    {/* Message Bubble (Text/Timestamp) */}
                    <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl'>
                        <p className='text-sm dark:text-primary'>{message.content}</p>
                        <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
                            {moment(message.timestamp).fromNow()}
                        </span>
                    </div>
                    
                    {/* User Icon */}
                    <img 
                        src={assets.user_icon} 
                        alt="User Icon" 
                        className='w-8 h-8 rounded-full'
                    />
                </div>

            ) : (

                /* ----------------- AI MESSAGE (Left-Aligned) ----------------- */
                <div className='flex items-start justify-start my-4 gap-2'>
                    
                    {/* AI Icon (Assuming you have an AI icon in your assets) */}
                    {/* Using diamond_icon as a placeholder for the AI icon if no specific 'ai_icon' exists */}
                    <img 
                        src={assets.diamond_icon} 
                        alt="AI Icon" 
                        className='w-8 h-8 rounded-full not-dark:invert'
                    />
                    
                    {/* Message Bubble (Content, potentially with image) */}
                    <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md'>
                        
                        {/* Check for Image Content */}
                        {message.isImage ? (
                            <img 
                                src={message.content} 
                                alt="Generated content" 
                                className="w-full max-w-md mt-2 rounded-md"
                            />
                        ) : (
                            // Text Content
                            <div className='text-sm dark:text-primary space-y-2 markdown-container'>
                                <Markdown>{message.content}</Markdown>
                            </div>
                        )}
                        
                        {/* Timestamp (Fixed placement) */}
                        <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
                            {moment(message.timestamp).fromNow()}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Message;