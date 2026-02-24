import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { SETUP_CATEGORIES, CURRENCY_OPTIONS } from '../../constants';
import { StoreSetupAnswers } from '../../types';

interface StoreSetupWizardProps {
  onComplete: () => void;
}

const StoreSetupWizard: React.FC<StoreSetupWizardProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { createStore, addProduct } = useStore();
  const [step, setStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [answers, setAnswers] = useState<StoreSetupAnswers>({
    businessType: '',
    primaryCategory: '',
    targetAudience: '',
    shippingType: '',
    estimatedProducts: '',
  });

  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [currency, setCurrency] = useState('$');

  // Product form for step 4
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const productFileRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProductImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    if (!user) return;

    const category = SETUP_CATEGORIES.find(c => c.id === answers.primaryCategory);
    const store = createStore({
      sellerId: user.id,
      name: storeName || `${user.name}'s Store`,
      description: storeDescription || 'Welcome to our store!',
      logo: logoPreview || user.avatar,
      banner: '',
      currency,
      categories: ['All', category?.label || 'General'],
      isSetupComplete: true,
      setupAnswers: answers,
    });

    // Add product if provided
    if (productName && productPrice) {
      addProduct({
        storeId: store.id,
        name: productName,
        price: parseFloat(productPrice),
        currency,
        description: productDescription,
        category: category?.label || 'General',
        image: productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
        stock: 10,
        variants: [],
        isActive: true,
      });
    }

    onComplete();
  };

  const canProceed = () => {
    switch (step) {
      case 0: return !!answers.businessType;
      case 1: return !!answers.primaryCategory;
      case 2: return !!storeName;
      case 3: return !!answers.targetAudience;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl animate-fade-in">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-500">Step {step + 1} of {totalSteps}</span>
            <button onClick={onComplete} className="text-sm text-gray-400 hover:text-gray-600 font-medium">Skip setup</button>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Step 0: Business type */}
          {step === 0 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">What do you sell?</h2>
              <p className="text-gray-500 mb-8">This helps us tailor your store experience.</p>
              <div className="space-y-3">
                {[
                  { id: 'physical', label: 'Physical Products', desc: 'Clothing, electronics, food, etc.', icon: '📦' },
                  { id: 'digital', label: 'Digital Products', desc: 'Software, courses, art, etc.', icon: '💻' },
                  { id: 'service', label: 'Services', desc: 'Consulting, design, tutoring, etc.', icon: '🛠' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers({ ...answers, businessType: opt.id as any })}
                    className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${answers.businessType === opt.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <div className="font-semibold">{opt.label}</div>
                      <div className="text-sm text-gray-400">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Category */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">Pick your main category</h2>
              <p className="text-gray-500 mb-8">You can add more categories later.</p>
              <div className="grid grid-cols-3 gap-3">
                {SETUP_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setAnswers({ ...answers, primaryCategory: cat.id })}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${answers.primaryCategory === cat.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <span className="text-2xl block mb-1">{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Store details */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">Tell us about your store</h2>
              <p className="text-gray-500 mb-8">Don't worry, you can change these anytime.</p>

              <div className="space-y-5">
                {/* Logo */}
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden border-2 border-dashed border-gray-200 hover:border-gray-400"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Store Logo</div>
                    <div className="text-xs text-gray-400">Click to upload (optional)</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Store Name *</label>
                  <input value={storeName} onChange={e => setStoreName(e.target.value)} className="input" placeholder="e.g. Sneaker Haven" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea value={storeDescription} onChange={e => setStoreDescription(e.target.value)} className="input min-h-[80px] resize-none" placeholder="What makes your store special?" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Currency</label>
                  <div className="flex gap-3">
                    {CURRENCY_OPTIONS.map(c => (
                      <button
                        key={c.symbol}
                        type="button"
                        onClick={() => setCurrency(c.symbol)}
                        className={`px-5 py-3 rounded-xl border-2 text-center transition-all ${currency === c.symbol ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <span className="text-lg font-bold block">{c.symbol}</span>
                        <span className="text-xs text-gray-400">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Target & Shipping */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">A few more details</h2>
              <p className="text-gray-500 mb-8">This helps us optimize your store.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3">Target audience</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'budget', label: 'Budget', icon: '💰' },
                      { id: 'general', label: 'General', icon: '🎯' },
                      { id: 'luxury', label: 'Premium', icon: '✨' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setAnswers({ ...answers, targetAudience: opt.id as any })}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${answers.targetAudience === opt.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <span className="text-xl block mb-1">{opt.icon}</span>
                        <span className="text-sm font-medium">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Shipping range</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'local', label: 'Local' },
                      { id: 'national', label: 'National' },
                      { id: 'international', label: 'Global' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setAnswers({ ...answers, shippingType: opt.id as any })}
                        className={`p-3 rounded-xl border-2 text-center text-sm font-medium transition-all ${answers.shippingType === opt.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: First product */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">Add your first product</h2>
              <p className="text-gray-500 mb-8">You can skip this and add products later.</p>

              <div className="space-y-5">
                {/* Product image card */}
                <div
                  onClick={() => productFileRef.current?.click()}
                  className="w-full h-48 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 hover:border-primary/30 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group"
                >
                  {productImage ? (
                    <div className="relative w-full h-full">
                      <img src={productImage} alt="Product" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-semibold">Change Photo</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-sm text-gray-400 font-medium">Click to add a photo</span>
                    </>
                  )}
                  <input type="file" ref={productFileRef} onChange={handleProductImageUpload} accept="image/*" className="hidden" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Name</label>
                    <input value={productName} onChange={e => setProductName(e.target.value)} className="input" placeholder="e.g. Classic T-Shirt" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price ({currency})</label>
                    <input type="number" value={productPrice} onChange={e => setProductPrice(e.target.value)} className="input" placeholder="29.99" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea value={productDescription} onChange={e => setProductDescription(e.target.value)} className="input min-h-[80px] resize-none" placeholder="Describe your product..." />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            {step > 0 ? (
              <button onClick={handleBack} className="btn btn-ghost">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back
              </button>
            ) : <div />}

            {step < totalSteps - 1 ? (
              <button onClick={handleNext} disabled={!canProceed()} className="btn btn-primary px-8 disabled:opacity-30 disabled:cursor-not-allowed">
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            ) : (
              <button onClick={handleFinish} className="btn btn-success px-8">
                Launch Store
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSetupWizard;
