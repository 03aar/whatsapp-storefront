import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { Conversation } from '../../types';

interface ConversationListProps {
  activeConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ activeConversationId, onSelectConversation }) => {
  const { user } = useAuth();
  const { getUserConversations } = useChat();

  const role = user?.role || 'buyer';
  const conversations = user ? getUserConversations(user.id, role) : [];

  const getTimeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 shrink-0">
        <h2 className="font-bold text-lg">Messages</h2>
        <p className="text-xs text-gray-400 mt-0.5">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <p className="text-gray-400 text-sm font-medium">No conversations yet</p>
            <p className="text-gray-300 text-xs mt-1">
              {role === 'buyer' ? 'Browse stores and start chatting!' : 'Conversations will appear when customers message you.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {conversations.map(convo => {
              const unread = role === 'buyer' ? convo.unreadBuyer : convo.unreadSeller;
              const displayName = role === 'buyer' ? convo.storeName : convo.buyerName;
              const displayInitial = displayName.charAt(0);
              const isActive = convo.id === activeConversationId;

              return (
                <button
                  key={convo.id}
                  onClick={() => onSelectConversation(convo)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-gray-50 ${isActive ? 'bg-primary/5 border-r-2 border-primary' : ''}`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {displayInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`font-semibold text-sm ${unread > 0 ? 'text-primary' : ''}`}>{displayName}</span>
                      <span className="text-[10px] text-gray-400 shrink-0">{getTimeAgo(convo.lastMessageAt)}</span>
                    </div>
                    <p className={`text-xs truncate ${unread > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                      {convo.lastMessage || 'Start chatting...'}
                    </p>
                  </div>
                  {unread > 0 && (
                    <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
