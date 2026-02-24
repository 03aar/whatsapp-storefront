# CLAUDE.md — ChatMarket Project Guide

## What Is This Project?

**ChatMarket** is a chat-first commerce platform where every purchase is a conversation. Sellers create stores, list products, and manage orders. Buyers browse stores, add products to cart, and check out inside a chat thread. Payments, order confirmations, and customer support all happen in the same conversation.

**Tagline:** "Buy & Sell Through Conversations"

**Core Differentiator:** The chatbox IS the checkout. The chatbox IS the receipt. The chatbox IS customer support. No redirects, no external apps, no friction.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | React 19 + TypeScript | Functional components, hooks only |
| Build | Vite 6 | Dev server on port 3000, host 0.0.0.0 |
| Styling | Tailwind CSS (CDN) + Custom CSS | Design system in index.html style block |
| AI | Google Gemini 2.5 Flash | Via @google/genai SDK, env var GEMINI_API_KEY |
| Storage | localStorage | Simulated multi-user persistence (no backend) |
| Payments | Mock in-chat flow | Card/Bank/UPI payment modal in chat |
| Routing | State-based (AppView) | No react-router, view state in App.tsx |
| Font | Inter (Google Fonts) | Weights 300-900 |

**No backend. No database. No WebSockets.** Frontend-only MVP. All data in localStorage with demo accounts pre-seeded.

---

## Project Structure

```
/
├── App.tsx                          # Root: context providers + view routing
├── index.tsx                        # React entry point
├── index.html                       # HTML + full CSS design system + animation engine
├── types.ts                         # All TypeScript interfaces and type aliases
├── constants.ts                     # Brand config, demo data, categories, currencies
├── PLAN.md                          # Architecture plan and user flow diagrams
├── package.json                     # React 19, Vite 6, @google/genai
├── tsconfig.json                    # ES2022, bundler resolution, JSX react-jsx
├── vite.config.ts                   # Port 3000, GEMINI_API_KEY env, @ alias
│
├── contexts/
│   ├── AuthContext.tsx              # Users, login, signup, session, demo accounts
│   ├── StoreContext.tsx             # Stores, products, cart, orders - full CRUD
│   └── ChatContext.tsx              # Conversations, messages, unread counts
│
├── services/
│   └── geminiService.ts            # Gemini AI helper functions
│
├── components/
│   ├── landing/                    # Marketing homepage (8 files)
│   │   ├── LandingPage.tsx         # Wrapper: scroll-aware navbar + all sections
│   │   ├── LandingHero.tsx         # Typewriter, parallax, 3D chat mockup
│   │   ├── StatsBar.tsx            # Animated counters (IntersectionObserver)
│   │   ├── HowItWorks.tsx          # 3-step cards with scroll reveals
│   │   ├── FeaturedStores.tsx      # 3D tilt store cards (mouse tracking)
│   │   ├── Testimonials.tsx        # Auto-rotating carousel (5s interval)
│   │   ├── CTASection.tsx          # Mouse-tracking gradient CTA
│   │   └── LandingFooter.tsx       # Dark footer with social links
│   │
│   ├── auth/
│   │   └── AuthModal.tsx           # Login/signup modal with role picker
│   │
│   ├── seller/                     # Seller dashboard (7 files)
│   │   ├── SellerDashboard.tsx     # Layout: sidebar + content area
│   │   ├── SellerHome.tsx          # Stats cards + recent orders
│   │   ├── StoreSetupWizard.tsx    # 5-step onboarding wizard
│   │   ├── ProductManager.tsx      # Product grid with blank add card
│   │   ├── ProductEditor.tsx       # Add/edit product form overlay
│   │   ├── OrderManager.tsx        # Order list with status dropdowns
│   │   └── SellerSettings.tsx      # Store settings + logout
│   │
│   ├── buyer/                      # Buyer experience (5 files)
│   │   ├── BuyerDashboard.tsx      # Layout: top navbar + content
│   │   ├── StoreDiscovery.tsx      # Browse stores, search, category filter
│   │   ├── StoreView.tsx           # Single store: header + product grid
│   │   ├── ProductCard.tsx         # Product card with add-to-cart
│   │   └── CartSheet.tsx           # Slide-over cart grouped by store
│   │
│   └── chat/                       # Chat system (5 files)
│       ├── ChatLayout.tsx          # 2-column: conversation list + window
│       ├── ConversationList.tsx    # Sidebar with avatars, last msg, unread
│       ├── ChatWindow.tsx          # Messages area + input bar
│       ├── OrderCard.tsx           # Order summary card inside chat
│       └── PaymentCard.tsx         # Payment modal (card/bank/UPI)
```

