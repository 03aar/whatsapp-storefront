import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { Product } from '../../types';
import ProductEditor from './ProductEditor';

const ProductManager: React.FC = () => {
  const { user } = useAuth();
  const { getStoreByOwner, getStoreProducts, addProduct, updateProduct, deleteProduct } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const store = user ? getStoreByOwner(user.id) : undefined;
  const products = store ? getStoreProducts(store.id) : [];

  if (!store) return null;

  if (isAdding || editingProduct) {
    return (
      <ProductEditor
        product={editingProduct || undefined}
        storeId={store.id}
        currency={store.currency}
        categories={store.categories}
        onSave={(data) => {
          if (editingProduct) {
            updateProduct({ ...editingProduct, ...data });
          } else {
            addProduct(data);
          }
          setEditingProduct(null);
          setIsAdding(false);
        }}
        onCancel={() => { setEditingProduct(null); setIsAdding(false); }}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-gray-500">{products.length} active listing{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="card overflow-hidden group">
            <div className="aspect-square bg-gray-50 relative overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
              {/* Stock badge */}
              <div className="absolute top-2 right-2 badge bg-primary text-white text-[10px]">
                Stock: {product.stock}
              </div>
              {/* Action overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button
                  onClick={() => { if (confirm('Delete this product?')) deleteProduct(product.id); }}
                  className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
              </div>
              <div className="text-xs text-gray-400 mb-2">{product.category}</div>
              <div className="font-bold">{store.currency}{product.price}</div>
            </div>
          </div>
        ))}

        {/* Add new card */}
        <button
          onClick={() => setIsAdding(true)}
          className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/30 flex flex-col items-center justify-center gap-3 transition-all group cursor-pointer bg-gray-50/50 hover:bg-primary/5"
        >
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 group-hover:border-primary/20 flex items-center justify-center transition-all">
            <svg className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <span className="text-sm font-medium text-gray-400 group-hover:text-primary transition-colors">Add New</span>
        </button>
      </div>
    </div>
  );
};

export default ProductManager;
