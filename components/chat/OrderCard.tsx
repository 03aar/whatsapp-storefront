import React from 'react';
import { Order } from '../../types';
import { ORDER_STATUSES } from '../../constants';

interface OrderCardProps {
  order: Order;
  currency: string;
  viewerRole: 'buyer' | 'seller';
  onConfirm?: (orderId: string) => void;
  onDecline?: (orderId: string) => void;
  onPay?: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, currency, viewerRole, onConfirm, onDecline, onPay }) => {
  const statusInfo = ORDER_STATUSES.find(s => s.id === order.status);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 max-w-sm mx-auto w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          <span className="text-xs font-semibold text-gray-500">Order {order.id}</span>
        </div>
        <span className="badge text-[10px]" style={{ background: statusInfo?.bg, color: statusInfo?.color }}>
          {statusInfo?.label}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden shrink-0">
              {item.productImage && <img src={item.productImage} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium line-clamp-1">{item.productName}</div>
              <div className="text-xs text-gray-400">x{item.quantity}</div>
            </div>
            <div className="text-sm font-semibold">{currency}{(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-gray-100 pt-3 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-lg font-bold">{currency}{order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      {viewerRole === 'seller' && order.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => onConfirm?.(order.id)}
            className="btn btn-success flex-1 text-xs py-2.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Confirm
          </button>
          <button
            onClick={() => onDecline?.(order.id)}
            className="btn flex-1 text-xs py-2.5 bg-red-50 text-red-500 hover:bg-red-100"
          >
            Decline
          </button>
        </div>
      )}

      {viewerRole === 'buyer' && order.paymentStatus === 'unpaid' && order.status !== 'cancelled' && (
        <button
          onClick={() => onPay?.(order)}
          className="btn btn-success w-full text-sm py-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          Pay {currency}{order.total.toFixed(2)}
        </button>
      )}

      {order.paymentStatus === 'paid' && (
        <div className="flex items-center justify-center gap-2 py-2 text-success text-sm font-semibold">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          Payment Complete
        </div>
      )}
    </div>
  );
};

export default OrderCard;
