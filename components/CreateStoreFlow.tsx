/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import StoreDetailsForm, { StoreFormData } from './StoreDetailsForm';
import AddProductsForm, { ProductFormData } from './AddProductsForm';
import StoreCreatedSuccess from './StoreCreatedSuccess';
import { createStore } from '../services/supabase';

interface CreateStoreFlowProps {
  onClose: () => void;
  onStoreCreated: (slug: string) => void;
}

type Step = 'details' | 'products' | 'success' | 'loading';

const CreateStoreFlow: React.FC<CreateStoreFlowProps> = ({ onClose, onStoreCreated }) => {
  const [step, setStep] = useState<Step>('details');
  const [storeDetails, setStoreDetails] = useState<StoreFormData | null>(null);
  const [createdStoreSlug, setCreatedStoreSlug] = useState('');
  const [createdStoreName, setCreatedStoreName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleStoreDetailsNext = (data: StoreFormData) => {
    setStoreDetails(data);
    setStep('products');
  };

  const handleProductsBack = () => {
    setStep('details');
  };

  const handleProductsNext = async (products: ProductFormData[]) => {
    if (!storeDetails) return;

    setStep('loading');
    setError(null);

    try {
      // Prepare store data
      const storeData = {
        name: storeDetails.shopName,
        description: storeDetails.shopDescription,
        whatsappNumber: storeDetails.whatsappNumber.replace(/\s/g, ''),
        currency: storeDetails.currency,
        logoFile: storeDetails.logoFile
      };

      // Prepare products data
      const productsData = products.map(p => ({
        name: p.name,
        description: p.description,
        price: p.price,
        imageFile: p.imageFile
      }));

      // Create store in Supabase
      const store = await createStore(storeData, productsData);

      setCreatedStoreSlug(store.slug);
      setCreatedStoreName(store.name);
      setStep('success');
    } catch (err) {
      console.error('Error creating store:', err);
      setError(err instanceof Error ? err.message : 'Failed to create store. Please try again.');
      setStep('products');
    }
  };

  const handleViewStore = () => {
    onStoreCreated(createdStoreSlug);
  };

  if (step === 'loading') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <div className="clay-card p-12 text-center max-w-md">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Creating Your Store</h3>
          <p className="text-gray-500 font-bold">
            Uploading images and setting up your products...
          </p>
          <p className="text-sm text-gray-400 font-bold mt-4">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <StoreCreatedSuccess
        storeSlug={createdStoreSlug}
        storeName={createdStoreName}
        onClose={onClose}
        onViewStore={handleViewStore}
      />
    );
  }

  if (step === 'products' && storeDetails) {
    return (
      <>
        <AddProductsForm
          onNext={handleProductsNext}
          onBack={handleProductsBack}
          currency={storeDetails.currency}
        />
        {error && (
          <div className="fixed bottom-8 right-8 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl max-w-md z-[10000]">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-black mb-1">Error Creating Store</h4>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <StoreDetailsForm
      onNext={handleStoreDetailsNext}
      onCancel={onClose}
    />
  );
};

export default CreateStoreFlow;
