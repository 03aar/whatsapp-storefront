/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Store, Product, Conversation, ChatMessage, Order } from './types';

// ============== BRAND ==============
export const BRAND_NAME = 'ChatMarket';
export const BRAND_TAGLINE = 'Buy & Sell Through Conversations';

// ============== CATEGORIES ==============
export const STORE_CATEGORIES = [
  'All', 'Fashion', 'Electronics', 'Home', 'Beauty', 'Food', 'Art', 'Books', 'Sports'
];

export const ORDER_STATUSES = [
  { id: 'pending', label: 'Pending', color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'confirmed', label: 'Confirmed', color: '#8B5CF6', bg: '#EDE9FE' },
  { id: 'shipped', label: 'Shipped', color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'delivered', label: 'Delivered', color: '#00C897', bg: '#D1FAE5' },
  { id: 'cancelled', label: 'Cancelled', color: '#EF4444', bg: '#FEE2E2' }
];

export const PAYMENT_STATUSES = [
  { id: 'unpaid', label: 'Unpaid', color: '#EF4444' },
  { id: 'paid', label: 'Paid', color: '#00C897' },
  { id: 'refunded', label: 'Refunded', color: '#F59E0B' }
];

export const CURRENCY_OPTIONS = [
  { symbol: '$', label: 'USD', name: 'US Dollar' },
  { symbol: '€', label: 'EUR', name: 'Euro' },
  { symbol: '₹', label: 'INR', name: 'Indian Rupee' },
  { symbol: '£', label: 'GBP', name: 'British Pound' },
];

export const SETUP_CATEGORIES = [
  { id: 'fashion', label: 'Fashion', icon: '👗' },
  { id: 'electronics', label: 'Electronics', icon: '📱' },
  { id: 'food', label: 'Food & Drink', icon: '🍕' },
  { id: 'home', label: 'Home & Living', icon: '🏠' },
  { id: 'beauty', label: 'Beauty', icon: '💄' },
  { id: 'art', label: 'Art & Craft', icon: '🎨' },
  { id: 'books', label: 'Books', icon: '📚' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'other', label: 'Other', icon: '📦' },
];

// ============== DEMO SEED DATA ==============

export const DEMO_SELLER: User = {
  id: 'seller-001',
  email: 'seller@demo.com',
  password: 'demo123',
  name: 'Alex Rivera',
  avatar: 'A',
  role: 'seller',
  createdAt: Date.now() - 86400000 * 30,
};

export const DEMO_BUYER: User = {
  id: 'buyer-001',
  email: 'buyer@demo.com',
  password: 'demo123',
  name: 'Sarah Chen',
  avatar: 'S',
  role: 'buyer',
  createdAt: Date.now() - 86400000 * 7,
};

export const DEMO_STORE: Store = {
  id: 'store-001',
  sellerId: 'seller-001',
  name: 'Sneaker Haven',
  description: 'Premium sneakers for every style. Curated collection of the best kicks from around the world.',
  logo: 'S',
  banner: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1200',
  currency: '$',
  categories: ['All', 'High Tops', 'Running', 'Casual', 'Limited Edition'],
  isSetupComplete: true,
  setupAnswers: {
    businessType: 'physical',
    primaryCategory: 'fashion',
    targetAudience: 'general',
    shippingType: 'national',
    estimatedProducts: '10-50',
  },
  rating: 4.8,
  totalSales: 234,
  createdAt: Date.now() - 86400000 * 30,
};

export const DEMO_STORE_2: Store = {
  id: 'store-002',
  sellerId: 'seller-002',
  name: 'Coffee Roast Co.',
  description: 'Artisanal coffee beans roasted fresh every week. From single-origin to custom blends.',
  logo: 'C',
  banner: 'https://images.unsplash.com/photo-1447933601403-56dc2df6e394?auto=format&fit=crop&q=80&w=1200',
  currency: '$',
  categories: ['All', 'Single Origin', 'Blends', 'Equipment'],
  isSetupComplete: true,
  setupAnswers: {
    businessType: 'physical',
    primaryCategory: 'food',
    targetAudience: 'luxury',
    shippingType: 'national',
    estimatedProducts: '10-50',
  },
  rating: 4.6,
  totalSales: 589,
  createdAt: Date.now() - 86400000 * 60,
};

