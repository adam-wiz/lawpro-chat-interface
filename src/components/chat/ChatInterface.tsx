import React, { useState } from 'react';
import { Search, Mic, Copy, ThumbsUp, ThumbsDown, Clock, Lock, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConversationHistory from './ConversationHistory';
import ChatMessage from './ChatMessage';

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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
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
              <div className="max-w-md w-full text-center space-y-6">
                <h1 className="font-semibold text-4xl text-zinc-900">
                  Have a legal question?
                </h1>
                <p className="text-lg font-thin text-zinc-500">
                  Ask me below about your situation, and I'll explain what it all means in language that actually makes sense.
                </p>
                
                {/* Updated feature items to match the badge */}
                <div className="grid grid-cols-1 gap-4 mt-8">
                  
                  <div className="flex items-center justify-center bg-[#FFF9E5] border border-[#E9DFA8] rounded-full py-3 px-6">
                    <Clock className="text-amber-700 mr-2" size={20} />
                    <span className="text-amber-800 font-medium">Available 24/7</span>
                  </div>
                  
                  <div className="flex items-center justify-center bg-[#FFF9E5] border border-[#E9DFA8] rounded-full py-3 px-6">
                    <Lock className="text-amber-700 mr-2" size={20} />
                    <span className="text-amber-800 font-medium">Chats Securely Encrypted</span>
                  </div>
                  
                  <div className="flex items-center justify-center bg-[#FFF9E5] border border-[#E9DFA8] rounded-full py-3 px-6">
                    <Users className="text-amber-700 mr-2" size={20} />
                    <span className="text-amber-800 font-medium">For The People</span>
                  </div>
                </div>
              </div>
            </div>}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask your legal question in everyday language..." className="w-full py-3 pr-12 text-gray-800 border-gray-300 rounded-lg focus:border-blue-700 focus:ring-1 focus:ring-blue-700" />
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
      </div>
    </div>;
};

export default ChatInterface;
