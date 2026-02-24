/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StoreProvider, useStore } from './contexts/StoreContext';
import { ChatProvider, useChat } from './contexts/ChatContext';
import { AppView, Product } from './types';

// Landing
import LandingPage from './components/landing/LandingPage';

// Auth
import AuthModal from './components/auth/AuthModal';

// Seller
import SellerDashboard from './components/seller/SellerDashboard';
import SellerHome from './components/seller/SellerHome';
import StoreSetupWizard from './components/seller/StoreSetupWizard';
import ProductManager from './components/seller/ProductManager';
import OrderManager from './components/seller/OrderManager';
import SellerSettings from './components/seller/SellerSettings';

// Buyer
import BuyerDashboard from './components/buyer/BuyerDashboard';
import StoreDiscovery from './components/buyer/StoreDiscovery';
import StoreView from './components/buyer/StoreView';
import CartSheet from './components/buyer/CartSheet';

// Chat
import ChatLayout from './components/chat/ChatLayout';

// Buyer order history (inline component)
const BuyerOrders: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { getBuyerOrders } = useStore();
  const orders = user ? getBuyerOrders(user.id) : [];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <p className="text-gray-400 font-medium mb-1">No orders yet</p>
          <p className="text-sm text-gray-300">Your order history will appear here.</p>
          <button onClick={() => onNavigate('buyer-home')} className="btn btn-primary mt-4 text-sm">Browse Stores</button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-mono text-sm font-semibold">{order.id}</span>
                  <span className={`ml-2 badge text-[10px] ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <span className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-sm text-gray-500 mb-2">From: {order.storeName}</div>
              <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 shrink-0">
                    <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                      {item.productImage && <img src={item.productImage} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-xs">{item.productName} x{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold">${order.total.toFixed(2)}</span>
                <button onClick={() => onNavigate('buyer-chat')} className="btn btn-ghost text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart, cart, clearCart, getCartByStore, createOrder, getStore, getStoreByOwner } = useStore();
  const { createConversation, getConversationByParties, sendMessage } = useChat();

  const [view, setView] = useState<AppView>('landing');
  const [showAuth, setShowAuth] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'seller' | 'buyer'>('buyer');
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [chatConvoId, setChatConvoId] = useState<string | null>(null);

  const navigate = useCallback((v: string) => {
    if (v === 'landing') {
      setView('landing');
      setShowAuth(false);
    } else {
      setView(v as AppView);
    }
    window.scrollTo({ top: 0 });
  }, []);

  const handleStartSelling = () => {
    if (isAuthenticated && user?.role === 'seller') {
      const store = getStoreByOwner(user.id);
      if (store?.isSetupComplete) {
        navigate('seller-dashboard');
      } else {
        navigate('seller-setup');
      }
    } else {
      setAuthDefaultRole('seller');
      setShowAuth(true);
    }
  };

  const handleStartShopping = () => {
    if (isAuthenticated && user?.role === 'buyer') {
      navigate('buyer-home');
    } else {
      setAuthDefaultRole('buyer');
      setShowAuth(true);
    }
  };

  const handleAuthSuccess = (role: 'seller' | 'buyer') => {
    setShowAuth(false);
    if (role === 'seller') {
      navigate('seller-setup');
    } else {
      navigate('buyer-home');
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      storeId: product.storeId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const handleCheckoutViaChat = (storeId: string) => {
    if (!user) return;
    const store = getStore(storeId);
    if (!store) return;

    const cartItems = getCartByStore(storeId);
    if (cartItems.length === 0) return;

    // Find or create conversation
    let convo = getConversationByParties(user.id, storeId);
    if (!convo) {
      convo = createConversation({
        storeId: store.id,
        storeName: store.name,
        buyerId: user.id,
        buyerName: user.name,
        sellerId: store.sellerId,
        sellerName: 'Seller',
      });
    }

    // Create order
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = createOrder({
      storeId: store.id,
      storeName: store.name,
      buyerId: user.id,
      buyerName: user.name,
      sellerId: store.sellerId,
      items: cartItems.map(item => ({
        productId: item.productId,
        productName: item.name,
        productImage: item.image,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: '',
      conversationId: convo.id,
    });

    // Send order card in chat
    sendMessage({
      conversationId: convo.id,
      senderId: 'system',
      senderName: 'System',
      senderRole: 'system',
      type: 'order_card',
      content: `New order placed: ${store.currency}${total.toFixed(2)}`,
      metadata: { orderId: order.id },
    });

    // Clear cart
    clearCart();
    setIsCartOpen(false);

    // Navigate to chat
    setChatConvoId(convo.id);
    navigate('buyer-chat');
  };

  const handleOpenChat = (storeId: string) => {
    if (!user) return;
    const store = getStore(storeId);
    if (!store) return;

    let convo = getConversationByParties(user.id, storeId);
    if (!convo) {
      convo = createConversation({
        storeId: store.id,
        storeName: store.name,
        buyerId: user.id,
        buyerName: user.name,
        sellerId: store.sellerId,
        sellerName: 'Seller',
      });

      sendMessage({
        conversationId: convo.id,
        senderId: 'system',
        senderName: 'System',
        senderRole: 'system',
        type: 'system',
        content: `Welcome to ${store.name}! Feel free to ask any questions.`,
      });
    }

    setChatConvoId(convo.id);
    navigate('buyer-chat');
  };

  // ========================
  // RENDER
  // ========================

  // Landing page (unauthenticated or explicitly navigated)
  if (view === 'landing') {
    return (
      <>
        <LandingPage onStartSelling={handleStartSelling} onStartShopping={handleStartShopping} />
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultRole={authDefaultRole} onSuccess={handleAuthSuccess} />
      </>
    );
  }

  // Seller setup wizard
  if (view === 'seller-setup' && user?.role === 'seller') {
    return (
      <StoreSetupWizard onComplete={() => navigate('seller-dashboard')} />
    );
  }

  // Seller dashboard views
  if (view.startsWith('seller-') && user?.role === 'seller') {
    return (
      <SellerDashboard activeView={view} onNavigate={navigate}>
        {view === 'seller-dashboard' && <SellerHome onNavigate={navigate} />}
        {view === 'seller-products' && <ProductManager />}
        {view === 'seller-orders' && (
          <OrderManager onNavigateToChat={(convoId) => { setChatConvoId(convoId); navigate('seller-chat'); }} />
        )}
        {view === 'seller-chat' && <ChatLayout initialConversationId={chatConvoId} />}
        {view === 'seller-settings' && <SellerSettings />}
      </SellerDashboard>
    );
  }

  // Buyer dashboard views
  if (view.startsWith('buyer-') && user?.role === 'buyer') {
    return (
      <>
        <BuyerDashboard activeView={view} onNavigate={navigate} onOpenCart={() => setIsCartOpen(true)}>
          {view === 'buyer-home' && (
            <StoreDiscovery
              onSelectStore={(id) => { setActiveStoreId(id); navigate('buyer-store'); }}
              onNavigate={navigate}
            />
          )}
          {view === 'buyer-store' && activeStoreId && (
            <StoreView
              storeId={activeStoreId}
              onBack={() => navigate('buyer-home')}
              onAddToCart={handleAddToCart}
              onOpenChat={handleOpenChat}
              onViewCart={() => setIsCartOpen(true)}
              cartItemCount={cart.length}
            />
          )}
          {view === 'buyer-chat' && <ChatLayout initialConversationId={chatConvoId} />}
          {view === 'buyer-orders' && <BuyerOrders onNavigate={navigate} />}
        </BuyerDashboard>

        <CartSheet
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckoutViaChat}
        />
      </>
    );
  }

  // Fallback: show landing
  return (
    <>
      <LandingPage onStartSelling={handleStartSelling} onStartShopping={handleStartShopping} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultRole={authDefaultRole} onSuccess={handleAuthSuccess} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StoreProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </StoreProvider>
    </AuthProvider>
  );
};

export default App;
