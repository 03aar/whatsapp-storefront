import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Product } from '../../types';
import ProductCard from './ProductCard';

interface StoreViewProps {
  storeId: string;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onOpenChat: (storeId: string) => void;
  onViewCart: () => void;
  cartItemCount: number;
}

const StoreView: React.FC<StoreViewProps> = ({ storeId, onBack, onAddToCart, onOpenChat, onViewCart, cartItemCount }) => {
  const { getStore, getStoreProducts } = useStore();
  const store = getStore(storeId);
  const products = getStoreProducts(storeId);
  const [activeCategory, setActiveCategory] = useState('All');

  if (!store) return null;

  const filteredProducts = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="btn btn-ghost text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <button onClick={() => onOpenChat(storeId)} className="btn btn-outline text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          Chat with Seller
        </button>
      </div>

      {/* Store banner & info */}
      <div className="card overflow-hidden mb-8">
        <div className="h-36 md:h-48 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
          {store.banner && (
            <img src={store.banner} alt={store.name} className="w-full h-full object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className="p-6 -mt-10 relative">
          <div className="flex items-end gap-4">
            <div className="w-16 h-16 bg-primary text-white rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-white">
              {store.logo?.length === 1 ? store.logo : store.name.charAt(0)}
            </div>
            <div className="flex-1 pb-1">
              <h1 className="text-xl font-bold">{store.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {store.rating || 'New'}
                </span>
                <span>{products.length} products</span>
                <span>{store.totalSales} sales</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">{store.description}</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {store.categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pb-24 stagger-children">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            currency={store.currency}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 font-medium">No products in this category</p>
        </div>
      )}

      {/* Floating cart bar */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <button
            onClick={onViewCart}
            className="flex items-center gap-4 bg-primary text-white px-6 py-4 rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span className="font-semibold">View Cart</span>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">{cartItemCount} items</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreView;
