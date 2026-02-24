/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Conversation, ChatMessage } from '../types';
import { generateId } from '../constants';

interface ChatContextType {
  conversations: Conversation[];
  messages: ChatMessage[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  getConversation: (id: string) => Conversation | undefined;
  getConversationByParties: (buyerId: string, storeId: string) => Conversation | undefined;
  getConversationMessages: (conversationId: string) => ChatMessage[];
  getUserConversations: (userId: string, role: 'buyer' | 'seller') => Conversation[];
  getUnreadCount: (userId: string, role: 'buyer' | 'seller') => number;
  createConversation: (data: Omit<Conversation, 'id' | 'lastMessage' | 'lastMessageAt' | 'unreadBuyer' | 'unreadSeller'>) => Conversation;
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>) => ChatMessage;
  markConversationRead: (conversationId: string, role: 'buyer' | 'seller') => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedConvos = localStorage.getItem('chatmarket_conversations');
    const savedMsgs = localStorage.getItem('chatmarket_messages');
    if (savedConvos) setConversations(JSON.parse(savedConvos));
    if (savedMsgs) setMessages(JSON.parse(savedMsgs));
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem('chatmarket_conversations', JSON.stringify(conversations));
  }, [conversations]);
  useEffect(() => {
    localStorage.setItem('chatmarket_messages', JSON.stringify(messages));
  }, [messages]);

  const getConversation = useCallback((id: string) => conversations.find(c => c.id === id), [conversations]);

  const getConversationByParties = useCallback((buyerId: string, storeId: string) => {
    return conversations.find(c => c.buyerId === buyerId && c.storeId === storeId);
  }, [conversations]);

  const getConversationMessages = useCallback((conversationId: string) => {
    return messages.filter(m => m.conversationId === conversationId).sort((a, b) => a.timestamp - b.timestamp);
  }, [messages]);

  const getUserConversations = useCallback((userId: string, role: 'buyer' | 'seller') => {
    return conversations
      .filter(c => role === 'buyer' ? c.buyerId === userId : c.sellerId === userId)
      .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  }, [conversations]);

  const getUnreadCount = useCallback((userId: string, role: 'buyer' | 'seller') => {
    return conversations.reduce((count, c) => {
      if (role === 'buyer' && c.buyerId === userId) return count + c.unreadBuyer;
      if (role === 'seller' && c.sellerId === userId) return count + c.unreadSeller;
      return count;
    }, 0);
  }, [conversations]);

  const createConversation = useCallback((data: Omit<Conversation, 'id' | 'lastMessage' | 'lastMessageAt' | 'unreadBuyer' | 'unreadSeller'>) => {
    const newConvo: Conversation = {
      ...data,
      id: generateId('conv-'),
      lastMessage: '',
      lastMessageAt: Date.now(),
      unreadBuyer: 0,
      unreadSeller: 0,
    };
    setConversations(prev => [newConvo, ...prev]);
    return newConvo;
  }, []);

  const sendMessage = useCallback((msgData: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>) => {
    const newMsg: ChatMessage = {
      ...msgData,
      id: generateId('msg-'),
      timestamp: Date.now(),
      isRead: false,
    };
    setMessages(prev => [...prev, newMsg]);

    // Update conversation
    setConversations(prev => prev.map(c => {
      if (c.id !== msgData.conversationId) return c;
      const contentPreview = msgData.type === 'text' ? msgData.content :
                             msgData.type === 'order_card' ? 'New order placed' :
                             msgData.type === 'payment_complete' ? 'Payment received' :
                             msgData.type === 'system' ? msgData.content : 'Sent an attachment';
      return {
        ...c,
        lastMessage: contentPreview,
        lastMessageAt: Date.now(),
        unreadBuyer: msgData.senderRole === 'seller' || msgData.senderRole === 'system' ? c.unreadBuyer + 1 : c.unreadBuyer,
        unreadSeller: msgData.senderRole === 'buyer' || msgData.senderRole === 'system' ? c.unreadSeller + 1 : c.unreadSeller,
      };
    }));

    return newMsg;
  }, []);

  const markConversationRead = useCallback((conversationId: string, role: 'buyer' | 'seller') => {
    setConversations(prev => prev.map(c => {
      if (c.id !== conversationId) return c;
      return role === 'buyer' ? { ...c, unreadBuyer: 0 } : { ...c, unreadSeller: 0 };
    }));
    setMessages(prev => prev.map(m => {
      if (m.conversationId !== conversationId) return m;
      if (role === 'buyer' && m.senderRole !== 'buyer') return { ...m, isRead: true };
      if (role === 'seller' && m.senderRole !== 'seller') return { ...m, isRead: true };
      return m;
    }));
  }, []);

  return (
    <ChatContext.Provider value={{
      conversations, messages, activeConversationId, setActiveConversationId,
      getConversation, getConversationByParties, getConversationMessages,
      getUserConversations, getUnreadCount,
      createConversation, sendMessage, markConversationRead,
    }}>
      {children}
    </ChatContext.Provider>
  );
};
