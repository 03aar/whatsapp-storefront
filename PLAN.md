# ChatMarket - Complete System Architecture & Implementation Plan

**Author:** CTO & Lead Architect
**Date:** Feb 2026
**Status:** Design Phase
**Replaces:** WhatsApp-based ShopSmart storefront

---

## 1. EXECUTIVE SUMMARY

We are replacing the WhatsApp-based storefront with **ChatMarket** - an integrated marketplace platform where sellers create stores and buyers purchase products through an in-app messenger. Every transaction - browsing, ordering, payment, and communication - happens inside a unified chat experience.

### Core Philosophy
> "Every purchase is a conversation."

The chatbox IS the checkout. The chatbox IS the receipt. The chatbox IS customer support. No redirects, no external apps, no friction.

---

## 2. SYSTEM ARCHITECTURE

### 2.1 Tech Stack (No Changes to Core Stack)
```
Frontend:     React 19 + TypeScript + Vite
Styling:      Tailwind CSS (via CDN) + Custom Design System
AI:           Google Gemini 2.5 Flash (existing)
Storage:      localStorage (simulated multi-user)
Payments:     In-chat payment flow (Razorpay/Stripe-style mock)
```

### 2.2 Application State Architecture
```
                    ┌──────────────────────────┐
                    │       App.tsx (Root)       │
                    │   AuthContext Provider     │
                    │   ChatContext Provider     │
                    │   StoreContext Provider    │
                    └──────────┬───────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                 │
     ┌────────▼──────┐ ┌──────▼───────┐ ┌──────▼───────┐
     │  Landing Page  │ │Seller Dashboard│ │Buyer Dashboard│
     │  (Unauthenticated)│ │  (role=seller)  │ │  (role=buyer)  │
     └────────────────┘ └──────────────┘ └──────────────┘
```

### 2.3 Data Models

```typescript
// ============== USERS ==============
interface User {
  id: string;
  email: string;
  password: string;          // hashed in real app, plain for demo
  name: string;
  avatar: string;            // generated initial or uploaded
  role: 'seller' | 'buyer';
  createdAt: number;
}

// ============== STORE ==============
interface Store {
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
  createdAt: number;
}

interface StoreSetupAnswers {
  businessType: string;      // "physical" | "digital" | "service"
  primaryCategory: string;   // "fashion" | "electronics" | "food" etc.
  targetAudience: string;    // "general" | "luxury" | "budget"
  shippingType: string;      // "local" | "national" | "international"
  estimatedProducts: string; // "1-10" | "10-50" | "50+"
}

// ============== PRODUCTS ==============
interface Product {
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

interface ProductVariant {
  id: string;
  label: string;          // "Size: M", "Color: Red"
  priceModifier: number;  // +0, +10, -5
}

// ============== ORDERS ==============
interface Order {
  id: string;
  storeId: string;
  buyerId: string;
  sellerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentMethod: string;
  conversationId: string;  // linked chat thread
  createdAt: number;
  updatedAt: number;
}

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  variant?: string;
}

// ============== CONVERSATIONS ==============
interface Conversation {
  id: string;
  storeId: string;
  buyerId: string;
  sellerId: string;
  lastMessage: string;
  lastMessageAt: number;
  unreadBuyer: number;
  unreadSeller: number;
  orderId?: string;        // linked order (if any)
}

interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'buyer' | 'seller' | 'system';
  type: 'text' | 'order_card' | 'payment_request' | 'payment_complete' | 'image' | 'product_card';
  content: string;
  metadata?: any;          // order details, product info, payment info
  timestamp: number;
  isRead: boolean;
}
```

---

## 3. USER FLOWS (DETAILED)

### 3.1 LANDING PAGE FLOW

```
┌─────────────────────────────────────────────────────┐
│                   LANDING PAGE                       │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │              HERO SECTION                     │    │
│  │  "Buy & Sell Through Conversations"           │    │
│  │                                               │    │
│  │  [Start Selling]  [Start Shopping]             │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │           HOW IT WORKS (3 Steps)              │    │
│  │  1. Create Store / Browse Stores              │    │
│  │  2. Chat with Buyers / Chat with Sellers      │    │
│  │  3. Pay & Ship via Chat                       │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │         FEATURED STORES (Carousel)            │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │             TESTIMONIALS                      │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │               FOOTER                          │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 3.2 AUTHENTICATION FLOW

```
User clicks "Start Selling" or "Start Shopping"
        │
        ▼
