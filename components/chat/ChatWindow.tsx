import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { useStore } from '../../contexts/StoreContext';
import { Order, Conversation } from '../../types';
import OrderCard from './OrderCard';
import PaymentCard from './PaymentCard';

interface ChatWindowProps {
  conversation: Conversation;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const { user } = useAuth();
  const { getConversationMessages, sendMessage, markConversationRead } = useChat();
  const { orders, updateOrder, getStore } = useStore();
  const [inputText, setInputText] = useState('');
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messages = getConversationMessages(conversation.id);
  const store = getStore(conversation.storeId);
  const role = user?.role || 'buyer';

  // Mark as read
  useEffect(() => {
    if (user) markConversationRead(conversation.id, role);
  }, [conversation.id, messages.length, user, role, markConversationRead]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    if (!inputText.trim() || !user) return;
    sendMessage({
      conversationId: conversation.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: role,
      type: 'text',
      content: inputText.trim(),
    });
    setInputText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleConfirmOrder = (orderId: string) => {
    updateOrder(orderId, { status: 'confirmed' });
    if (user) {
      sendMessage({
        conversationId: conversation.id,
        senderId: 'system',
        senderName: 'System',
        senderRole: 'system',
        type: 'system',
        content: `Order ${orderId} has been confirmed by the seller!`,
      });
    }
  };

  const handleDeclineOrder = (orderId: string) => {
    updateOrder(orderId, { status: 'cancelled' });
    if (user) {
      sendMessage({
        conversationId: conversation.id,
        senderId: 'system',
        senderName: 'System',
        senderRole: 'system',
        type: 'system',
        content: `Order ${orderId} was declined.`,
      });
    }
  };

  const handlePaymentComplete = (order: Order, paymentMethod: string) => {
    updateOrder(order.id, { paymentStatus: 'paid', paymentMethod, status: order.status === 'pending' ? 'confirmed' : order.status });
    sendMessage({
      conversationId: conversation.id,
      senderId: 'system',
      senderName: 'System',
      senderRole: 'system',
      type: 'payment_complete',
      content: `Payment of ${store?.currency || '$'}${order.total.toFixed(2)} received via ${paymentMethod}`,
      metadata: { orderId: order.id, amount: order.total, method: paymentMethod },
    });
    setPayingOrder(null);
  };

  const getTimeStr = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const otherName = role === 'buyer' ? conversation.sellerName : conversation.buyerName;
  const otherInitial = otherName.charAt(0);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white shrink-0">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
          {otherInitial}
        </div>
        <div>
          <div className="font-semibold text-sm">{role === 'buyer' ? conversation.storeName : conversation.buyerName}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-success rounded-full" /> Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <p className="text-gray-400 text-sm font-medium">Start of conversation</p>
            <p className="text-gray-300 text-xs mt-1">Send a message to begin chatting.</p>
          </div>
        )}

        {messages.map(msg => {
          const isOwnMessage = msg.senderId === user?.id;

          // System messages
          if (msg.senderRole === 'system') {
            if (msg.type === 'order_card') {
              const order = orders.find(o => o.id === msg.metadata?.orderId);
              if (order) {
                return (
                  <div key={msg.id} className="py-2">
                    <OrderCard
                      order={order}
                      currency={store?.currency || '$'}
                      viewerRole={role}
                      onConfirm={handleConfirmOrder}
                      onDecline={handleDeclineOrder}
                      onPay={(o) => setPayingOrder(o)}
                    />
                    <div className="text-center mt-1">
                      <span className="text-[10px] text-gray-400">{getTimeStr(msg.timestamp)}</span>
                    </div>
                  </div>
                );
              }
            }

            if (msg.type === 'payment_complete') {
              return (
                <div key={msg.id} className="flex justify-center py-2">
                  <div className="bg-success/10 text-success-dark text-xs font-semibold px-5 py-3 rounded-xl flex items-center gap-2 border border-success/20">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    {msg.content}
                  </div>
                </div>
              );
            }

            // Generic system message
            return (
              <div key={msg.id} className="flex justify-center py-1">
                <div className="text-xs text-gray-400 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-50">
                  {msg.content}
                </div>
              </div>
            );
          }

          // Regular messages
          return (
            <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${isOwnMessage ? '' : 'flex gap-2'}`}>
                {!isOwnMessage && (
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0 mt-1">
                    {msg.senderName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className={isOwnMessage ? 'bubble-seller ml-auto' : 'bubble-buyer'}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <div className={`text-[10px] text-gray-400 mt-1 ${isOwnMessage ? 'text-right' : 'text-left ml-1'}`}>
                    {getTimeStr(msg.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-gray-50 rounded-full px-5 py-3 text-sm outline-none border border-gray-100 focus:border-primary/30 transition-colors"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white shrink-0 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-light transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>

      {/* Payment modal */}
      {payingOrder && store && (
        <PaymentCard
          order={payingOrder}
          currency={store.currency}
          onPaymentComplete={handlePaymentComplete}
          onClose={() => setPayingOrder(null)}
        />
      )}
    </div>
  );
};

export default ChatWindow;
