import React from 'react';
import { DEMO_STORE, DEMO_STORE_2, DEMO_STORE_3, DEMO_PRODUCTS } from '../../constants';
import { Store } from '../../types';

interface FeaturedStoresProps {
  onStartShopping: () => void;
}

const StoreCard: React.FC<{ store: Store; productCount: number }> = ({ store, productCount }) => (
  <div className="card p-0 overflow-hidden group cursor-pointer">
    <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
      {store.banner && (
        <img src={store.banner} alt={store.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
    <div className="p-5 -mt-8 relative">
      <div className="w-14 h-14 bg-primary text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg mb-3">
        {store.logo}
      </div>
      <h3 className="font-bold text-lg mb-1">{store.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{store.description}</p>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          {store.rating}
        </span>
        <span>{productCount} products</span>
        <span>{store.totalSales} sales</span>
      </div>
    </div>
  </div>
);

const FeaturedStores: React.FC<FeaturedStoresProps> = ({ onStartShopping }) => {
  const stores = [DEMO_STORE, DEMO_STORE_2, DEMO_STORE_3];

  return (
    <section className="py-20 md:py-28 px-4 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success-dark rounded-full text-sm font-semibold mb-4">
              Live Stores
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Discover Stores
            </h2>
          </div>
          <button onClick={onStartShopping} className="btn btn-outline mt-4 md:mt-0">
            Browse All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {stores.map(store => (
            <StoreCard
              key={store.id}
              store={store}
              productCount={DEMO_PRODUCTS.filter(p => p.storeId === store.id).length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStores;