┌──────────────────┐
│   Auth Modal      │
│                   │
│  ┌─────────────┐ │
│  │  Login Tab   │ │     ┌──────────────────────┐
│  │  Email       │ │     │   Sign Up Tab          │
│  │  Password    │ │     │   Name                 │
│  │  [Login]     │ │     │   Email                │
│  └─────────────┘ │     │   Password             │
│                   │     │   Role: Seller/Buyer   │
│  ─── OR ───      │     │   [Create Account]     │
│                   │     └──────────────────────┘
│  [Google SSO]    │
│  [Sign Up →]     │
└──────────────────┘
        │
        ▼
  Role = Seller? ──Yes──▶ Store Setup Wizard (if first time)
        │                         │
       No                         ▼
        │                  Seller Dashboard
        ▼
  Buyer Dashboard
```

### 3.3 SELLER FLOW (DETAILED)

#### 3.3.1 Store Setup Wizard (First-Time Only)

```
Step 1/4: "What do you sell?"
┌─────────────────────────────────┐
│  ○ Physical Products            │
│  ○ Digital Products             │
│  ○ Services                     │
│                    [Next →]     │
└─────────────────────────────────┘

Step 2/4: "Pick your main category"
┌─────────────────────────────────┐
│  [Fashion] [Electronics] [Food] │
│  [Home]    [Beauty]    [Art]    │
│  [Books]   [Sports]   [Other]  │
│                    [Next →]     │
└─────────────────────────────────┘

Step 3/4: "Tell us about your store"
┌─────────────────────────────────┐
│  Store Name: [____________]     │
│  Description: [____________]    │
│  Currency: [$] [€] [₹] [£]     │
│  Logo: [Upload or Auto-gen]     │
│                    [Next →]     │
└─────────────────────────────────┘

Step 4/4: "Add your first product"
┌─────────────────────────────────┐
│  ┌─────────┐                    │
│  │ BLANK   │  Product Name      │
│  │ CARD    │  Price             │
│  │ +Photo  │  Description       │
│  └─────────┘  Category          │
│                                 │
│  [Skip for now] [Add Product]   │
└─────────────────────────────────┘
        │
        ▼
  ✅ "Your store is live!"
  → Redirect to Seller Dashboard
```

#### 3.3.2 Seller Dashboard Layout

```
┌────────────────────────────────────────────────────────────┐
│  [Logo] ChatMarket          [🔔 3] [Avatar ▼]             │
├────────┬───────────────────────────────────────────────────┤
│        │                                                    │
│  📊   │   MAIN CONTENT AREA                                │
│ Dash   │                                                    │
│        │   ┌──────────────────┬────────────────────────┐   │
│  💬   │   │  Stats Cards      │  Revenue Chart         │   │
│ Chat   │   │  - Orders Today   │                        │   │
│        │   │  - Revenue        │                        │   │
│  📦   │   │  - Active Chats   │                        │   │
│ Products│   └──────────────────┴────────────────────────┘   │
│        │                                                    │
│  📋   │   ┌─────────────────────────────────────────────┐  │
│ Orders │   │  Recent Orders                               │  │
│        │   │  ┌───────────────────────────────────────┐  │  │
│  ⚙️   │   │  │ ORD-1234 │ John │ $45 │ Confirmed ▼   │  │  │
│ Settings│   │  │ ORD-1235 │ Jane │ $120│ Pending ▼     │  │  │
│        │   │  └───────────────────────────────────────┘  │  │
│        │   └─────────────────────────────────────────────┘  │
└────────┴───────────────────────────────────────────────────┘
```

#### 3.3.3 Seller Product Management

**Adding a Product:**
```
┌──────────────────────────────────────────┐
│  Products                  [+ Add Item]  │
├──────────────────────────────────────────┤
│                                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │      │ │      │ │      │ │  +   │   │
│  │ Img  │ │ Img  │ │ Img  │ │ ADD  │   │
│  │      │ │      │ │      │ │ NEW  │   │
│  │$120  │ │$45   │ │$89   │ │      │   │
│  │Sneakr│ │Cup   │ │Watch │ │      │   │
│  │[Edit]│ │[Edit]│ │[Edit]│ │      │   │
│  └──────┘ └──────┘ └──────┘ └──────┘   │
└──────────────────────────────────────────┘

