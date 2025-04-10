import React, { useState, useEffect } from 'react';
import { Search, Mic, Plus, MoreHorizontal, Clock, Lock, Users, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConversationHistory from './ConversationHistory';
import ChatMessage from './ChatMessage';
import { useIsMobile } from '@/hooks/use-mobile';

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
}

export interface Message {
  id: string;
  sender: 'user' | 'lawpro';
  text: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animatePlaceholder, setAnimatePlaceholder] = useState(true);
  const isMobile = useIsMobile();

  // Array of rotating placeholder questions - Rebalanced with more criminal and personal injury questions
  const placeholders = [
    "Ask your legal question here...",
    // Criminal Law - More focus
    "Do I need to tell my employer about a DUI?",
    "What's the difference between a felony and misdemeanor?",
    "Should I accept a plea bargain in my case?",
    "How can I get my criminal record expunged?",
    "What are my rights during a police search?",
    "Can a DUI be reduced to a lesser charge?",
    "What happens if I miss a court appearance?",
    "How does probation work?",
    "What's the statute of limitations for theft?",
    // Personal Injury - More focus
    "What's the average settlement for a truck accident?",
    "How long do I have to file a personal injury claim?",
    "Who pays my medical bills after a car accident?",
    "Can I sue if I slipped and fell in a store?",
    "What compensation can I get for a workplace injury?",
    "How does insurance factor into my injury case?",
    "Can I be compensated for pain and suffering?",
    "What if I was partially at fault in an accident?",
    "Do I need a lawyer for a minor injury claim?",
    // Family Law - Just a few questions
    "How is child custody determined in my state?",
    "What happens if I can't pay child support?",
    "How do I fight a wrongful eviction?",
    // Other Legal Issues
    "Can I sue my neighbor for property damage?",
  ];

  // Get the current placeholder based on animation state
  const getCurrentPlaceholder = () => {
    return animatePlaceholder ? placeholders[placeholderIndex] : "Ask your legal question here...";
  };

  // Effect for rotating placeholders - only active when animatePlaceholder is true
  useEffect(() => {
    if (!animatePlaceholder) return;
    
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [animatePlaceholder]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Turn off placeholder animation after first message
    if (animatePlaceholder) {
      setAnimatePlaceholder(false);
    }
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    if (!currentConversation) {
      // Create a new conversation
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        title: inputValue.substring(0, 30) + (inputValue.length > 30 ? '...' : ''),
        createdAt: new Date(),
        messages: [newMessage]
      };
      setConversations([newConversation, ...conversations]);
      setCurrentConversation(newConversation);

      // Automatically respond with greeting
      setTimeout(() => {
        const greeting = userName ? `Hey ${userName}! Nice to meet you—what can I help you with today?` : "Hey there! Nice to meet you—what can I help you with today?";
        const lawproResponse: Message = {
          id: `msg-${Date.now() + 1}`,
          sender: 'lawpro',
          text: greeting,
          timestamp: new Date()
        };
        const updatedConversation = {
          ...newConversation,
          messages: [...newConversation.messages, lawproResponse]
        };
        setCurrentConversation(updatedConversation);
        setConversations(prevConversations => prevConversations.map(conv => conv.id === updatedConversation.id ? updatedConversation : conv));
      }, 500);
    } else {
      // Add to existing conversation
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, newMessage]
      };
      setCurrentConversation(updatedConversation);
      setConversations(conversations.map(conv => conv.id === currentConversation.id ? updatedConversation : conv));

      // Simulate LawPro response
      setTimeout(() => {
        const lawproResponse: Message = {
          id: `msg-${Date.now() + 1}`,
          sender: 'lawpro',
          text: "I understand your question about legal matters. Here's some information that might help clarify things in simple terms...",
          timestamp: new Date()
        };
        const finalConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, lawproResponse]
        };
        setCurrentConversation(finalConversation);
        setConversations(prevConversations => prevConversations.map(conv => conv.id === finalConversation.id ? finalConversation : conv));
      }, 1000);
    }
    setInputValue('');
  };

  const startNewConversation = () => {
    setCurrentConversation(null);
    setInputValue('');
    // Reset animation when starting a new conversation
    setAnimatePlaceholder(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return <div className="flex h-screen bg-white">
      {/* Sidebar for conversation history */}
      <div className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 md:w-64'} overflow-hidden`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl text-gray-800">Conversations</h2>
            <Button variant="ghost" size="sm" onClick={startNewConversation} className="text-blue-700 hover:bg-blue-50">
              New Chat
            </Button>
          </div>
        </div>
        <ConversationHistory conversations={conversations} setCurrentConversation={setCurrentConversation} />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile sidebar toggle */}
        <div className="block md:hidden p-4 border-b border-gray-200">
          <Button variant="ghost" size="sm" onClick={toggleSidebar}>
            {isSidebarOpen ? 'Hide History' : 'Show History'}
          </Button>
        </div>

        {/* Chat content area */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {currentConversation ? <div className="max-w-2xl mx-auto space-y-4">
              {currentConversation.messages.map(message => <ChatMessage key={message.id} message={message} />)}
            </div> : <div className="h-full flex flex-col items-center justify-center">
              <div className="max-w-2xl w-full text-center space-y-6 px-4">
                <h1 className="font-semibold text-4xl text-zinc-900">
                  Have a legal question?
                </h1>
                <p className="text-lg font-thin text-zinc-500">
                  Ask me below about your situation, and I'll explain what it all means in language that actually makes sense.
                </p>
                
                {/* Feature items in a responsive layout - UPDATED for desktop and mobile */}
                <div className="flex flex-col md:flex-row md:justify-center md:gap-4 mt-8 mx-auto">
                  <div className="flex flex-row justify-center gap-2 mb-2 md:mb-0">
                    <div className="flex items-center justify-center bg-[#FFF9E5] border border-[#E9DFA8] rounded-full py-1.5 px-3 whitespace-nowrap">
                      <Clock className="text-amber-700 mr-1.5" size={16} />
                      <span className="text-amber-800 font-medium text-xs">Available 24/7</span>
                    </div>
                    
                    <div className="flex items-center justify-center bg-[#FFF9E5] border border-[#E9DFA8] rounded-full py-1.5 px-3 whitespace-nowrap">
                      <Lock className="text-amber-700 mr-1.5" size={16} />
                      <span className="text-amber-800 font-medium text-xs">Securely Encrypted</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center md:justify-start">
                    <div className="flex items-center justify-center bg-[#FFF9E5] border border-[#E9DFA8] rounded-full py-1.5 px-3 whitespace-nowrap">
                      <Users className="text-amber-700 mr-1.5" size={16} />
                      <span className="text-amber-800 font-medium text-xs">For The People</span>
                    </div>
                  </div>
                </div>
                
                {/* New chat input area with send button - UPDATED with animated placeholder */}
                <div className="mt-10 w-full max-w-3xl mx-auto">
                  <div className="rounded-2xl shadow-lg border border-gray-200 bg-white overflow-hidden relative">
                    <div className="py-2 px-4 flex items-center">
                      <input 
                        type="text"
                        placeholder={getCurrentPlaceholder()}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full text-gray-700 outline-none text-sm placeholder-gray-400 mr-2 transition-all duration-300"
                      />
                      <button 
                        onClick={handleSendMessage}
                        className="bg-indigo-700 rounded-md p-2 flex items-center justify-center"
                        aria-label="Send message"
                      >
                        <Send size={18} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </div>

        {/* Input area at bottom */}
        {currentConversation && (
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Input 
                  value={inputValue} 
                  onChange={e => setInputValue(e.target.value)} 
                  onKeyPress={handleKeyPress} 
                  placeholder={getCurrentPlaceholder()}
                  className="w-full py-3 pr-12 text-gray-800 border-gray-300 rounded-lg focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all duration-300" 
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-700" title="Voice Input">
                    <Mic size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-700" onClick={handleSendMessage} title="Send Message">
                    <Search size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>;
};

export default ChatInterface;
