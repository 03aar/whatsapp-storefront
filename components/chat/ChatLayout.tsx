import React, { useState } from 'react';
import { Conversation } from '../../types';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

interface ChatLayoutProps {
  initialConversationId?: string | null;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ initialConversationId }) => {
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [showList, setShowList] = useState(true);

  const handleSelect = (convo: Conversation) => {
    setSelectedConvo(convo);
    setShowList(false);
  };

  const handleBack = () => {
    setShowList(true);
    setSelectedConvo(null);
  };

  return (
    <div className="card overflow-hidden" style={{ height: 'calc(100vh - 140px)', minHeight: '500px' }}>
      <div className="flex h-full">
        {/* Conversation list */}
        <div className={`w-full md:w-80 border-r border-gray-100 shrink-0 ${!showList && selectedConvo ? 'hidden md:block' : 'block'}`}>
          <ConversationList
            activeConversationId={selectedConvo?.id || initialConversationId || null}
            onSelectConversation={handleSelect}
          />
        </div>

        {/* Chat window */}
        <div className={`flex-1 flex flex-col ${showList && !selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          {selectedConvo ? (
            <>
              {/* Mobile back button */}
              <div className="md:hidden flex items-center gap-2 p-3 border-b border-gray-100 bg-white">
                <button onClick={handleBack} className="btn btn-ghost text-xs p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <ChatWindow conversation={selectedConvo} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50/30">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <p className="text-gray-400 font-medium">Select a conversation</p>
                <p className="text-gray-300 text-sm mt-1">Choose from the list to start chatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
