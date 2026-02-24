import React, { useRef, useState, useEffect } from 'react';

interface CTASectionProps {
  onStartSelling: () => void;
  onStartShopping: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStartSelling, onStartShopping }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animate the seller count
  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const target = 2500;
    const steps = 50;
    const increment = target / steps;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(interval); }
      else setCount(Math.floor(current));
    }, 30);
    return () => clearInterval(interval);
  }, [visible]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative py-28 sm:py-36 px-4 overflow-hidden cursor-default"
      style={{
        background: `radial-gradient(ellipse 80% 70% at ${mousePos.x}% ${mousePos.y}%, rgba(0,200,151,0.15) 0%, transparent 50%),
                     radial-gradient(ellipse 60% 50% at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(15,52,96,0.08) 0%, transparent 50%),
                     linear-gradient(135deg, #1A1A2E 0%, #0F3460 40%, #1A1A2E 100%)`,
        transition: 'background 0.15s ease-out',
      }}
    >
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Floating orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-success/10 rounded-full blur-3xl animate-morph pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-morph pointer-events-none" style={{ animationDelay: '-6s' }} />

      {/* Orbiting ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] border border-white/[0.03] rounded-full" style={{ animation: 'orbitSpin 60s linear infinite' }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] border border-white/[0.05] rounded-full" style={{ animation: 'orbitSpinReverse 45s linear infinite' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 text-success rounded-full text-sm font-semibold mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="w-2 h-2 bg-success rounded-full animate-pulse-dot" />
          {count.toLocaleString()}+ sellers already on board
        </div>

        {/* Headline */}
        <h2 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1] transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Ready to Turn
          <br />
          <span className="gradient-text-animated">Conversations</span>
          <br />
          Into Revenue?
        </h2>

        {/* Subtext */}
        <p className={`text-lg sm:text-xl text-white/40 mb-12 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Join thousands of sellers building their business through chat. Your store goes live in under 60 seconds. No credit card. No catch.
        </p>

        {/* Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={onStartSelling}
            className="group relative btn text-base px-10 py-5 rounded-xl font-bold text-white overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #00C897, #0F3460)' }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)` }} />
            <span className="relative flex items-center gap-2">
              Create Your Store — Free
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </span>
          </button>
          <button
            onClick={onStartShopping}
            className="btn text-base px-10 py-5 rounded-xl font-bold text-white/80 border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all backdrop-blur-sm"
          >
            Browse as Buyer
          </button>
        </div>

        {/* Trust signals */}
        <div className={`flex flex-wrap items-center justify-center gap-8 sm:gap-12 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, text: 'Secure Payments' },
            { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, text: '60s Setup' },
            { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text: 'Zero Fees' },
            { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, text: '2,500+ Sellers' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-white/30 hover:text-white/50 transition-colors">
              {item.icon}
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
