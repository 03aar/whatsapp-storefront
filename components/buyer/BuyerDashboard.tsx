import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { useStore } from '../../contexts/StoreContext';
import { BRAND_NAME } from '../../constants';
import { AppView } from '../../types';

interface BuyerDashboardProps {
  activeView: AppView;
  onNavigate: (view: string) => void;
  onOpenCart: () => void;
  children: React.ReactNode;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ activeView, onNavigate, onOpenCart, children }) => {
  const { user } = useAuth();
  const { getUnreadCount } = useChat();
  const { cart } = useStore();

  const unread = user ? getUnreadCount(user.id, 'buyer') : 0;

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Top nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('buyer-home')}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">C</div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">{BRAND_NAME}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Home */}
            <button
              onClick={() => onNavigate('buyer-home')}
              className={`p-2.5 rounded-lg transition-colors ${activeView === 'buyer-home' || activeView === 'buyer-store' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </button>

            {/* Chat */}
            <button
              onClick={() => onNavigate('buyer-chat')}
              className={`p-2.5 rounded-lg transition-colors relative ${activeView === 'buyer-chat' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>

            {/* Orders */}
            <button
              onClick={() => onNavigate('buyer-orders')}
              className={`p-2.5 rounded-lg transition-colors ${activeView === 'buyer-orders' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </button>

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className="p-2.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-success text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Profile */}
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-500 ml-1 cursor-pointer hover:bg-gray-200 transition-colors"
                 onClick={() => onNavigate('landing')}>
              {user?.avatar}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
};

export default BuyerDashboard;
