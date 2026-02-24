import React from 'react';
import { useStore } from '../../contexts/StoreContext';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (storeId: string) => void;
}

const CartSheet: React.FC<CartSheetProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, stores } = useStore();

  if (!isOpen) return null;

  // Group by store
  const storeGroups = cart.reduce((acc, item) => {
    if (!acc[item.storeId]) acc[item.storeId] = [];
    acc[item.storeId].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] animate-fade-in" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[1001] animate-slide-right shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold">Shopping Cart ({cart.length})</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <p className="text-gray-400 font-medium">Cart is empty</p>
              <p className="text-sm text-gray-300 mt-1">Browse stores and add items.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(storeGroups).map(([storeId, items]) => {
                const store = stores.find(s => s.id === storeId);
                const storeTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                return (
                  <div key={storeId} className="card p-4">
                    {/* Store header */}
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-xs font-bold text-primary">
                        {store?.name?.charAt(0) || '?'}
                      </div>
                      <span className="font-semibold text-sm">{store?.name || 'Store'}</span>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={item.productId} className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                            {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm line-clamp-1">{item.name}</div>
                            <div className="text-sm text-gray-500">{store?.currency || '$'}{item.price}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                              className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                              className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Store total + checkout */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-500">Subtotal: </span>
                        <span className="font-bold">{store?.currency || '$'}{storeTotal.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => onCheckout(storeId)}
                        className="btn btn-success text-xs px-5 py-2.5"
                      >
                        Checkout via Chat
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer total */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total</span>
              <span className="text-xl font-bold">${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSheet;
