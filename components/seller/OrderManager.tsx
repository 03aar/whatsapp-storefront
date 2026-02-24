import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../constants';
import { OrderStatus } from '../../types';

interface OrderManagerProps {
  onNavigateToChat: (conversationId: string) => void;
}

const OrderManager: React.FC<OrderManagerProps> = ({ onNavigateToChat }) => {
  const { user } = useAuth();
  const { getStoreByOwner, getStoreOrders, updateOrder } = useStore();

  const store = user ? getStoreByOwner(user.id) : undefined;
  const orders = store ? getStoreOrders(store.id) : [];

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrder(orderId, { status: newStatus });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-gray-500">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {orders.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <p className="text-gray-400 font-medium mb-1">No orders yet</p>
          <p className="text-sm text-gray-300">When customers purchase from your store, orders appear here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="divide-y divide-gray-50">
            {orders.map(order => {
              const statusInfo = ORDER_STATUSES.find(s => s.id === order.status);
              const paymentInfo = PAYMENT_STATUSES.find(s => s.id === order.paymentStatus);
              return (
                <div key={order.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-sm font-semibold">{order.id}</span>
                        <span className="badge text-[10px]" style={{ background: statusInfo?.bg, color: statusInfo?.color }}>
                          {statusInfo?.label}
                        </span>
                        <span className="badge text-[10px]" style={{ background: paymentInfo?.color + '15', color: paymentInfo?.color }}>
                          {paymentInfo?.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.buyerName} &middot; {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{store?.currency}{order.total.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 shrink-0">
                        <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                          {item.productImage && <img src={item.productImage} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="text-xs font-medium line-clamp-1">{item.productName}</div>
                          <div className="text-xs text-gray-400">x{item.quantity} &middot; {store?.currency}{item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-white cursor-pointer"
                    >
                      {ORDER_STATUSES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>

                    {order.conversationId && (
                      <button
                        onClick={() => onNavigateToChat(order.conversationId)}
                        className="btn btn-ghost text-xs"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        Chat
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
