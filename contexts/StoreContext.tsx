/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Store, Product, Order, CartItem } from '../types';
import { DEMO_STORE, DEMO_STORE_2, DEMO_STORE_3, DEMO_PRODUCTS, DEMO_ORDERS, generateId } from '../constants';

interface StoreContextType {
  stores: Store[];
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  activeStoreId: string | null;
  getStore: (storeId: string) => Store | undefined;
  getStoreByOwner: (sellerId: string) => Store | undefined;
  getStoreProducts: (storeId: string) => Product[];
  getStoreOrders: (storeId: string) => Order[];
  getBuyerOrders: (buyerId: string) => Order[];
  createStore: (store: Omit<Store, 'id' | 'createdAt' | 'rating' | 'totalSales'>) => Store;
  updateStore: (store: Store) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartByStore: (storeId: string) => CartItem[];
  setActiveStoreId: (id: string | null) => void;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);

  // Load from localStorage or seed
  useEffect(() => {
    const savedStores = localStorage.getItem('chatmarket_stores');
    const savedProducts = localStorage.getItem('chatmarket_products');
    const savedOrders = localStorage.getItem('chatmarket_orders');
    const savedCart = localStorage.getItem('chatmarket_cart');

    if (savedStores) {
      setStores(JSON.parse(savedStores));
    } else {
      const seed = [DEMO_STORE, DEMO_STORE_2, DEMO_STORE_3];
      setStores(seed);
      localStorage.setItem('chatmarket_stores', JSON.stringify(seed));
    }

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(DEMO_PRODUCTS);
      localStorage.setItem('chatmarket_products', JSON.stringify(DEMO_PRODUCTS));
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(DEMO_ORDERS);
    }

    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Persist on change
  useEffect(() => {
    if (stores.length) localStorage.setItem('chatmarket_stores', JSON.stringify(stores));
  }, [stores]);
  useEffect(() => {
    if (products.length) localStorage.setItem('chatmarket_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('chatmarket_orders', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem('chatmarket_cart', JSON.stringify(cart));
  }, [cart]);

  const getStore = useCallback((storeId: string) => stores.find(s => s.id === storeId), [stores]);
  const getStoreByOwner = useCallback((sellerId: string) => stores.find(s => s.sellerId === sellerId), [stores]);
  const getStoreProducts = useCallback((storeId: string) => products.filter(p => p.storeId === storeId && p.isActive), [products]);
  const getStoreOrders = useCallback((storeId: string) => orders.filter(o => o.storeId === storeId), [orders]);
  const getBuyerOrders = useCallback((buyerId: string) => orders.filter(o => o.buyerId === buyerId), [orders]);

  const createStore = useCallback((storeData: Omit<Store, 'id' | 'createdAt' | 'rating' | 'totalSales'>) => {
    const newStore: Store = { ...storeData, id: generateId('store-'), rating: 0, totalSales: 0, createdAt: Date.now() };
    setStores(prev => [...prev, newStore]);
    return newStore;
  }, []);

  const updateStore = useCallback((store: Store) => {
    setStores(prev => prev.map(s => s.id === store.id ? store : s));
  }, []);

  const addProduct = useCallback((productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = { ...productData, id: generateId('prod-'), createdAt: Date.now() };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.productId === item.productId);
      if (existing) {
        return prev.map(c => c.productId === item.productId ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(c => c.productId !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(c => c.productId !== productId));
    } else {
      setCart(prev => prev.map(c => c.productId === productId ? { ...c, quantity } : c));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const getCartTotal = useCallback(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const getCartByStore = useCallback((storeId: string) => cart.filter(c => c.storeId === storeId), [cart]);

  const createOrder = useCallback((orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = { ...orderData, id: generateId('ORD-'), createdAt: Date.now(), updatedAt: Date.now() };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateOrder = useCallback((orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates, updatedAt: Date.now() } : o));
  }, []);

  return (
    <StoreContext.Provider value={{
      stores, products, orders, cart, activeStoreId,
      getStore, getStoreByOwner, getStoreProducts, getStoreOrders, getBuyerOrders,
      createStore, updateStore, addProduct, updateProduct, deleteProduct,
      addToCart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, getCartByStore,
      setActiveStoreId, createOrder, updateOrder,
    }}>
      {children}
    </StoreContext.Provider>
  );
};