Clicking [+ Add Item] or the blank card:
┌──────────────────────────────────────────┐
│  New Product                             │
│                                          │
│  ┌──────────────────────────────┐       │
│  │                              │       │
│  │    📷 Click to add photo     │       │
│  │    (sample placeholder)      │       │
│  │                              │       │
│  └──────────────────────────────┘       │
│                                          │
│  Name: [________________________]       │
│  Price: [________]                      │
│  Category: [Fashion ▼]                  │
│  Description: [_________________]       │
│  Stock: [____]                          │
│                                          │
│  [Cancel]              [Save Product]   │
└──────────────────────────────────────────┘
```

**Removing a Product:**
- Each product card has a "..." menu with "Delete" option
- Confirmation dialog appears before deletion
- Product becomes immediately unavailable

#### 3.3.4 Seller Chat (Receiving Orders)

When a customer places an order:
```
┌─────────────────────────────────────────────┐
│  💬 Chat with John Doe                      │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─ SYSTEM MESSAGE ─────────────────────┐  │
│  │  🛒 New Order #ORD-1234              │  │
│  │  ┌────┐                              │  │
│  │  │ 📷 │ Retro High Tops x1   $120   │  │
│  │  └────┘                              │  │
│  │  ┌────┐                              │  │
│  │  │ 📷 │ Leather Wallet x2    $150   │  │
│  │  └────┘                              │  │
│  │  ──────────────────────              │  │
│  │  Total: $270                         │  │
│  │  Status: ⏳ Awaiting Confirmation     │  │
│  │                                      │  │
│  │  [✅ Confirm] [❌ Decline]           │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  John: Hey, do you have size 10?            │
│                                             │
│                   Seller: Yes! Let me check  │
│                   the stock for you.         │
│                                             │
│  ┌─ PAYMENT ────────────────────────────┐  │
│  │  💳 Request Payment                   │  │
│  │  Amount: $270                         │  │
│  │  [Send Payment Link]                  │  │
│  └──────────────────────────────────────┘  │
│                                             │
├─────────────────────────────────────────────┤
│ [Type a message...          ] [📎] [Send]  │
└─────────────────────────────────────────────┘
```

### 3.4 BUYER FLOW (DETAILED)

#### 3.4.1 Buyer Dashboard / Store Discovery

```
┌──────────────────────────────────────────────────────┐
│  [Logo] ChatMarket     [🔍 Search] [💬 2] [Avatar]  │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Good evening, Sarah! 👋                              │
│                                                       │
│  ┌─ BROWSE STORES ───────────────────────────────┐   │
│  │  [All] [Fashion] [Electronics] [Food] [Home]   │   │
│  │                                                 │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐       │   │
│  │  │  Store A  │ │  Store B  │ │  Store C  │       │   │
│  │  │  Logo     │ │  Logo     │ │  Logo     │       │   │
│  │  │  "Sneaker │ │  "Coffee  │ │  "Tech    │       │   │
│  │  │   Haven"  │ │   Roast"  │ │   Hub"    │       │   │
│  │  │  42 items │ │  18 items │ │  95 items │       │   │
│  │  │  ⭐ 4.8  │ │  ⭐ 4.5  │ │  ⭐ 4.9  │       │   │
│  │  └──────────┘ └──────────┘ └──────────┘       │   │
│  └────────────────────────────────────────────────┘   │
│                                                       │
│  ┌─ YOUR RECENT CHATS ──────────────────────────┐    │
│  │  Sneaker Haven - "Your order is shipped!" 2m  │    │
│  │  Coffee Roast - "Thanks for your order" 1h    │    │
│  └───────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

#### 3.4.2 Buyer Enters a Store

```
┌──────────────────────────────────────────────────────┐
│  [← Back]  Sneaker Haven              [💬 Chat]     │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │  🏪 Sneaker Haven                                │ │
│  │  "Premium sneakers for every style"               │ │
│  │  ⭐ 4.8  •  42 products  •  Est. 2024            │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  [All] [High Tops] [Running] [Casual] [Limited]       │
│                                                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│  │         │ │         │ │         │                │
│  │  📷     │ │  📷     │ │  📷     │                │
│  │         │ │         │ │         │                │
│  │ $120    │ │ $250    │ │ $89     │                │
│  │ Retro   │ │ Air Max │ │ Classic │                │
│  │ [Add🛒] │ │ [Add🛒] │ │ [Add🛒] │                │
│  └─────────┘ └─────────┘ └─────────┘                │
│                                                       │
│  ┌─────────────────────────────────────────────┐     │
│  │  🛒 Cart (2 items) - $370    [View Cart →]  │     │
│  └─────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
```

