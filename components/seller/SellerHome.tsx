import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { useChat } from '../../contexts/ChatContext';
import { ORDER_STATUSES } from '../../constants';

interface SellerHomeProps {
  onNavigate: (view: string) => void;
}

const SellerHome: React.FC<SellerHomeProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { getStoreByOwner, getStoreOrders, getStoreProducts } = useStore();
  const { getUserConversations, getUnreadCount } = useChat();

  const store = user ? getStoreByOwner(user.id) : undefined;
  const orders = store ? getStoreOrders(store.id) : [];
  const products = store ? getStoreProducts(store.id) : [];
  const conversations = user ? getUserConversations(user.id, 'seller') : [];
  const unreadCount = user ? getUnreadCount(user.id, 'seller') : 0;

  const todayOrders = orders.filter(o => {
    const today = new Date();
    const orderDate = new Date(o.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-gray-500">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold">{store?.currency || '$'}{totalRevenue.toFixed(2)}</div>
          <div className="text-xs text-success font-semibold mt-1">{orders.length} orders</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-gray-500 mb-1">Today's Orders</div>
          <div className="text-2xl font-bold">{todayOrders.length}</div>
          <div className="text-xs text-gray-400 mt-1">orders today</div>
        </div>
        <div className="card p-5 cursor-pointer hover:border-primary/20" onClick={() => onNavigate('seller-chat')}>
          <div className="text-sm text-gray-500 mb-1">Active Chats</div>
          <div className="text-2xl font-bold">{conversations.length}</div>
          {unreadCount > 0 && (
            <div className="text-xs text-amber-600 font-semibold mt-1">{unreadCount} unread</div>
          )}
        </div>
        <div className="card p-5 cursor-pointer hover:border-primary/20" onClick={() => onNavigate('seller-products')}>
          <div className="text-sm text-gray-500 mb-1">Products</div>
          <div className="text-2xl font-bold">{products.length}</div>
          <div className="text-xs text-gray-400 mt-1">active listings</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold">Recent Orders</h2>
          <button onClick={() => onNavigate('seller-orders')} className="text-sm text-accent font-medium hover:underline">
            View All
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <p className="text-gray-400 font-medium mb-1">No orders yet</p>
            <p className="text-sm text-gray-300">Orders will appear here when customers buy from your store.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.slice(0, 5).map(order => {
              const statusInfo = ORDER_STATUSES.find(s => s.id === order.status);
              return (
                <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{order.buyerName}</div>
                      <div className="text-xs text-gray-400">{order.id} - {order.items.length} item{order.items.length > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{store?.currency}{order.total.toFixed(2)}</div>
                    <span className="badge text-xs" style={{ background: statusInfo?.bg, color: statusInfo?.color }}>
                      {statusInfo?.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {pendingOrders > 0 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="font-semibold text-sm text-amber-800">Pending Orders</div>
              <div className="text-xs text-amber-600">You have {pendingOrders} order{pendingOrders > 1 ? 's' : ''} waiting for confirmation</div>
            </div>
          </div>
          <button onClick={() => onNavigate('seller-orders')} className="btn text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-4 py-2">
            Review
          </button>
        </div>
      )}
    </div>
  );
};

export default SellerHome;
