import React, { useState, useEffect } from 'react';
import LandingHero from './LandingHero';
import StatsBar from './StatsBar';
import HowItWorks from './HowItWorks';
import FeaturedStores from './FeaturedStores';
import Testimonials from './Testimonials';
import CTASection from './CTASection';
import LandingFooter from './LandingFooter';
import { BRAND_NAME } from '../../constants';

interface LandingPageProps {
  onStartSelling: () => void;
  onStartShopping: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartSelling, onStartShopping }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Navbar with scroll effect */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm shadow-black/5 border-b border-gray-100'
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${
              scrolled ? 'bg-primary shadow-sm' : 'bg-white/20 backdrop-blur-sm'
            }`}>C</div>
            <span className={`font-bold text-lg tracking-tight transition-colors duration-300 ${scrolled ? 'text-gray-900' : 'text-gray-700'}`}>{BRAND_NAME}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onStartShopping} className={`btn btn-ghost text-sm transition-colors duration-300 ${scrolled ? '' : 'text-gray-600 hover:text-gray-900'}`}>Log In</button>
            <button onClick={onStartSelling} className="btn btn-primary text-sm px-5 py-2.5 rounded-lg shadow-sm shadow-primary/20">Get Started</button>
          </div>
        </div>
      </nav>

      <LandingHero onStartSelling={onStartSelling} onStartShopping={onStartShopping} />
      <StatsBar />
      <HowItWorks />
      <FeaturedStores onStartShopping={onStartShopping} />
      <Testimonials />
      <CTASection onStartSelling={onStartSelling} onStartShopping={onStartShopping} />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
