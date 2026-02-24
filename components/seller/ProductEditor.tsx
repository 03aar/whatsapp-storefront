import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../../types';
import { STORE_CATEGORIES } from '../../constants';

interface ProductEditorProps {
  product?: Product;
  storeId: string;
  currency: string;
  categories: string[];
  onSave: (data: Omit<Product, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ product, storeId, currency, categories, onSave, onCancel }) => {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category || categories[1] || 'General');
  const [stock, setStock] = useState(product?.stock?.toString() || '10');
  const [image, setImage] = useState<string>(product?.image || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !price) return;
    onSave({
      storeId,
      name: name.trim(),
      price: parseFloat(price),
      currency,
      description: description.trim(),
      category,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      stock: parseInt(stock) || 0,
      variants: product?.variants || [],
      isActive: product?.isActive ?? true,
    });
  };

  const availableCategories = categories.filter(c => c !== 'All');

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{product ? 'Edit Product' : 'New Product'}</h2>
        <button onClick={onCancel} className="btn btn-ghost text-sm">Cancel</button>
      </div>

      <div className="card p-6 space-y-5">
        {/* Image upload - blank card style */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-56 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 hover:border-primary/30 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group relative"
        >
          {image ? (
            <>
              <img src={image} alt="Product" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-semibold">Change Photo</span>
              </div>
            </>
          ) : (
            <>
              <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-sm text-gray-400 font-medium">Click to add product photo</span>
              <span className="text-xs text-gray-300 mt-1">A sample placeholder will be used if empty</span>
            </>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input" placeholder="e.g. Classic Sneakers" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price ({currency}) *</label>
            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="input" placeholder="29.99" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input bg-white">
              {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
              {STORE_CATEGORIES.filter(c => c !== 'All' && !availableCategories.includes(c)).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Stock</label>
            <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="input" placeholder="10" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="input min-h-[100px] resize-none" placeholder="Describe your product..." />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onCancel} className="btn btn-outline px-6">Cancel</button>
          <button onClick={handleSubmit} disabled={!name.trim() || !price} className="btn btn-primary px-8 disabled:opacity-30 disabled:cursor-not-allowed">
            {product ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditor;
