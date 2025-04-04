
import React from 'react';
import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from './ChatInterface';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] ${
          isUser
            ? 'bg-blue-500 text-white px-4 py-2 pb-1 rounded-2xl' // Increased horizontal padding, reduced bottom padding
            : 'text-gray-800' // No background for LawPro messages
        }`}
      >
        <div className="text-sm">
          {message.text}
        </div>
        
        <div className="mt-2 flex items-center justify-start">
          {!isUser && (
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 rounded-full p-0 text-gray-500 hover:text-blue-700 hover:bg-blue-50"
                onClick={handleCopy}
                title="Copy"
              >
                <Copy size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 rounded-full p-0 text-gray-500 hover:text-green-700 hover:bg-green-50"
                title="Helpful"
              >
                <ThumbsUp size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 rounded-full p-0 text-gray-500 hover:text-red-700 hover:bg-red-50"
                title="Not helpful"
              >
                <ThumbsDown size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
