
import React from 'react';
import { Conversation } from './ChatInterface';

interface ConversationHistoryProps {
  conversations: Conversation[];
  setCurrentConversation: (conversation: Conversation) => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  setCurrentConversation,
}) => {
  // Helper function to group conversations by date
  const groupConversationsByDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    return {
      today: conversations.filter(conv => {
        const convDate = new Date(conv.createdAt);
        convDate.setHours(0, 0, 0, 0);
        return convDate.getTime() === today.getTime();
      }),
      yesterday: conversations.filter(conv => {
        const convDate = new Date(conv.createdAt);
        convDate.setHours(0, 0, 0, 0);
        return convDate.getTime() === yesterday.getTime();
      }),
      lastWeek: conversations.filter(conv => {
        const convDate = new Date(conv.createdAt);
        convDate.setHours(0, 0, 0, 0);
        return convDate.getTime() < yesterday.getTime() && convDate.getTime() >= lastWeek.getTime();
      }),
      older: conversations.filter(conv => {
        const convDate = new Date(conv.createdAt);
        convDate.setHours(0, 0, 0, 0);
        return convDate.getTime() < lastWeek.getTime();
      }),
    };
  };

  const groupedConversations = groupConversationsByDate();

  const renderConversationGroup = (title: string, conversations: Conversation[]) => {
    if (conversations.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">{title}</h3>
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <button
                onClick={() => setCurrentConversation(conversation)}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
              >
                <p className="text-sm font-medium text-gray-800 truncate">
                  {conversation.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {conversation.messages.length} messages
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="overflow-y-auto h-full py-2">
      {conversations.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500">
          <p>No conversations yet</p>
        </div>
      ) : (
        <>
          {renderConversationGroup('Today', groupedConversations.today)}
          {renderConversationGroup('Yesterday', groupedConversations.yesterday)}
          {renderConversationGroup('Previous 7 Days', groupedConversations.lastWeek)}
          {renderConversationGroup('Older', groupedConversations.older)}
        </>
      )}
    </div>
  );
};

export default ConversationHistory;