#### 3.4.3 Buyer Checkout (THE KEY FLOW)

This is where ChatMarket differentiates itself. Checkout happens INSIDE a chat.

```
Buyer clicks "View Cart" or "Checkout"
        │
        ▼
┌─────────────────────────────────────────────────┐
│  💬 Chat with Sneaker Haven                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌─ SYSTEM ────────────────────────────────┐    │
│  │  Welcome to Sneaker Haven! 👟            │    │
│  │  How can we help you today?              │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ┌─ YOUR ORDER ────────────────────────────┐    │
│  │  📦 Order Summary                        │    │
│  │                                          │    │
│  │  ┌────┐ Retro High Tops        $120     │    │
│  │  │ 📷 │ Size: 10  Qty: 1               │    │
│  │  └────┘ [- 1 +]         [Remove]        │    │
│  │                                          │    │
│  │  ┌────┐ Air Max Limited         $250     │    │
│  │  │ 📷 │ Size: 9   Qty: 1               │    │
│  │  └────┘ [- 1 +]         [Remove]        │    │
│  │                                          │    │
│  │  ─────────────────────────────           │    │
│  │  Subtotal:                      $370     │    │
│  │  Shipping:                      FREE     │    │
│  │  Total:                         $370     │    │
│  │                                          │    │
│  │  [💳 Pay $370]                           │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  You: Hey, is the Air Max true to size?          │
│                                                  │
│            Seller: Yes! We recommend your         │
│            regular size. These fit perfectly.     │
│                                                  │
├─────────────────────────────────────────────────┤
│ [Type a message...            ] [📎] [Send]     │
└─────────────────────────────────────────────────┘
```

#### 3.4.4 Payment Flow (In-Chat)

```
Buyer clicks [💳 Pay $370]
        │
        ▼
┌─ PAYMENT MODAL (overlays chat) ──────────────┐
│                                                │
│  💳 Complete Payment                           │
│                                                │
│  Amount: $370.00                               │
│                                                │
│  Payment Method:                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  💳      │ │  🏦      │ │  📱      │      │
│  │  Card    │ │  Bank    │ │  UPI     │      │
│  └──────────┘ └──────────┘ └──────────┘      │
│                                                │
│  Card Number: [____ ____ ____ ____]           │
│  Expiry:      [MM/YY]  CVV: [___]            │
│  Name:        [_____________________]         │
│                                                │
│  [Cancel]              [Pay $370 →]           │
│                                                │
│  🔒 Secured by ChatMarket Pay                 │
└────────────────────────────────────────────────┘
        │
        ▼ (After payment)

Chat automatically shows:
┌─ SYSTEM ────────────────────────────────┐
│  ✅ Payment Successful!                  │
│  $370.00 paid via Visa •••• 4242        │
│  Transaction ID: TXN-98765              │
│                                          │
│  Your order #ORD-1234 is confirmed!     │
│  The seller has been notified.           │
└──────────────────────────────────────────┘
```

---

## 4. DESIGN SYSTEM

### 4.1 Brand Identity

**Name:** ChatMarket
**Tagline:** "Buy & Sell Through Conversations"
**Design Language:** Modern, clean, warm with trust-building elements

### 4.2 Color Palette

```
Primary:        #1A1A2E    (Deep Navy - Trust, Premium)
Secondary:      #16213E    (Dark Blue - Depth)
Accent:         #0F3460    (Royal Blue - Actions)
Success:        #00C897    (Mint Green - Payments, Confirmations)
Warning:        #F59E0B    (Amber)
Error:          #EF4444    (Red)
Chat Buyer:     #E8F4FD    (Light Blue bubble)
Chat Seller:    #F0F0F0    (Light Gray bubble)
Background:     #FAFBFC    (Off-white)
Surface:        #FFFFFF    (White cards)
Text Primary:   #1A1A2E
Text Secondary: #6B7280
```

### 4.3 Typography

```
Headings:    Inter (800 weight) - Clean, modern, professional
Body:        Inter (400/500)    - Highly readable
Monospace:   JetBrains Mono     - Prices, order IDs
```

### 4.4 Component Design Tokens

