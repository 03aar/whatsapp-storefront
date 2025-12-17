
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import SettingsView from './components/SettingsView';
import InfoPage from './components/InfoPage';
import Inventory from './components/Inventory';
import { AppView, Product, CartItem, Order, AppSettings } from './types';
import { MOCK_PRODUCTS, ORDER_STATUSES, BRAND_NAME } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Settings / Store Profile
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    darkMode: false,
    storeProfile: {
      shopName: 'My Awesome Shop',
      whatsappNumber: '15550123456', // Mock number
      currency: '$',
      description: 'The best products delivered directly to you.',
      themeColor: '#000000',
      categories: ['All', 'Fashion', 'Home', 'Electronics']
    },
    slackConnected: false,
    whatsappConnected: false,
    crmSync: { hubspot: false, salesforce: false },
    automationRules: []
  });

  const [activeCategory, setActiveCategory] = useState('All');

  // Initialization
  useEffect(() => {
    // Load local storage or seed
    const savedProducts = localStorage.getItem('shopsmart_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(MOCK_PRODUCTS); // Seed from constants
    }

    const savedOrders = localStorage.getItem('shopsmart_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    const savedSettings = localStorage.getItem('shopsmart_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  // Save on Change
  useEffect(() => {
    localStorage.setItem('shopsmart_products', JSON.stringify(products));
    localStorage.setItem('shopsmart_orders', JSON.stringify(orders));
    localStorage.setItem('shopsmart_settings', JSON.stringify(settings));
  }, [products, orders, settings]);

  const handleNav = (target: string) => {
    setView(target as AppView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, cartId: Math.random().toString(36), quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (item: CartItem) => {
    setCart(prev => prev.filter(i => i.cartId !== item.cartId));
  };

  // Checkout Logic (WhatsApp)
  const handleCheckout = () => {
    if (cart.length === 0) return;

    // 1. Create the Order Record locally
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      customerName: 'Guest Customer', // In real app, ask this first
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'new',
      timestamp: Date.now(),
      method: 'whatsapp'
    };
    setOrders(prev => [newOrder, ...prev]);

    // 2. Construct WhatsApp Message
    const lineItems = cart.map(i => `• ${i.name} x${i.quantity} (${settings.storeProfile.currency}${i.price * i.quantity})`).join('%0a');
    const total = settings.storeProfile.currency + newOrder.total;
    const text = `Hello *${settings.storeProfile.shopName}*, I'd like to place an order:%0a%0a${lineItems}%0a%0a*Total: ${total}*%0a%0aOrder Ref: ${newOrder.id}`;
    
    // 3. Redirect
    window.open(`https://wa.me/${settings.storeProfile.whatsappNumber}?text=${text}`, '_blank');
    
    // 4. Clear Cart
    setCart([]);
    setIsCartOpen(false);
  };

  // Product Management Logic
  const handleProductUpdate = (product: Product, action: 'add' | 'update' | 'delete') => {
    if (action === 'add') {
      setProducts(prev => [product, ...prev]);
    } else if (action === 'update') {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else if (action === 'delete') {
      setProducts(prev => prev.filter(p => p.id !== product.id));
    }
  };

  // Render Helpers
  const renderDashboard = () => (
    <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b-4 border-black pb-6 md:pb-8 gap-6">
        <div>
          <span className="clay-text-convex mb-4 bg-black text-white border-none">Merchant Console</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Orders</h1>
        </div>
        <div className="text-left md:text-right w-full md:w-auto bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">
          <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px] md:text-xs">Total Revenue</p>
          <p className="text-3xl md:text-4xl font-black">{settings.storeProfile.currency}{orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {orders.length === 0 ? (
          <div className="p-12 md:p-20 text-center opacity-30 font-black uppercase tracking-widest bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            No orders yet. Share your shop link!
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="clay-card p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between md:justify-start gap-3 mb-2">
                  <span className="text-xs font-black bg-gray-100 px-2 py-1 rounded uppercase tracking-wider">{order.id}</span>
                  <span className="text-xs font-bold text-gray-400">{new Date(order.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="font-bold text-lg">{order.items.length} Items</div>
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {order.items.map(i => i.name).join(', ')}
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div className="text-xl md:text-2xl font-black">{settings.storeProfile.currency}{order.total}</div>
                <select 
                  value={order.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as Order['status'];
                    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                  }}
                  className="clay-pill-container px-4 py-2 font-bold uppercase text-[10px] md:text-xs outline-none cursor-pointer"
                  style={{ color: ORDER_STATUSES.find(s => s.id === order.status)?.color }}
                >
                  {ORDER_STATUSES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-black font-sans selection:bg-black selection:text-white flex flex-col overflow-hidden">
      <Navbar onNavClick={handleNav} activeView={view} />
      
      <main className="flex-grow">
        {view === 'landing' && (
           <div className="animate-fade-in">
              <Hero onStart={() => handleNav('store')} />
              <div className="py-12 md:py-20 bg-black text-white text-center">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-8">Sample Storefronts</h2>
                <div className="flex justify-center gap-4 flex-wrap px-4">
                   <button onClick={() => { setProducts(MOCK_PRODUCTS); handleNav('store'); }} className="clay-button bg-white text-black px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm">Sneaker Shop</button>
                   <button onClick={() => handleNav('store')} className="clay-button bg-white text-black px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm">Coffee Roaster</button>
                </div>
              </div>
              <Footer onLinkClick={(e, id) => { e.preventDefault(); handleNav(id); }} />
           </div>
        )}

        {view === 'store' && (
          <div className="pt-28 md:pt-32 pb-24">
             {/* Store Header */}
             <div className="text-center mb-10 md:mb-16 px-4 md:px-6">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-black text-white mx-auto flex items-center justify-center text-3xl md:text-4xl font-black rounded-2xl md:rounded-3xl mb-4 md:mb-6 shadow-2xl">
                 {settings.storeProfile.shopName.charAt(0)}
               </div>
               <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-2 leading-none">{settings.storeProfile.shopName}</h1>
               <p className="text-gray-500 font-bold max-w-lg mx-auto text-sm md:text-base leading-relaxed px-4">{settings.storeProfile.description}</p>
               
               {/* Categories - Horizontal Scroll on Mobile */}
               <div className="flex justify-start md:justify-center gap-3 mt-8 overflow-x-auto pb-4 no-scrollbar px-2 -mx-4 md:mx-0 snap-x">
                 {settings.storeProfile.categories.map(cat => (
                   <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 snap-center px-5 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-black text-white shadow-lg' : 'bg-white border border-gray-200 hover:border-black'}`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
             </div>

             <ProductGrid 
                papers={activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory)}
                onProductClick={(p) => addToCart(p)} // Simplified for demo: clicking adds to cart
                onUpvote={() => {}}
                userUpvotes={[]}
                onPublisherClick={() => {}}
                onToggleSave={() => {}}
                savedPaperIds={[]}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                hideFilters={true}
             />

             {/* Floating Cart Button */}
             {cart.length > 0 && (
               <button 
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-2xl font-black uppercase tracking-widest flex items-center gap-3 animate-bounce hover:scale-105 transition-transform"
               >
                 <span className="text-xs md:text-sm">Cart ({cart.length})</span>
                 <div className="w-5 h-5 md:w-6 md:h-6 bg-white text-black rounded-full flex items-center justify-center text-[10px] md:text-xs">
                   {cart.length}
                 </div>
               </button>
             )}
          </div>
        )}

        {view === 'dashboard' && renderDashboard()}

        {view === 'inventory' && (
           <Inventory 
             products={products}
             onUpdateProduct={handleProductUpdate}
             currency={settings.storeProfile.currency}
           />
        )}

        {view === 'settings' && (
           <SettingsView 
             settings={settings}
             onUpdate={(updates) => setSettings(prev => ({ ...prev, ...updates }))}
             shopName={settings.storeProfile.shopName}
             onShopNameChange={(n) => setSettings(prev => ({ ...prev, storeProfile: { ...prev.storeProfile, shopName: n } }))}
           />
        )}

        {['privacy', 'terms', 'help'].includes(view) && (
           <InfoPage pageId={view} />
        )}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemoveItem={removeFromCart}
        onItemClick={() => {}}
      />
      
      {/* Checkout injection for CartDrawer overlay - optimized for mobile safe area */}
      {isCartOpen && cart.length > 0 && (
        <div className="fixed bottom-0 right-0 w-full md:w-[450px] bg-white border-t border-gray-100 p-6 pb-8 md:pb-6 z-[10002] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
           <div className="flex justify-between items-center mb-4">
             <span className="font-bold text-gray-500 text-sm md:text-base">Total</span>
             <span className="text-2xl font-black">{settings.storeProfile.currency}{cart.reduce((a,b) => a + (b.price * b.quantity), 0)}</span>
           </div>
           <button 
            onClick={handleCheckout}
            className="w-full py-4 bg-[#25D366] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98]"
           >
             <span className="text-xl">💬</span> <span className="text-xs md:text-sm">Order via WhatsApp</span>
           </button>
        </div>
      )}
    </div>
  );
};

export default App;
