import React, { useEffect, useState, useRef } from 'react';
import { BRAND_TAGLINE } from '../../constants';

interface LandingHeroProps {
  onStartSelling: () => void;
  onStartShopping: () => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({ onStartSelling, onStartShopping }) => {
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const fullText = 'Your Rules.';

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!heroVisible) return;
    let i = 0;
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < fullText.length) {
          setTypedText(fullText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, 100);
      return () => clearInterval(interval);
    }, 1200);
    return () => clearTimeout(delay);
  }, [heroVisible]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden mesh-gradient">
      {/* Morphing blob backgrounds */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-success/10 to-accent/5 animate-morph pointer-events-none"
        style={{ top: '10%', right: '5%', transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`, transition: 'transform 0.3s ease-out' }} />
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-accent/8 to-success/5 animate-morph pointer-events-none"
        style={{ bottom: '5%', left: '-5%', animationDelay: '-4s', transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`, transition: 'transform 0.3s ease-out' }} />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { size: 6, top: '15%', left: '10%', delay: '0s', dur: '7s' },
          { size: 4, top: '25%', left: '85%', delay: '-2s', dur: '9s' },
          { size: 8, top: '70%', left: '15%', delay: '-4s', dur: '8s' },
          { size: 5, top: '60%', left: '75%', delay: '-1s', dur: '6s' },
          { size: 3, top: '40%', left: '50%', delay: '-3s', dur: '10s' },
          { size: 6, top: '80%', left: '90%', delay: '-5s', dur: '7s' },
        ].map((p, i) => (
          <div key={i} className="absolute rounded-full bg-success/20"
            style={{ width: p.size, height: p.size, top: p.top, left: p.left, animation: `floatSlow ${p.dur} ease-in-out infinite`, animationDelay: p.delay }} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-28 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left copy */}
          <div className={`text-center lg:text-left transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-success/20 text-success-dark rounded-full text-sm font-semibold mb-8 shadow-sm animate-glow">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse-dot" />
              {BRAND_TAGLINE}
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.2rem] font-black tracking-tight leading-[1.05] mb-6">
              <span className="block">Your Store.</span>
              <span className="block gradient-text-animated">Your Chat.</span>
              <span className="block">
                {typedText}
                {showCursor && <span className="inline-block w-[4px] h-[0.85em] bg-success ml-1 align-middle" style={{ animation: 'typewriter-cursor 0.8s step-end infinite' }} />}
              </span>
            </h1>

            <p className={`text-lg sm:text-xl text-gray-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed transition-all duration-700 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Create a beautiful store in seconds. Sell to customers through chat.
              Payments, conversations, and orders — all in one place.
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button onClick={onStartSelling} className="group btn btn-primary text-base px-8 py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30">
                Start Selling
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
              <button onClick={onStartShopping} className="btn btn-outline text-base px-8 py-4 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white">
                Start Shopping
              </button>
            </div>

            <div className={`mt-12 flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-400 transition-all duration-700 delay-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {['No fees', 'Setup in 60s', 'In-chat payments'].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D chat mockup with perspective */}
          <div className={`relative flex justify-center transition-all duration-1000 delay-300 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
            {/* Orbiting icons */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div style={{ animation: 'orbitSpin 20s linear infinite' }}>
                <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div style={{ animation: 'orbitSpinReverse 25s linear infinite' }}>
                <div className="w-9 h-9 bg-white rounded-xl shadow-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
              </div>
            </div>

            {/* Chat card */}
            <div className="w-[320px] sm:w-[360px] rounded-2xl overflow-hidden shadow-2xl shadow-primary/15 animate-float"
              style={{ background: 'white', transform: `perspective(1200px) rotateY(${mousePos.x * -3}deg) rotateX(${mousePos.y * 3}deg)`, transition: 'transform 0.2s ease-out' }}>
              <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold ring-2 ring-white/30">S</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">Sneaker Haven</div>
                  <div className="text-xs text-white/60 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse-dot" /> Online now
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3 bg-gradient-to-b from-gray-50/80 to-white min-h-[310px]">
                <div className="flex justify-center">
                  <div className="text-[10px] text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">Today</div>
                </div>
                <div className="flex justify-start"><div className="bubble-buyer text-sm shadow-sm">Hey! Love the Retro High Tops. Size 10 available?</div></div>
                <div className="flex justify-end"><div className="bubble-seller text-sm shadow-sm">Yes! Size 10 in stock. Adding to your order now.</div></div>
                <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-accent to-success" />
                  <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Order Summary</div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="flex-1"><div className="text-sm font-semibold">Retro High Tops</div><div className="text-[11px] text-gray-400">Size 10 x 1</div></div>
                    <div className="text-sm font-bold">$120</div>
                  </div>
                  <button className="w-full py-2.5 bg-success text-white text-xs font-bold rounded-lg shadow-sm shadow-success/20">Pay $120</button>
                </div>
                <div className="flex justify-center">
                  <div className="bg-success/10 text-success-dark text-[11px] font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 border border-success/20 shadow-sm">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Payment Successful - $120
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
                <div className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm text-gray-400">Type a message...</div>
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-md shadow-primary/20">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-2 -right-2 sm:top-4 sm:right-0 animate-bounce-in" style={{ animationDelay: '2s', animationFillMode: 'backwards' }}>
              <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100 flex items-center gap-2">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <div><div className="text-[11px] font-bold">New Order!</div><div className="text-[10px] text-gray-400">$120.00</div></div>
              </div>
            </div>
            <div className="absolute -bottom-2 -left-4 sm:bottom-8 sm:-left-8 animate-bounce-in" style={{ animationDelay: '2.5s', animationFillMode: 'backwards' }}>
              <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100 flex items-center gap-2">
                <div className="flex">{[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}</div>
                <span className="text-[11px] font-bold">4.9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-[1500ms] ${heroVisible ? 'opacity-60' : 'opacity-0'}`}>
          <span className="text-xs text-gray-400 font-medium">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-float" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