Total: ~30 source files, ~5,000+ lines of TypeScript/TSX

---

## Data Architecture

### Context Providers (wrap entire app in App.tsx)

```
<AuthProvider>          <- User auth, login/signup, session
  <StoreProvider>       <- Stores, products, cart, orders
    <ChatProvider>      <- Conversations, messages, unread counts
      <AppContent />    <- All views rendered here
    </ChatProvider>
  </StoreProvider>
</AuthProvider>
```

### Core Data Models (defined in types.ts)

| Model | Key Fields | localStorage Key |
|-------|-----------|-----------------|
| User | id, email, password, name, role (seller/buyer) | chatmarket_users |
| Store | id, sellerId, name, logo, banner, currency, setupAnswers, rating, totalSales | chatmarket_stores |
| Product | id, storeId, name, price, description, image, stock, variants, isActive | chatmarket_products |
| CartItem | productId, storeId, name, price, image, quantity | chatmarket_cart |
| Order | id, storeId, buyerId, sellerId, items[], total, status, paymentStatus, conversationId | chatmarket_orders |
| Conversation | id, storeId, buyerId, sellerId, lastMessage, unreadBuyer, unreadSeller | chatmarket_conversations |
| ChatMessage | id, conversationId, senderId, senderRole, type, content, metadata | chatmarket_messages |

### Chat Message Types

- `text` - Regular chat message
- `order_card` - Order summary with confirm/decline/pay buttons
- `payment_request` - Payment prompt
- `payment_complete` - Payment confirmation
- `product_card` - Shared product in chat
- `system` - System notification

### Order Status Flow

```
pending -> confirmed -> shipped -> delivered
   \-> cancelled (at any point)
```

### Payment Status Flow

```
unpaid -> paid -> refunded
```

---

## Navigation / Routing

No react-router. Navigation is state-driven via `view: AppView` in App.tsx.

```typescript
type AppView =
  | 'landing'            // LandingPage (unauthenticated)
  | 'seller-setup'       // StoreSetupWizard (first-time seller)
  | 'seller-dashboard'   // SellerHome (stats + recent orders)
  | 'seller-products'    // ProductManager
  | 'seller-orders'      // OrderManager
  | 'seller-chat'        // ChatLayout (seller side)
  | 'seller-settings'    // SellerSettings
  | 'buyer-home'         // StoreDiscovery
  | 'buyer-store'        // StoreView (browsing a specific store)
  | 'buyer-chat'         // ChatLayout (buyer side)
  | 'buyer-orders'       // BuyerOrders (inline component in App.tsx)
```

The navigate(view) callback is passed down to components. view.startsWith('seller-') renders seller layout, view.startsWith('buyer-') renders buyer layout.

---

## Key User Flows

### Seller Flow

1. Click "Start Selling" on landing -> AuthModal (signup as seller)
2. StoreSetupWizard: business type -> category -> store details -> audience/shipping -> first product
3. SellerDashboard: sidebar nav between Home / Chat / Products / Orders / Settings
4. Receive orders in chat -> Confirm/Decline -> Track status

### Buyer Flow

1. Click "Start Shopping" on landing -> AuthModal (signup as buyer)
2. StoreDiscovery: browse stores, search, filter by category
3. StoreView: browse products, add to cart
4. CartSheet: review items grouped by store -> "Checkout via Chat"
5. Chat opens with order card -> Pay via PaymentCard modal -> Confirmation in chat

### Chat Checkout Flow (the core innovation)

1. Buyer clicks "Checkout via Chat" in CartSheet
2. App finds or creates conversation between buyer and store seller
3. App creates order with status=pending, paymentStatus=unpaid
4. System sends order_card message in chat with order details
5. Seller can Confirm or Decline the order
6. Buyer clicks "Pay" -> PaymentCard modal (card/bank/UPI options)
7. Payment completes -> system sends payment_complete message
8. Order updated to paymentStatus=paid