```
Border Radius:
  - Small:    8px   (buttons, inputs)
  - Medium:   12px  (cards)
  - Large:    16px  (modals, panels)
  - Full:     9999px (pills, avatars)

Shadows:
  - Subtle:   0 1px 3px rgba(0,0,0,0.08)
  - Card:     0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.08)
  - Elevated: 0 10px 25px rgba(0,0,0,0.1)
  - Modal:    0 20px 60px rgba(0,0,0,0.15)

Spacing Scale: 4px base (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)
```

---

## 5. COMPONENT ARCHITECTURE

### 5.1 File Structure (New)

```
/
├── App.tsx                       # Root with routing + context providers
├── types.ts                      # All TypeScript interfaces
├── constants.ts                  # Brand, mock data, config
├── index.tsx                     # Entry point
├── index.html                    # HTML template (new design system)
│
├── contexts/
│   ├── AuthContext.tsx            # User auth state
│   ├── ChatContext.tsx            # Conversations & messages
│   └── StoreContext.tsx           # Store & product state
│
├── components/
│   ├── landing/
│   │   ├── LandingPage.tsx       # Full landing page
│   │   ├── LandingHero.tsx       # Hero section
│   │   ├── HowItWorks.tsx        # 3-step explanation
│   │   ├── FeaturedStores.tsx    # Store carousel
│   │   └── LandingFooter.tsx     # Footer
│   │
│   ├── auth/
│   │   ├── AuthModal.tsx         # Login/Signup modal
│   │   └── AuthGuard.tsx         # Route protection
│   │
│   ├── seller/
│   │   ├── SellerDashboard.tsx   # Main seller layout + sidebar
│   │   ├── SellerHome.tsx        # Stats, recent orders overview
│   │   ├── StoreSetupWizard.tsx  # First-time setup questions
│   │   ├── ProductManager.tsx    # Product grid + CRUD
│   │   ├── ProductEditor.tsx     # Add/Edit product form (blank card)
│   │   ├── OrderManager.tsx      # Order list + status management
│   │   └── SellerSettings.tsx    # Store settings
│   │
│   ├── buyer/
│   │   ├── BuyerDashboard.tsx    # Main buyer layout
│   │   ├── StoreDiscovery.tsx    # Browse all stores
│   │   ├── StoreView.tsx         # Single store product listing
│   │   ├── ProductCard.tsx       # Product display card
│   │   └── CartSheet.tsx         # Slide-over cart
│   │
│   ├── chat/
│   │   ├── ChatLayout.tsx        # Chat page layout (sidebar + main)
│   │   ├── ConversationList.tsx  # List of all conversations
│   │   ├── ChatWindow.tsx        # Active chat messages
│   │   ├── ChatInput.tsx         # Message input bar
│   │   ├── OrderCard.tsx         # Order summary in chat
│   │   ├── PaymentCard.tsx       # Payment UI in chat
│   │   └── ProductChatCard.tsx   # Product card shared in chat
│   │
│   └── shared/
│       ├── Navbar.tsx            # Top navigation
│       ├── Sidebar.tsx           # Side navigation
│       ├── Avatar.tsx            # User avatar component
│       ├── Badge.tsx             # Notification badge
│       ├── Modal.tsx             # Reusable modal
│       ├── Button.tsx            # Styled button
│       └── EmptyState.tsx        # Empty state illustrations
│
└── services/
    └── geminiService.ts          # AI service (kept)
```

### 5.2 View/Route Map

```
AppView =
  | 'landing'              → LandingPage
  | 'auth'                 → AuthModal (overlay)
  | 'seller-setup'         → StoreSetupWizard
  | 'seller-dashboard'     → SellerDashboard > SellerHome
  | 'seller-products'      → SellerDashboard > ProductManager
  | 'seller-orders'        → SellerDashboard > OrderManager
  | 'seller-chat'          → SellerDashboard > ChatLayout
  | 'seller-settings'      → SellerDashboard > SellerSettings
  | 'buyer-home'           → BuyerDashboard > StoreDiscovery
  | 'buyer-store'          → BuyerDashboard > StoreView
  | 'buyer-chat'           → BuyerDashboard > ChatLayout
  | 'buyer-orders'         → BuyerDashboard > OrderHistory
```

---

## 6. IMPLEMENTATION PLAN (ORDERED)

