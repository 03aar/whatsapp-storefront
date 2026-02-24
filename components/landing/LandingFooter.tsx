import React from 'react';
import { BRAND_NAME } from '../../constants';

const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-success rounded-xl flex items-center justify-center text-white font-bold text-lg">C</div>
              <span className="font-bold text-xl">{BRAND_NAME}</span>
            </div>
            <p className="text-white/50 max-w-sm leading-relaxed">
              The marketplace where every purchase is a conversation. Create, sell, and grow — all from one platform.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/80 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              <li><span className="text-white/40 hover:text-white cursor-pointer transition-colors text-sm">For Sellers</span></li>
              <li><span className="text-white/40 hover:text-white cursor-pointer transition-colors text-sm">For Buyers</span></li>
              <li><span className="text-white/40 hover:text-white cursor-pointer transition-colors text-sm">Pricing</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/80 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <li><span className="text-white/40 hover:text-white cursor-pointer transition-colors text-sm">Privacy Policy</span></li>
              <li><span className="text-white/40 hover:text-white cursor-pointer transition-colors text-sm">Terms of Service</span></li>
              <li><span className="text-white/40 hover:text-white cursor-pointer transition-colors text-sm">Contact</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">&copy; 2026 {BRAND_NAME}. All rights reserved.</p>
          <p className="text-white/20 text-xs">Built with conversations in mind.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
