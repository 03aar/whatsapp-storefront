/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ============== VIEWS ==============
export type AppView =
  | 'landing'
  | 'seller-setup'
  | 'seller-dashboard'
  | 'seller-products'
  | 'seller-orders'
  | 'seller-chat'
  | 'seller-settings'
  | 'buyer-home'
  | 'buyer-store'
  | 'buyer-chat'
  | 'buyer-orders';

// ============== USERS ==============
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
  role: 'seller' | 'buyer';
  createdAt: number;
}

// ============== STORE ==============
export interface StoreSetupAnswers {
  businessType: 'physical' | 'digital' | 'service' | '';
  primaryCategory: string;
  targetAudience: 'general' | 'luxury' | 'budget' | '';
  shippingType: 'local' | 'national' | 'international' | '';
  estimatedProducts: '1-10' | '10-50' | '50+' | '';
}

export interface Store {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  currency: string;
  categories: string[];
  isSetupComplete: boolean;
  setupAnswers: StoreSetupAnswers;
  rating: number;
  totalSales: number;
  createdAt: number;
}

// ============== PRODUCTS ==============
export interface ProductVariant {
  id: string;
  label: string;
  priceModifier: number;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  category: string;
  image: string;
  stock: number;
  variants: ProductVariant[];
  isActive: boolean;
  createdAt: number;
}

// ============== CART ==============
export interface CartItem {
  productId: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}

// ============== ORDERS ==============
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  variant?: string;
}

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  conversationId: string;
  createdAt: number;
  updatedAt: number;
}

// ============== CONVERSATIONS ==============
export interface Conversation {
  id: string;
  storeId: string;
  storeName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage: string;
  lastMessageAt: number;
  unreadBuyer: number;
  unreadSeller: number;
  orderId?: string;
}

export type ChatMessageType = 'text' | 'order_card' | 'payment_request' | 'payment_complete' | 'product_card' | 'system';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller' | 'system';
  type: ChatMessageType;
  content: string;
  metadata?: Record<string, any>;
  timestamp: number;
  isRead: boolean;
}

// ============== CONTEXT TYPES ==============
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
