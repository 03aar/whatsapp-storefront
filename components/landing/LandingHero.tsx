import React from 'react';
import { BRAND_NAME, BRAND_TAGLINE } from '../../constants';

interface LandingHeroProps {
  onStartSelling: () => void;
  onStartShopping: () => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({ onStartSelling, onStartShopping }) => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32 px-4">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-success/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success-dark rounded-full text-sm font-semibold mb-8">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse-dot" />
              {BRAND_TAGLINE}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Your Store.{' '}
              <span className="gradient-text">Your Chat.</span>
              <br />
              Your Rules.
            </h1>

            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Create a beautiful store in seconds. Sell to customers through an integrated chat.
              Payments, conversations, and orders — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={onStartSelling} className="btn btn-primary text-base px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                Start Selling
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
              <button onClick={onStartShopping} className="btn btn-outline text-base px-8 py-4 rounded-xl">
                Start Shopping
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                No fees
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Setup in 60s
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                In-chat payments
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative flex justify-center animate-slide-right">
            {/* Chat mockup */}
            <div className="w-[320px] md:w-[360px] card-elevated p-0 overflow-hidden animate-float">
              {/* Chat header */}
              <div className="bg-primary text-white p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">S</div>
                <div>
                  <div className="font-semibold text-sm">Sneaker Haven</div>
                  <div className="text-xs text-white/60 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-success rounded-full" /> Online
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-4 space-y-3 bg-gray-50/50 min-h-[300px]">
                {/* System message */}
                <div className="flex justify-center">
                  <div className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full">Today</div>
                </div>

                {/* Buyer */}
                <div className="flex justify-start">
                  <div className="bubble-buyer text-sm">Hey, I love the Retro High Tops! Available in size 10?</div>
                </div>

                {/* Seller */}
                <div className="flex justify-end">
                  <div className="bubble-seller text-sm">Yes! Size 10 is in stock. Want me to add it to your order?</div>
                </div>

                {/* Order card */}
                <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                  <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Order Summary</div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Retro High Tops</div>
                      <div className="text-xs text-gray-400">Size 10 x 1</div>
                    </div>
                    <div className="text-sm font-bold">$120</div>
                  </div>
                  <button className="w-full py-2 bg-success text-white text-xs font-bold rounded-lg mt-1">
                    Pay $120
                  </button>
                </div>

                {/* Payment success */}
                <div className="flex justify-center">
                  <div className="bg-success/10 text-success-dark text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Payment Successful - $120
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
                <div className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm text-gray-400">Type a message...</div>
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
