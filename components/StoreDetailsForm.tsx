/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface StoreDetailsFormProps {
  onNext: (data: StoreFormData) => void;
  onCancel: () => void;
  fullPage?: boolean;
}

export interface StoreFormData {
  shopName: string;
  shopDescription: string;
  whatsappNumber: string;
  currency: string;
  logoFile: File | null;
  logoPreview: string | null;
}

const StoreDetailsForm: React.FC<StoreDetailsFormProps> = ({ onNext, onCancel, fullPage = false }) => {
  const [formData, setFormData] = useState<StoreFormData>({
    shopName: '',
    shopDescription: '',
    whatsappNumber: '',
    currency: '₹',
    logoFile: null,
    logoPreview: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, logo: 'Please select an image file' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, logo: 'Image size must be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logoFile: file,
          logoPreview: reader.result as string
        });
        setErrors({ ...errors, logo: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }

    if (!formData.shopDescription.trim()) {
      newErrors.shopDescription = 'Shop description is required';
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.whatsappNumber.replace(/\s/g, ''))) {
      newErrors.whatsappNumber = 'Please enter a valid WhatsApp number with country code (e.g., +919876543210)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  const containerClass = fullPage
    ? "min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4"
    : "fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-y-auto";

  return (
    <div className={containerClass}>
      <div className="clay-card w-full max-w-2xl my-8 mx-auto">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 border-b-2 border-black pb-6">
            <span className="clay-text-convex bg-black text-white border-none mb-4">Step 1 of 3</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mt-4">Store Details</h2>
            <p className="text-gray-500 font-bold mt-2">Tell us about your shop</p>
          </div>

          {/* Shop Name */}
          <div className="mb-6">
            <label className="block font-black uppercase tracking-widest text-xs mb-3">
              Shop Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              placeholder="e.g., Fresh Fruit Market"
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-bold transition-all clay-card"
            />
            {errors.shopName && <p className="text-red-500 text-xs font-bold mt-2">{errors.shopName}</p>}
          </div>

          {/* Shop Description */}
          <div className="mb-6">
            <label className="block font-black uppercase tracking-widest text-xs mb-3">
              Shop Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.shopDescription}
              onChange={(e) => setFormData({ ...formData, shopDescription: e.target.value })}
              placeholder="Describe what you sell..."
              rows={4}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-bold transition-all clay-card resize-none"
            />
            {errors.shopDescription && <p className="text-red-500 text-xs font-bold mt-2">{errors.shopDescription}</p>}
          </div>

          {/* WhatsApp Number */}
          <div className="mb-6">
            <label className="block font-black uppercase tracking-widest text-xs mb-3">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="+919876543210"
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-bold transition-all clay-card"
            />
            <p className="text-gray-400 text-xs font-bold mt-2">Include country code (e.g., +91 for India)</p>
            {errors.whatsappNumber && <p className="text-red-500 text-xs font-bold mt-2">{errors.whatsappNumber}</p>}
          </div>

          {/* Currency */}
          <div className="mb-6">
            <label className="block font-black uppercase tracking-widest text-xs mb-3">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-bold transition-all clay-card cursor-pointer"
            >
              <option value="₹">₹ (Indian Rupee)</option>
              <option value="$">$ (US Dollar)</option>
              <option value="€">€ (Euro)</option>
              <option value="AED">AED (UAE Dirham)</option>
            </select>
          </div>

          {/* Logo Upload */}
          <div className="mb-8">
            <label className="block font-black uppercase tracking-widest text-xs mb-3">
              Shop Logo (Optional)
            </label>
            <div className="flex items-center gap-4">
              {formData.logoPreview ? (
                <div className="relative">
                  <img
                    src={formData.logoPreview}
                    alt="Logo preview"
                    className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logoFile: null, logoPreview: null })}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center font-black text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
              )}
              <label className="clay-button px-6 py-3 cursor-pointer text-xs">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                Upload Logo
              </label>
            </div>
            {errors.logo && <p className="text-red-500 text-xs font-bold mt-2">{errors.logo}</p>}
            <p className="text-gray-400 text-xs font-bold mt-2">Recommended: 500x500px, max 5MB</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="clay-button px-8 py-4 text-sm flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="clay-button-primary px-8 py-4 text-sm flex-1"
            >
              Next: Add Products →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreDetailsForm;
