import React from 'react';
import LandingHero from './LandingHero';
import HowItWorks from './HowItWorks';
import FeaturedStores from './FeaturedStores';
import LandingFooter from './LandingFooter';
import { BRAND_NAME } from '../../constants';

interface LandingPageProps {
  onStartSelling: () => void;
  onStartShopping: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartSelling, onStartShopping }) => {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">C</div>
            <span className="font-bold text-lg tracking-tight">{BRAND_NAME}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onStartShopping} className="btn btn-ghost text-sm">Log In</button>
            <button onClick={onStartSelling} className="btn btn-primary text-sm px-5 py-2.5 rounded-lg">Get Started</button>
          </div>
        </div>
      </nav>

      <LandingHero onStartSelling={onStartSelling} onStartShopping={onStartShopping} />
      <HowItWorks />
      <FeaturedStores onStartShopping={onStartShopping} />

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Ready to Start <span className="gradient-text">Selling?</span>
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of sellers who are building their business through conversations. It takes less than 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onStartSelling} className="btn btn-primary text-base px-10 py-4 rounded-xl shadow-lg shadow-primary/20">
              Create Your Store
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
            <button onClick={onStartShopping} className="btn btn-outline text-base px-10 py-4 rounded-xl">
              Browse as Buyer
            </button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
