import React, { useState } from 'react';
import { Order } from '../../types';

interface PaymentCardProps {
  order: Order;
  currency: string;
  onPaymentComplete: (order: Order, method: string) => void;
  onClose: () => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ order, currency, onPaymentComplete, onClose }) => {
  const [method, setMethod] = useState<'card' | 'bank' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const formatCardNumber = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned;
  };

  const handlePay = async () => {
    setError('');

    if (method === 'card') {
      const cleanedCard = cardNumber.replace(/\s/g, '');
      if (cleanedCard.length < 13) { setError('Please enter a valid card number'); return; }
      if (!cardExpiry || cardExpiry.length < 4) { setError('Please enter expiry date'); return; }
      if (!cardCvv || cardCvv.length < 3) { setError('Please enter CVV'); return; }
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));

    const methodLabel = method === 'card' ? `Visa ****${cardNumber.replace(/\s/g, '').slice(-4)}` :
                        method === 'bank' ? 'Bank Transfer' : 'UPI';

    onPaymentComplete(order, methodLabel);
    setIsProcessing(false);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl animate-scale-in overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-primary text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Complete Payment</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="text-3xl font-bold">{currency}{order.total.toFixed(2)}</div>
          <div className="text-white/60 text-sm mt-1">Order {order.id}</div>
        </div>

        <div className="p-6">
          {/* Method selector */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { id: 'card' as const, label: 'Card', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              )},
              { id: 'bank' as const, label: 'Bank', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              )},
              { id: 'upi' as const, label: 'UPI', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              )},
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${method === m.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className={`mb-1 flex justify-center ${method === m.id ? 'text-primary' : 'text-gray-400'}`}>{m.icon}</div>
                <div className={`text-xs font-semibold ${method === m.id ? 'text-primary' : 'text-gray-500'}`}>{m.label}</div>
              </button>
            ))}
          </div>

          {/* Card form */}
          {method === 'card' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Card Number</label>
                <input
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  className="input font-mono"
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Expiry</label>
                  <input
                    value={cardExpiry}
                    onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                    className="input font-mono"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">CVV</label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="input font-mono"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cardholder Name</label>
                <input
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  className="input"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          {method === 'bank' && (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <p className="text-gray-500 text-sm">Click "Pay Now" to simulate a bank transfer.</p>
              <p className="text-xs text-gray-400 mt-1">(Demo mode - no real transaction)</p>
            </div>
          )}

          {method === 'upi' && (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-gray-500 text-sm">Click "Pay Now" to simulate a UPI payment.</p>
              <p className="text-xs text-gray-400 mt-1">(Demo mode - no real transaction)</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="btn btn-success w-full py-4 mt-6 text-base rounded-xl disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                Pay {currency}{order.total.toFixed(2)}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Secured by ChatMarket Pay
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
