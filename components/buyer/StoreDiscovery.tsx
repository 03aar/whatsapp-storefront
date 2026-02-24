import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { STORE_CATEGORIES } from '../../constants';

interface StoreDiscoveryProps {
  onSelectStore: (storeId: string) => void;
  onNavigate: (view: string) => void;
}

const StoreDiscovery: React.FC<StoreDiscoveryProps> = ({ onSelectStore, onNavigate }) => {
  const { user } = useAuth();
  const { stores, getStoreProducts } = useStore();
  const { getUserConversations } = useChat();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const recentChats = user ? getUserConversations(user.id, 'buyer').slice(0, 3) : [];

  const filteredStores = stores.filter(s => {
    if (!s.isSetupComplete) return false;
    const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || s.setupAnswers.primaryCategory === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getTimeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">
          {(() => {
            const h = new Date().getHours();
            if (h < 12) return 'Good morning';
            if (h < 18) return 'Good afternoon';
            return 'Good evening';
          })()}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-gray-500">Discover stores and start shopping through chat.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="input pl-12 py-3"
          placeholder="Search stores..."
        />
      </div>

      {/* Recent chats */}
      {recentChats.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Recent Conversations</h2>
          <div className="space-y-2">
            {recentChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => onNavigate('buyer-chat')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                  {chat.storeName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{chat.storeName}</span>
                    <span className="text-xs text-gray-400">{getTimeAgo(chat.lastMessageAt)}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{chat.lastMessage || 'Start chatting...'}</p>
                </div>
                {chat.unreadBuyer > 0 && (
                  <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                    {chat.unreadBuyer}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {['All', 'Fashion', 'Electronics', 'Food', 'Home', 'Beauty'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stores grid */}
      <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-4">Browse Stores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {filteredStores.map(store => {
          const productCount = getStoreProducts(store.id).length;
          return (
            <button
              key={store.id}
              onClick={() => onSelectStore(store.id)}
              className="card p-0 overflow-hidden text-left group cursor-pointer"
            >
              <div className="h-28 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                {store.banner && (
                  <img src={store.banner} alt={store.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-4 -mt-6 relative">
                <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold shadow-lg mb-2 text-sm">
                  {store.logo?.length === 1 ? store.logo : store.name.charAt(0)}
                </div>
                <h3 className="font-bold mb-1">{store.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{store.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {store.rating || 'New'}
                  </span>
                  <span>{productCount} product{productCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <p className="text-gray-400 font-medium">No stores found</p>
          <p className="text-sm text-gray-300 mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default StoreDiscovery;