### Phase 1: Foundation (Types, Constants, HTML, Contexts)
1. Rewrite `types.ts` with new data models
2. Rewrite `constants.ts` with new brand, mock stores, mock products
3. Rewrite `index.html` with new design system (colors, fonts, CSS)
4. Create `contexts/AuthContext.tsx`
5. Create `contexts/StoreContext.tsx`
6. Create `contexts/ChatContext.tsx`

### Phase 2: Landing Page + Auth
7. Create `components/shared/Button.tsx`, `Modal.tsx`, `Avatar.tsx`, `Badge.tsx`, `EmptyState.tsx`
8. Create `components/landing/LandingHero.tsx`
9. Create `components/landing/HowItWorks.tsx`
10. Create `components/landing/FeaturedStores.tsx`
11. Create `components/landing/LandingFooter.tsx`
12. Create `components/landing/LandingPage.tsx`
13. Create `components/auth/AuthModal.tsx`

### Phase 3: Seller Experience
14. Create `components/shared/Navbar.tsx` (new)
15. Create `components/shared/Sidebar.tsx`
16. Create `components/seller/StoreSetupWizard.tsx`
17. Create `components/seller/SellerDashboard.tsx`
18. Create `components/seller/SellerHome.tsx`
19. Create `components/seller/ProductEditor.tsx`
20. Create `components/seller/ProductManager.tsx`
21. Create `components/seller/OrderManager.tsx`
22. Create `components/seller/SellerSettings.tsx`

### Phase 4: Buyer Experience
23. Create `components/buyer/ProductCard.tsx`
24. Create `components/buyer/StoreDiscovery.tsx`
25. Create `components/buyer/StoreView.tsx`
26. Create `components/buyer/CartSheet.tsx`
27. Create `components/buyer/BuyerDashboard.tsx`

### Phase 5: Chat System (Core Feature)
28. Create `components/chat/OrderCard.tsx`
29. Create `components/chat/PaymentCard.tsx`
30. Create `components/chat/ProductChatCard.tsx`
31. Create `components/chat/ChatInput.tsx`
32. Create `components/chat/ChatWindow.tsx`
33. Create `components/chat/ConversationList.tsx`
34. Create `components/chat/ChatLayout.tsx`

### Phase 6: Wire It All Together
35. Rewrite `App.tsx` with context providers and new routing
36. Delete all old components that are no longer used
37. Test all flows end-to-end

---

## 7. CRITICAL DESIGN DECISIONS

### 7.1 Why Chat-First Commerce?

| Traditional E-commerce | ChatMarket |
|----------------------|------------|
| Add to cart → Checkout page → Payment form → Confirmation email | Add to cart → Chat opens → Pay in chat → Instant confirmation in chat |
| Customer support = separate page | Customer support = same chat thread |
| Order tracking = email + tracking page | Order tracking = chat updates |
| Impersonal, transactional | Personal, conversational |

### 7.2 Payment Strategy

Since this is a frontend-only demo, we implement a **simulated payment flow** that mirrors real payment gateways:
- Card number input with validation (Luhn check)
- Mock processing delay (1.5 seconds)
- Success confirmation in chat
- In production: would integrate Stripe Elements or Razorpay

### 7.3 Multi-User Simulation

Since there's no backend:
- Users are stored in `localStorage` as an array
- Login checks against stored users
- "Current user" is tracked in `AuthContext`
- Conversations are matched by `buyerId + sellerId`
- A demo seller account is pre-seeded so buyers can immediately shop

### 7.4 Real-Time Simulation

Without WebSockets:
- Chat messages are stored in localStorage
- A `setInterval` polls for new messages every 2 seconds
- Auto-scroll to latest message
- Notification badges update on poll

---

## 8. PLAN RATING & IMPROVEMENTS

### Rating: 8.5/10

**Strengths:**
- Chat-first commerce is a genuine differentiator
- Clean separation of buyer/seller experiences
- Product management with blank card pattern is intuitive
- Payment in chat reduces friction massively
- Modern, professional design system

**Risks & Mitigations:**
- **No real backend:** Acceptable for MVP/demo. Data persists in localStorage.
- **No real payments:** Mock payment flow is clearly labeled. Production would use Stripe.
- **No real-time:** Polling every 2 seconds is acceptable for demo.
- **Single browser:** Both buyer and seller operate in same browser. We seed demo data to make this feel natural.

**Future Enhancements (Not in this build):**
- WebSocket real-time chat
- Push notifications
- Image upload to cloud storage
- Order shipment tracking
- Store analytics with charts
- AI-powered product recommendations
- Multi-language support