export const DEMO_STORE_3: Store = {
  id: 'store-003',
  sellerId: 'seller-003',
  name: 'TechPulse',
  description: 'Cutting-edge gadgets and accessories. If it has a chip, we have it.',
  logo: 'T',
  banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
  currency: '$',
  categories: ['All', 'Audio', 'Keyboards', 'Cameras', 'Accessories'],
  isSetupComplete: true,
  setupAnswers: {
    businessType: 'physical',
    primaryCategory: 'electronics',
    targetAudience: 'general',
    shippingType: 'international',
    estimatedProducts: '50+',
  },
  rating: 4.9,
  totalSales: 1023,
  createdAt: Date.now() - 86400000 * 90,
};

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    storeId: 'store-001',
    name: 'Retro High Tops',
    price: 120,
    currency: '$',
    description: 'Classic vibe sneakers with premium leather finish. Ultra-comfortable sole for all-day wear.',
    category: 'High Tops',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    variants: [],
    isActive: true,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'prod-002',
    storeId: 'store-001',
    name: 'Air Runner Pro',
    price: 180,
    currency: '$',
    description: 'Lightweight running shoes with responsive cushioning. Perfect for marathon training.',
    category: 'Running',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    stock: 8,
    variants: [],
    isActive: true,
    createdAt: Date.now() - 86400000 * 18,
  },
  {
    id: 'prod-003',
    storeId: 'store-001',
    name: 'Canvas Classic',
    price: 65,
    currency: '$',
    description: 'Timeless canvas sneakers. Goes with everything from jeans to chinos.',
    category: 'Casual',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800',
    stock: 25,
    variants: [],
    isActive: true,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'prod-004',
    storeId: 'store-001',
    name: 'Limited Gold Edition',
    price: 350,
    currency: '$',
    description: 'Only 100 pairs made. Gold-threaded upper with premium box packaging.',
    category: 'Limited Edition',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=800',
    stock: 3,
    variants: [],
    isActive: true,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'prod-005',
    storeId: 'store-001',
    name: 'Street Walker',
    price: 95,
    currency: '$',
    description: 'Urban style meets comfort. Padded ankle collar and grippy outsole.',
    category: 'Casual',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
    stock: 18,
    variants: [],
    isActive: true,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'prod-006',
    storeId: 'store-001',
    name: 'Trail Blazer X',
    price: 145,
    currency: '$',
    description: 'All-terrain trail running shoes. Waterproof membrane with aggressive tread pattern.',
    category: 'Running',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800',
    stock: 7,
    variants: [],
    isActive: true,
    createdAt: Date.now() - 86400000 * 8,
  },
  // Store 2 products
  {
    id: 'prod-101',
    storeId: 'store-002',
    name: 'Ethiopian Yirgacheffe',
    price: 24,
    currency: '$',
    description: 'Bright, fruity, and wine-like. Single-origin from the birthplace of coffee.',
    category: 'Single Origin',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800',
    stock: 40,
    variants: [],
    isActive: true,
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: 'prod-102',
    storeId: 'store-002',
    name: 'House Blend',
    price: 18,
    currency: '$',
    description: 'Our signature blend. Smooth, chocolatey, with a hint of caramel. Perfect everyday coffee.',
    category: 'Blends',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?auto=format&fit=crop&q=80&w=800',
    stock: 60,
    variants: [],
    isActive: true,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'prod-103',
    storeId: 'store-002',
    name: 'Ceramic Pour-Over Set',
    price: 45,
    currency: '$',
    description: 'Hand-crafted ceramic dripper with carafe. The perfect manual brewing setup.',
    category: 'Equipment',
    image: 'https://images.unsplash.com/photo-1572196284554-d9c252723702?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    variants: [],
    isActive: true,
    createdAt: Date.now() - 86400000 * 20,
  },
  // Store 3 products
  {
    id: 'prod-201',
    storeId: 'store-003',
    name: 'Noise-Cancel Buds Pro',
    price: 199,
    currency: '$',
    description: 'Silence the world. 24h battery life with ANC and transparency mode.',
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
    stock: 22,
    variants: [],
    isActive: true,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'prod-202',
    storeId: 'store-003',
    name: 'Mechanical Keyboard K75',
    price: 129,
    currency: '$',
    description: 'Wireless mechanical keyboard with RGB and hot-swappable switches.',
    category: 'Keyboards',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800',
    stock: 14,
    variants: [],
    isActive: true,
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    id: 'prod-203',
    storeId: 'store-003',
    name: 'Vintage Film Camera',
    price: 350,
    currency: '$',
    description: 'Fully restored 35mm film camera. Perfect for analog photography enthusiasts.',
    category: 'Cameras',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    stock: 4,
    variants: [],
    isActive: true,
    createdAt: Date.now() - 86400000 * 10,
  },
];

// Pre-seeded conversation for demo
export const DEMO_CONVERSATIONS: Conversation[] = [];
export const DEMO_MESSAGES: ChatMessage[] = [];
export const DEMO_ORDERS: Order[] = [];

// Helper to generate unique IDs
export const generateId = (prefix: string = '') => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
