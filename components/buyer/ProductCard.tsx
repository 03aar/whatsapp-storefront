import React from 'react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  currency: string;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, currency, onAddToCart }) => {
  return (
    <div className="card overflow-hidden group">
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <div className="absolute top-2 left-2 badge bg-amber-500 text-white text-[10px]">Only {product.stock} left</div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">{currency}{product.price}</span>
          <button
            onClick={(e) => { e.stopPropagation(); if (product.stock > 0) onAddToCart(product); }}
            disabled={product.stock === 0}
            className="btn btn-primary text-xs px-4 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