---

## Design System

### Color Palette (CSS custom properties in index.html)

| Token | Value | Usage |
|-------|-------|-------|
| --color-primary | #1A1A2E | Deep navy - headings, dark backgrounds |
| --color-secondary | #16213E | Dark blue - depth |
| --color-accent | #0F3460 | Royal blue - buttons, links |
| --color-success | #00C897 | Mint green - payments, confirmations, CTAs |
| --color-warning | #F59E0B | Amber - pending states |
| --color-error | #EF4444 | Red - errors, cancellations |
| --chat-buyer | #E8F4FD | Light blue - buyer chat bubbles |
| --chat-seller | #F0F0F0 | Light gray - seller chat bubbles |

### CSS Utility Classes

- **Buttons:** .btn, .btn-primary, .btn-success, .btn-outline, .btn-ghost
- **Cards:** .card, .card-elevated
- **Chat:** .bubble-buyer, .bubble-seller, .bubble-system
- **Layout:** .sidebar-item, .input, .badge, .modal-overlay
- **Glass:** .glass, .glass-dark (glassmorphism with backdrop-blur)
- **Gradients:** .gradient-text, .gradient-text-animated, .mesh-gradient

### Animation Engine (CSS @keyframes in index.html)

| Animation | Class | Description |
|-----------|-------|-------------|
| fadeIn | .animate-fade-in | Opacity + translateY entrance |
| slideUp | .animate-slide-up | Slide up from below |
| float | .animate-float | Gentle vertical oscillation |
| floatSlow | .animate-float-slow | Slow floating for particles |
| pulse-dot | .animate-pulse-dot | Online indicator pulse |
| morphBlob | .animate-morph | Border-radius morphing blobs (12s) |
| gradientShift | .animate-gradient | Background position animation |
| glowPulse | .animate-glow | Box-shadow glow pulse (3s) |
| bounceIn | .animate-bounce-in | Elastic bounce entrance |
| bgPan | .animate-bg-pan | Slow background pan (15s) |
| marquee | .animate-marquee | Horizontal scrolling text |
| orbitSpin | (inline) | Circular orbit rotation |
| orbitSpinReverse | (inline) | Reverse circular orbit |
| typewriter-cursor | (inline) | Blinking cursor |

Scroll-triggered reveals (via IntersectionObserver):
- .reveal, .reveal-left, .reveal-right, .reveal-scale
- .reveal-delay-1 through .reveal-delay-6

---

## Context API Reference

### AuthContext

**State:** user, users[], isAuthenticated

| Method | Description |
|--------|-------------|
| login(email, password) | Returns { success, error } |
| signup(name, email, password, role) | Creates user, returns { success, error } |
| logout() | Clears session |
| switchUser(userId) | For demo/testing multi-user |

localStorage: chatmarket_users, chatmarket_session

### StoreContext

**State:** stores[], products[], orders[], cart[], activeStoreId

| Method | Description |
|--------|-------------|
| getStore(id) | Find store by ID |
| getStoreByOwner(sellerId) | Find seller's store |
| getStoreProducts(storeId) | Get active products for store |
| getStoreOrders(storeId) | Get orders for store |
| getBuyerOrders(buyerId) | Get buyer's order history |
| createStore(data) | Create new store |
| updateStore(store) | Update store details |
| addProduct(data) | Add product to store |
| updateProduct(product) | Update product |
| deleteProduct(id) | Delete product |
| addToCart(item) | Add or increment cart item |
| removeFromCart(productId) | Remove from cart |
| updateCartQuantity(id, qty) | Change quantity |
| clearCart() | Empty entire cart |
| getCartTotal() | Sum all cart items |
| getCartByStore(storeId) | Filter cart by store |
| createOrder(data) | Create new order |
| updateOrder(id, updates) | Update order status/payment |

localStorage: chatmarket_stores, chatmarket_products, chatmarket_orders, chatmarket_cart

### ChatContext

**State:** conversations[], messages[], activeConversationId

