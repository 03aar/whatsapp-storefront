import React, { useRef, useState, useEffect } from 'react';
import { DEMO_STORE, DEMO_STORE_2, DEMO_STORE_3, DEMO_PRODUCTS } from '../../constants';
import { Store } from '../../types';

interface FeaturedStoresProps {
  onStartShopping: () => void;
}

const TiltCard: React.FC<{ store: Store; productCount: number; delay: number; visible: boolean }> = ({ store, productCount, delay, visible }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
  };

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm cursor-pointer transition-all duration-700 hover:shadow-2xl hover:shadow-black/10 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      style={{ transitionDelay: `${delay}ms`, transformStyle: 'preserve-3d', willChange: 'transform' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-36 relative overflow-hidden">
        {store.banner && (
          <img src={store.banner} alt={store.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" loading="lazy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {/* Sales badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-bold text-primary shadow-sm">
          {store.totalSales} sales
        </div>
      </div>
      <div className="p-5 -mt-8 relative" style={{ transform: 'translateZ(20px)' }}>
        <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg ring-4 ring-white mb-3">
          {store.logo}
        </div>
        <h3 className="font-bold text-lg mb-1">{store.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{store.description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            {store.rating}
          </span>
          <span>{productCount} products</span>
        </div>
      </div>
    </div>
  );
};

const FeaturedStores: React.FC<FeaturedStoresProps> = ({ onStartShopping }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stores = [DEMO_STORE, DEMO_STORE_2, DEMO_STORE_3];

  return (
    <section ref={ref} className="py-24 sm:py-32 px-4 bg-[#FAFBFC] relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14">
          <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success-dark rounded-full text-sm font-semibold mb-4">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse-dot" />
              Live Stores
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Discover Stores
            </h2>
          </div>
          <button onClick={onStartShopping} className={`btn btn-outline mt-4 md:mt-0 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Browse All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {stores.map((store, i) => (
            <TiltCard
              key={store.id}
              store={store}
              productCount={DEMO_PRODUCTS.filter(p => p.storeId === store.id).length}
              delay={i * 200}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStores;
