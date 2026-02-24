import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { useChat } from '../../contexts/ChatContext';
import { BRAND_NAME } from '../../constants';
import { AppView } from '../../types';

interface SellerDashboardProps {
  activeView: AppView;
  onNavigate: (view: string) => void;
  children: React.ReactNode;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ activeView, onNavigate, children }) => {
  const { user, logout } = useAuth();
  const { getStoreByOwner } = useStore();
  const { getUnreadCount } = useChat();

  const store = user ? getStoreByOwner(user.id) : undefined;
  const unread = user ? getUnreadCount(user.id, 'seller') : 0;

  const navItems = [
    { id: 'seller-dashboard', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )},
    { id: 'seller-chat', label: 'Messages', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    ), badge: unread },
    { id: 'seller-products', label: 'Products', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    )},
    { id: 'seller-orders', label: 'Orders', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
    )},
    { id: 'seller-settings', label: 'Settings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-40 hidden lg:flex">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">C</div>
            <span className="font-bold text-lg tracking-tight">{BRAND_NAME}</span>
          </div>
        </div>

        {/* Store info */}
        {store && (
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 text-success rounded-lg flex items-center justify-center font-bold text-sm">
                {store.logo?.length === 1 ? store.logo : store.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{store.name}</div>
                <div className="text-xs text-gray-400">Seller</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-item w-full ${activeView === item.id ? 'active' : ''}`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge ? (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-500">
              {user?.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64">
        {/* Top bar (mobile) */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">C</div>
              <span className="font-bold">{store?.name || BRAND_NAME}</span>
            </div>
            <div className="flex items-center gap-1">
              {navItems.slice(0, 4).map(item => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`p-2.5 rounded-lg transition-colors relative ${activeView === item.id ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  {item.icon}
                  {item.badge ? (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