| Method | Description |
|--------|-------------|
| getConversation(id) | Find conversation by ID |
| getConversationByParties(buyerId, storeId) | Find existing conversation |
| getConversationMessages(convoId) | Get messages sorted by timestamp |
| getUserConversations(userId, role) | Get conversations sorted by last message |
| getUnreadCount(userId, role) | Count unread messages |
| createConversation(data) | Create new conversation |
| sendMessage(data) | Send message, update lastMessage + unread |
| markConversationRead(convoId, role) | Mark all messages as read |

localStorage: chatmarket_conversations, chatmarket_messages

---

## Demo Data (constants.ts)

### Demo Accounts

| Role | Email | Password | Name |
|------|-------|----------|------|
| Seller | seller@demo.com | demo123 | Alex Rivera |
| Buyer | buyer@demo.com | demo123 | Sarah Chen |

### Demo Stores (3 pre-seeded)

1. **Sneaker Haven** - Premium sneakers, 6 products ($65-$350)
2. **Coffee Roast Co.** - Artisanal coffee, 3 products ($18-$45)
3. **TechPulse** - Gadgets and accessories, 3 products ($129-$350)

### Other Constants

- BRAND_NAME = "ChatMarket"
- BRAND_TAGLINE = "Buy & Sell Through Conversations"
- STORE_CATEGORIES = [All, Fashion, Electronics, Home, Beauty, Food, Art, Books, Sports]
- CURRENCY_OPTIONS = [USD, EUR, INR, GBP]
- ORDER_STATUSES with colors: pending (amber), confirmed (purple), shipped (blue), delivered (green), cancelled (red)
- PAYMENT_STATUSES: unpaid (red), paid (green), refunded (amber)
- generateId() helper - creates 8-char random string IDs

---

## Landing Page Section Order

```
LandingPage.tsx renders:
  1. Navbar (fixed, transparent -> glass on scroll)
  2. LandingHero (typewriter headline + 3D chat mockup with mouse parallax)
  3. StatsBar (animated counters: 2500+ sellers, 50k msgs, 99.9% uptime, 4.9 rating)
  4. HowItWorks (3 cards: Create Store -> Chat with Buyers -> Get Paid)
  5. FeaturedStores (3 demo stores with 3D tilt on hover)
  6. Testimonials (4 rotating testimonials, auto-advance every 5s)
  7. CTASection (mouse-tracking radial gradient, animated seller count, orbiting rings)
  8. LandingFooter (dark theme, social icons, system status indicator)
```

---

## Development Commands

```bash
npm run dev      # Start Vite dev server (port 3000)
npm run build    # Production build
npm run preview  # Preview production build
npx tsc --noEmit # Type check (ignore @types/node error - pre-existing)
```

### Environment Variables

- GEMINI_API_KEY - Required for AI features (via .env file)

---

## Known Limitations (by design - this is an MVP)

1. **localStorage only** - No backend, no database. Data is per-browser.
2. **No real payments** - PaymentCard is a mock. Production would use Stripe/Razorpay.
3. **No real-time chat** - No auto-refresh. Both users in same browser session.
4. **No image upload** - Products use URL strings (Unsplash placeholders).
5. **No URL routing** - Browser back/forward does not work.
6. **No search indexing** - Simple .filter() with .includes().
7. **Passwords in plain text** - Demo only.
8. **Single browser multi-user** - Seller and buyer share localStorage.

---

## Code Conventions

- No external UI library - all components hand-built with Tailwind + custom CSS
- No animation library - pure CSS @keyframes + IntersectionObserver
- Context for state management - no Redux, no Zustand
- Inline styles only when dynamic (mouse transforms, conditional delays)
- generateId() from constants.ts for all entity IDs
- Currency inherited from store config
- Tailwind via CDN - no tailwind.config.js
- All components are React.FC with typed props interfaces

---

## Production Roadmap (future)

If scaling beyond MVP:
- **Backend:** Node.js/Express or Next.js API routes
- **Database:** PostgreSQL + Redis
- **Real-time:** Socket.io or WebSockets for live chat
- **Payments:** Stripe Connect or Razorpay
- **Search:** Meilisearch or Elasticsearch
- **Auth:** Supabase Auth or Auth0
- **Storage:** Cloudinary or S3 for images
- **CI/CD:** GitHub Actions -> Vercel/Railway
- **Monitoring:** Sentry + PostHog
