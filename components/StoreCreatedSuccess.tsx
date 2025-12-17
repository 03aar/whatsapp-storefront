/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface StoreCreatedSuccessProps {
  storeSlug: string;
  storeName: string;
  onClose: () => void;
  onViewStore: () => void;
  fullPage?: boolean;
}

const StoreCreatedSuccess: React.FC<StoreCreatedSuccessProps> = ({
  storeSlug,
  storeName,
  onClose,
  onViewStore,
  fullPage = false
}) => {
  const [copied, setCopied] = useState(false);

  // Get the current domain
  const storeUrl = `${window.location.origin}/store/${storeSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Check out my new store "${storeName}"! 🛍️\n\nVisit: ${storeUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const containerClass = fullPage
    ? "min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4"
    : "fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-y-auto";

  return (
    <div className={containerClass}>
      <div className="clay-card w-full max-w-2xl my-8 mx-auto">
        <div className="p-6 md:p-10 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
            <span className="text-4xl md:text-5xl">✓</span>
          </div>

          {/* Header */}
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Your Store is Live!
          </h2>
          <p className="text-gray-500 font-bold mb-8 max-w-md mx-auto">
            Congratulations! Your store "{storeName}" has been created successfully.
            Share your unique link and start selling!
          </p>

          {/* Store Link */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <label className="block font-black uppercase tracking-widest text-xs mb-3 text-gray-500">
              Your Store Link
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 bg-white px-5 py-4 rounded-xl border-2 border-gray-200 font-mono text-sm break-all text-left">
                {storeUrl}
              </div>
              <button
                onClick={handleCopyLink}
                className="clay-button px-6 py-4 text-sm whitespace-nowrap"
              >
                {copied ? '✓ Copied!' : '📋 Copy Link'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-4 bg-[#25D366] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <span className="text-xl">💬</span>
              <span className="text-sm">Share on WhatsApp</span>
            </button>
            <button
              onClick={onViewStore}
              className="flex-1 clay-button-primary py-4 text-sm"
            >
              👁️ View My Store
            </button>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6 text-left">
            <h3 className="font-black uppercase tracking-widest text-xs mb-4 text-blue-900">
              💡 Quick Tips
            </h3>
            <ul className="space-y-2 text-sm font-bold text-blue-900">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Share your store link on social media and with customers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Keep your WhatsApp active to receive orders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Update your products regularly to keep customers engaged</span>
              </li>
            </ul>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="clay-button px-8 py-4 text-sm"
          >
            Close
          </button>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-gray-100">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">
              Powered by STORELINK - Create your own free store
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCreatedSuccess;
