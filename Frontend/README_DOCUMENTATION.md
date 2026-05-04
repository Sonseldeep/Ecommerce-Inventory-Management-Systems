# E-Commerce Frontend Application - Comprehensive Documentation

A modern, full-featured e-commerce frontend application built with React, Vite, and JavaScript. This project demonstrates a complete e-commerce ecosystem with role-based access control, real-time updates, cart management, and comprehensive admin dashboard.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Key Concepts](#key-concepts)
- [Backend Integration](#backend-integration)
- [Data Flow & Workflow](#data-flow--workflow)
- [Installation & Setup](#installation--setup)
- [Available Scripts](#available-scripts)
- [Authentication & Authorization](#authentication--authorization)
- [State Management](#state-management)
- [Real-time Features](#real-time-features)
- [API Integration](#api-integration)

---

## 🎯 Project Overview

This is a comprehensive e-commerce platform frontend that serves both **Customer** and **Admin** roles. The application provides:

- **Customer Features**: Product browsing, shopping cart, checkout, order management, address management
- **Admin Features**: Dashboard analytics, product management, category management, order tracking, real-time notifications
- **Real-time Updates**: Live product inventory, notifications, and analytics using SignalR
- **Secure Authentication**: JWT-based token management with refresh token rotation
- **Data Export**: Export analytics and orders to Excel/PDF formats

---

## 🛠️ Tech Stack

### Core Frontend Framework
- **React** (19.2.5) - UI library for building component-based interfaces
- **React Router DOM** (7.14.2) - Client-side routing and navigation
- **Vite** (8.0.10) - Ultra-fast build tool and development server

### Styling & UI Components
- **Tailwind CSS** (4.2.4) - Utility-first CSS framework for responsive design
- **DevExtreme React** (25.2.6) - Rich UI components (data grids, charts, modals)
- **React Icons** (5.6.0) - Comprehensive icon library for UI elements
- **Recharts** (3.8.1) - Composable charting library for data visualization

### State Management & Context
- **React Context API** - Built-in state management for Auth and Cart contexts
- **Local Storage** - Persistent storage for tokens and user data

### API & Communication
- **Axios** (1.15.2) - HTTP client for API requests with interceptors
- **@microsoft/signalr** (10.0.0) - Real-time bidirectional communication protocol

### File Export & Utilities
- **ExcelJS** (4.4.0) - Generate Excel spreadsheets (.xlsx)
- **jsPDF** (4.2.1) - Generate PDF documents
- **file-saver** (2.0.5) - Save files to user's device

### Toast Notifications
- **react-hot-toast** (2.6.0) - Beautiful toast notifications for user feedback

### Development Tools
- **ESLint** (10.2.1) - Code linting and quality checks
- **Tailwind CSS Vite** (4.2.4) - Vite integration for Tailwind CSS

---

## ✨ Features

### 🛍️ Customer Features
- **Product Browsing**: View all products with search and filtering capabilities
- **Product Details**: Comprehensive product information, reviews, and specifications
- **Shopping Cart**: Add/remove items, quantity management with real-time sync
- **Checkout**: Multi-step checkout process with address validation
- **Order Management**: Track orders, view order history, order status updates
- **Address Management**: Manage multiple delivery addresses
- **User Profile**: Update profile information and preferences
- **Password Management**: Change password with security validations
- **Email Verification**: OTP-based email verification during registration
- **Password Recovery**: Forgot password and reset functionality

### 👑 Admin Features
- **Dashboard Analytics**: Real-time analytics with key metrics
  - Total revenue, orders, products
  - Top-selling products
  - Sales trends and performance charts
- **Product Management**: CRUD operations for products with image uploads
- **Category Management**: Create and manage product categories
- **Order Management**: Track all orders, update order status, manage fulfillment
- **Real-time Notifications**: Receive notifications for new orders and updates
- **Data Export**: Export analytics and orders to Excel/PDF formats
- **Analytics Visualization**: Charts and graphs for business insights

### 🔐 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Token Refresh**: Automatic token refresh with refresh token rotation
- **Role-Based Access Control (RBAC)**: Different access levels for Customer and Admin
- **Protected Routes**: Route-level protection based on user roles
- **Secure Storage**: Tokens stored in localStorage with XSS considerations

### ⚡ Real-time Features
- **Live Product Updates**: Real-time product inventory changes across all users
- **Admin Notifications**: Instant notifications for new orders and events
- **Live Analytics**: Real-time dashboard updates for admins

---

## 🏗️ Project Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│           React Frontend Application                 │
│                                                       │
│  ┌───────────────────────────────────────────────┐  │
│  │         Main App Component (App.jsx)          │  │
│  │  - BrowserRouter Setup                        │  │
│  │  - Global Providers (Auth, Cart)              │  │
│  │  - Toast Notifications                        │  │
│  └───────────────────────────────────────────────┘  │
│           │           │           │                  │
│  ┌────────▼──┐   ┌────▼──────┐   ┌─▼──────────┐    │
│  │ Auth      │   │ Cart      │   │ Protected  │    │
│  │ Context   │   │ Context   │   │ Routes     │    │
│  └────────┬──┘   └────┬──────┘   └─┬──────────┘    │
│           │           │           │                 │
│  ┌────────▼───────────▼───────────▼──────────┐     │
│  │      Route Definitions & Layouts           │     │
│  │  - Public Routes (Auth pages)              │     │
│  │  - Protected Customer Routes               │     │
│  │  - Protected Admin Routes                  │     │
│  └─────────────────────────────────────────┬──┘    │
│                                             │        │
│  ┌──────────────────────────────────────────▼──┐   │
│  │     Components & Pages Layer                 │   │
│  │  - Admin Components & Pages                 │   │
│  │  - User Components & Pages                  │   │
│  │  - Reusable Layout Components              │   │
│  └──────────────────────────────────────────┬──┘   │
│                                             │        │
│  ┌──────────────────────────────────────────▼──┐   │
│  │     Hooks & Business Logic Layer            │   │
│  │  - useProducts                             │   │
│  │  - useCategories                           │   │
│  │  - useOrders                               │   │
│  │  - useAdminAnalyticsRealtime               │   │
│  │  - userProductRealtime                     │   │
│  └──────────────────────────────────────────┬──┘   │
│                                             │        │
│  ┌──────────────────────────────────────────▼──┐   │
│  │     API Layer & Utilities                   │   │
│  │  - API Modules (axiosClient, interceptors) │   │
│  │  - Real-time Hub (SignalR)                 │   │
│  │  - JWT Utils                               │   │
│  │  - Export Helpers (Excel, PDF)             │   │
│  └──────────────────────────────────────────┬──┘   │
│                                             │        │
└─────────────────────────────────────────────▼──────┘
                                              │
                        ┌─────────────────────▼──────────────┐
                        │   Backend API (ASP.NET Core)       │
                        │   https://localhost:7278/api       │
                        │                                     │
                        │  - Authentication Endpoints        │
                        │  - Product Management              │
                        │  - Order Management                │
                        │  - Admin Dashboard                 │
                        │  - SignalR Hubs                    │
                        └──────────────────────────────────┘
```

---

## 📁 Folder Structure

```
src/
│
├── 🌍 api/                          # API Integration Layer
│   ├── axiosClient.js              # Axios HTTP client with interceptors
│   ├── authApi.js                  # Authentication endpoints
│   ├── productApi.js               # Product CRUD operations
│   ├── categoryApi.js              # Category management
│   ├── cartApi.js                  # Shopping cart operations
│   ├── orderApi.js                 # Order management
│   ├── addressApi.js               # Address management
│   ├── userApi.js                  # User profile operations
│   └── adminApi.js                 # Admin operations
│
├── 🎨 components/                  # Reusable Components
│   ├── ProtectedRoute.jsx          # Route guard for authenticated pages
│   └── layout/
│       ├── MainLayout.jsx          # Main app layout wrapper
│       └── AdminNav.jsx            # Admin navigation component
│
├── 📚 context/                      # Global State Management
│   ├── AuthContext.jsx             # Authentication state & methods
│   └── CartContext.jsx             # Shopping cart state
│
├── 🎣 hooks/                       # Custom React Hooks
│   ├── useAdminAnalyticsRealtime.js # Real-time analytics for admins
│   └── userProductRealtime.js      # Real-time product updates
│
├── 📄 pages/                       # Page Components
│   ├── UnauthorizedPage.jsx        # 403 Unauthorized page
│   │
│   ├── auth/                       # Authentication Pages
│   │   ├── LoginPage.jsx           # Login form
│   │   ├── RegisterPage.jsx        # Registration form
│   │   ├── VerifyEmailOtpPage.jsx  # Email OTP verification
│   │   ├── ForgetPasswordPage.jsx  # Forgot password request
│   │   └── ResetPasswordPage.jsx   # Password reset form
│   │
│   ├── user/                       # Customer Pages
│   │   ├── UserHomePage.jsx        # Customer home
│   │   ├── ProductsPage.jsx        # Product listing & search
│   │   ├── ProductDetailsPage.jsx  # Individual product view
│   │   ├── CartPage.jsx            # Shopping cart view
│   │   ├── CheckoutPage.jsx        # Checkout process
│   │   ├── OrdersPage.jsx          # Order history
│   │   ├── AddressesPage.jsx       # Address management
│   │   ├── UserProfilePage.jsx     # User profile
│   │   └── ChnagePasswordPage.jsx  # Password change form
│   │
│   └── admin/                      # Admin Pages & Modules
│       ├── AdminHomePage.jsx       # Admin home/welcome
│       ├── AdminDashboardPage.jsx  # Analytics dashboard
│       ├── AdminCategoriesPage.jsx # Category management
│       ├── AdminProductsPage.jsx   # Product management
│       ├── AdminOrdersPage.jsx     # Order management
│       ├── AdminNotificationBell.jsx # Notifications UI
│       │
│       ├── categories/             # Category Module
│       │   ├── index.jsx           # Category page
│       │   ├── constant.js         # Category constants
│       │   ├── components/
│       │   │   ├── CategoriesGrid.jsx
│       │   │   └── CategoryFormModal.jsx
│       │   ├── hooks/
│       │   │   └── useCategories.js
│       │   └── utils/
│       │       └── exportHelper.js
│       │
│       ├── products/               # Product Module
│       │   ├── index.jsx           # Products page
│       │   ├── constant.js         # Product constants
│       │   ├── components/
│       │   │   ├── ProductsGrid.jsx
│       │   │   ├── ProductFormModal.jsx
│       │   │   ├── ProductsAnalytics.jsx
│       │   │   └── StatCard.jsx
│       │   ├── hooks/
│       │   │   └── useProducts.js
│       │   └── utils/
│       │       ├── chartDataHelper.js
│       │       └── exportHelper.js
│       │
│       └── orders/                 # Order Module
│           ├── index.jsx           # Orders page
│           ├── constants.js        # Order status constants
│           ├── componets/          # (Note: typo in folder name)
│           │   ├── OrderCard.jsx
│           │   ├── OrdersGrid.jsx
│           │   ├── OrderStatusCell.jsx
│           │   └── OrdersToolbar.jsx
│           ├── hooks/
│           │   └── useOrders.js
│           └── utils/
│               └── exportHelpers.js
│
├── ⚡ realtime/                    # Real-time Communication
│   └── signalr.js                  # SignalR hubs configuration
│
├── 🔧 utils/                       # Utility Functions
│   └── jwt.js                      # JWT token parsing & validation
│
├── 📖 constants/                   # Application Constants
│   └── orderStatus.js              # Order status constants
│
├── App.jsx                         # Main App component with routing
├── App.css                         # Global app styles
├── main.jsx                        # React DOM root
└── index.css                       # Global CSS styles

public/                             # Static assets
```

---

## 🔑 Key Concepts

### 1. **Authentication Flow**
- Users login with credentials
- Backend returns `accessToken` and `refreshToken`
- Tokens stored in `localStorage`
- Axios interceptors automatically attach `accessToken` to requests
- When token expires, interceptor uses `refreshToken` to get a new one
- If refresh fails, user is logged out and redirected to login

### 2. **Role-Based Access Control (RBAC)**
- Two roles: **Customer** and **Admin**
- `ProtectedRoute` component checks user role
- Routes are nested and protected based on role requirements
- Unauthorized users redirected to `/unauthorized` page

### 3. **Context API State Management**
- **AuthContext**: Manages user authentication, tokens, login/logout
- **CartContext**: Manages shopping cart item count and refresh logic
- Both contexts provide custom hooks (`useAuth()`, `useCart()`) for easy access

### 4. **API Layer Architecture**
- `axiosClient.js` creates base axios instance with API URL
- Request interceptor adds JWT token to all requests
- Response interceptor handles token refresh logic
- Separate API files for each domain (auth, product, order, etc.)
- All API functions return promises with standardized response format

### 5. **Real-time Communication (SignalR)**
- Two hubs configured:
  - **Products Hub** (public): Real-time product inventory updates
  - **Notifications Hub** (authenticated): User-specific notifications
- Custom hooks (`useAdminAnalyticsRealtime`, `userProductRealtime`) manage connections
- Automatic reconnection on disconnect

### 6. **Module Architecture**
- Each admin feature (products, categories, orders) is self-contained module
- Modules include:
  - Main page component
  - Sub-components
  - Custom hooks for business logic
  - Utility helpers for exports/calculations
  - Constants for module-specific values

### 7. **Data Export Functionality**
- **Excel Export**: Uses ExcelJS to generate formatted Excel files
- **PDF Export**: Uses jsPDF to generate PDF reports
- **CSV Export**: Can be added using built-in JavaScript utilities

### 8. **Form Handling**
- Modal-based forms for creating/editing entities
- Form validation happens both client-side and server-side
- DevExtreme components used for rich UI

### 9. **Cart Management**
- Real-time cart count updates
- Cart persisted on backend
- Cart synced when user authenticates
- Cart count refreshed when items added/removed

### 10. **Toast Notifications**
- `react-hot-toast` used for user feedback
- Success, error, and loading states
- Positioned at top-right corner
- Auto-dismiss after 3 seconds (default)

---

## 🔗 Backend Integration

### Backend Base URL
```javascript
// src/api/axiosClient.js
const API_BASE_URL = "https://localhost:7278/api";
```

### API Endpoints Structure

#### **Authentication Endpoints**
```
POST   /auth/login              - User login
POST   /auth/register           - User registration
POST   /auth/logout             - User logout
POST   /auth/refresh-token      - Refresh access token
POST   /auth/send-otp           - Send OTP to email
POST   /auth/verify-email-otp   - Verify email OTP
POST   /auth/forgot-password    - Request password reset
POST   /auth/reset-password     - Reset password with token
```

#### **Product Endpoints**
```
GET    /products                - Get all products (paginated)
GET    /products/{id}           - Get product details
POST   /products                - Create product (Admin only)
PUT    /products/{id}           - Update product (Admin only)
DELETE /products/{id}           - Delete product (Admin only)
GET    /products/search         - Search products
```

#### **Category Endpoints**
```
GET    /categories              - Get all categories
GET    /categories/{id}         - Get category details
POST   /categories              - Create category (Admin only)
PUT    /categories/{id}         - Update category (Admin only)
DELETE /categories/{id}         - Delete category (Admin only)
```

#### **Cart Endpoints**
```
GET    /cart/my-cart            - Get user's cart
POST   /cart/add-item           - Add item to cart
PUT    /cart/update-item        - Update item quantity
DELETE /cart/remove-item        - Remove item from cart
DELETE /cart/clear              - Clear entire cart
```

#### **Order Endpoints**
```
GET    /orders                  - Get user's orders
GET    /orders/{id}             - Get order details
POST   /orders                  - Create new order
PUT    /orders/{id}/status      - Update order status (Admin)
GET    /admin/orders            - Get all orders (Admin)
```

#### **Address Endpoints**
```
GET    /addresses               - Get user's addresses
POST   /addresses               - Create new address
PUT    /addresses/{id}          - Update address
DELETE /addresses/{id}          - Delete address
```

#### **User Profile Endpoints**
```
GET    /users/profile           - Get user profile
PUT    /users/profile           - Update profile
POST   /users/change-password   - Change password
```

#### **Admin Dashboard Endpoints**
```
GET    /admin/dashboard         - Get dashboard metrics
GET    /admin/analytics         - Get analytics data
GET    /admin/sales-trend       - Get sales trends
GET    /admin/top-products      - Get top selling products
```

#### **Real-time SignalR Hubs**
```
wss://localhost:7278/hubs/products          - Product updates hub
wss://localhost:7278/hubs/notifications     - Notifications hub (authenticated)
```

### Request/Response Format

**Standard Request:**
```javascript
// Headers automatically added by interceptor
{
  "Authorization": "Bearer eyJhbGc..."
}

// Body (example)
{
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "categoryId": 1
}
```

**Standard Response:**
```javascript
{
  "status": 200,
  "message": "Success",
  "data": {
    // Actual response data
  }
}

// Error Response
{
  "status": 400,
  "message": "Error message",
  "errors": {
    "field": ["error details"]
  }
}
```

### Token Management

**Access Token:**
- Short-lived (e.g., 15 minutes)
- Sent with every API request in `Authorization` header
- Contains user claims (id, email, role)

**Refresh Token:**
- Long-lived (e.g., 7 days)
- Stored securely
- Used to obtain new access token when expired
- Rotation: New refresh token issued on each refresh

**JWT Payload Example:**
```javascript
{
  "nameid": "user-id",
  "email": "user@example.com",
  "role": "Admin",
  "iat": 1704067200,
  "exp": 1704067860
}
```

---

## 📊 Data Flow & Workflow

### 1. **User Authentication Flow**

```
┌─────────────┐
│  Login Page │
└──────┬──────┘
       │ User enters credentials
       ▼
┌──────────────────┐
│ Validate Inputs  │
└──────┬───────────┘
       │ Call loginApi()
       ▼
┌──────────────────────────────┐
│ Backend Validates Credentials │
└──────┬───────────────────────┘
       │
       ├─ Valid ──────────────────────┐
       │                               │
       │ Invalid ──────┐               │
       ▼               ▼               ▼
   Error Toast    Login Error    Receive Tokens
                                  │
                                  │ Store tokens in localStorage
                                  │ Set AuthContext state
                                  │ Redirect to /products
                                  ▼
                            ┌──────────────┐
                            │ User Logged  │
                            │   In & Auth  │
                            └──────────────┘
```

### 2. **Product Browsing & Cart Flow**

```
┌──────────────────┐
│ Products Page    │
└────────┬─────────┘
         │ Fetch products via useProducts hook
         ▼
┌──────────────────────────────┐
│ API: GET /products (paginated)
└────────┬─────────────────────┘
         │ Response with products array
         ▼
┌──────────────────────────────┐
│ Display Products in Grid     │
└────────┬─────────────────────┘
         │ User clicks "Add to Cart"
         ▼
┌──────────────────────────────┐
│ API: POST /cart/add-item     │
└────────┬─────────────────────┘
         │ Item added successfully
         ▼
┌──────────────────────────────┐
│ Cart Context: Refresh Count  │
│ Show Success Toast           │
│ Update cart icon badge       │
└──────────────────────────────┘
```

### 3. **Order Checkout Flow**

```
┌──────────────┐
│ Cart Page    │
└────────┬─────┘
         │ Review items
         │ Click "Proceed to Checkout"
         ▼
┌─────────────────────────┐
│ Checkout Page           │
│ - Address selection     │
│ - Payment method        │
│ - Order review          │
└────────┬────────────────┘
         │ User clicks "Place Order"
         ▼
┌──────────────────────────────┐
│ API: POST /orders            │
│ Body: { addressId, items }   │
└────────┬─────────────────────┘
         │ Order created successfully
         ▼
┌──────────────────────────────┐
│ - Clear cart                 │
│ - Show success message       │
│ - Redirect to /orders        │
│ - Show new order in list     │
└──────────────────────────────┘
```

### 4. **Admin Dashboard Real-time Flow**

```
┌─────────────────────┐
│ Admin Dashboard     │
└────────┬────────────┘
         │ Page loads
         ▼
┌──────────────────────────────┐
│ - Fetch initial analytics    │
│ - Connect SignalR hubs       │
│ - Setup real-time listeners  │
└────────┬─────────────────────┘
         │ 
         ├─ Analytics Hub ─────┐
         │ (real-time updates) │
         │                     ▼
         │            Dashboard updates
         │            automatically
         │
         └─ Orders Hub ────────┐
                               │
                               ▼
                  New order notification
                  Order list refreshes
```

### 5. **Order Status Update Flow (Admin)**

```
┌──────────────────┐
│ Admin Orders Page│
└────────┬─────────┘
         │ Admin selects order
         │ Changes status dropdown
         ▼
┌──────────────────────────────┐
│ API: PUT /orders/{id}/status │
└────────┬─────────────────────┘
         │ Status updated
         ▼
┌──────────────────────────────┐
│ - Show success toast         │
│ - Order list refreshes       │
│ - SignalR notifies customer  │
│ - Customer receives toast    │
└──────────────────────────────┘
```

### 6. **Real-time Product Inventory Flow**

```
┌──────────────┐
│ All Users    │
│ - Viewing    │
│ - Products   │
└────────┬─────┘
         │ Connected to
         │ Products Hub
         ▼
┌─────────────────────────┐
│ Admin Updates Product   │
│ Inventory              │
└────────┬────────────────┘
         │ Backend broadcasts
         │ update to all clients
         ▼
┌──────────────────────────────┐
│ All connected users receive  │
│ inventory update              │
│ Product quantity refreshes   │
│ UI updates automatically      │
└──────────────────────────────┘
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Backend API** running on `https://localhost:7278`

### Step 1: Navigate to Project
```bash
cd d:\7th_sem_project\e-commerce\Frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all packages listed in `package.json`:
- React and React Router
- Vite and build tools
- Tailwind CSS and UI components
- Axios and SignalR
- Export libraries (ExcelJS, jsPDF, file-saver)

### Step 3: Environment Configuration
The app connects to backend at `https://localhost:7278`. Ensure:
1. Backend API is running and accessible
2. CORS is configured properly on backend
3. SSL certificates are valid for local development

### Step 4: Start Development Server
```bash
npm run dev
```

This starts Vite dev server (typically at `http://localhost:5173`)

---

## 📜 Available Scripts

### Development
```bash
npm run dev
```
- Starts Vite dev server with hot module replacement (HMR)
- Auto-reload on file changes
- Accessible at `http://localhost:5173`

### Build for Production
```bash
npm run build
```
- Creates optimized production build
- Outputs to `dist/` directory
- Tree-shaking and minification applied

### Preview Production Build
```bash
npm run preview
```
- Serves the production build locally
- For testing before deployment

### Linting
```bash
npm run lint
```
- Runs ESLint to check code quality
- Identifies potential issues and style violations
- Uses configured ESLint rules

### Install New Dependencies
```bash
npm install <package-name>
```

### Update Dependencies
```bash
npm update
```

---

## 🔐 Authentication & Authorization

### Authentication Strategy

**JWT (JSON Web Token) Flow:**
```
1. User submits credentials (login)
   ↓
2. Backend validates and returns { accessToken, refreshToken }
   ↓
3. Frontend stores tokens in localStorage:
   - localStorage.setItem("accessToken", token)
   - localStorage.setItem("refreshToken", token)
   ↓
4. Axios interceptor adds token to every request:
   Authorization: Bearer {accessToken}
   ↓
5. Backend validates token on each request
   ↓
6. If token expired (401 response):
   - Use refreshToken to get new accessToken
   - Retry original request
   - If refresh fails → logout user
```

### Protected Routes Implementation

```javascript
// ProtectedRoute.jsx checks:
1. Is user authenticated? (token exists)
2. Does user have required role?
3. If not → redirect to appropriate page

// Usage in App.jsx:
<Route element={<ProtectedRoute roles={["Customer", "Admin"]} />}>
  <Route path="/products" element={<ProductsPage />} />
</Route>

<Route element={<ProtectedRoute roles={["Admin"]} />}>
  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
</Route>
```

### Role-Based Access Levels

**Customer Role:**
- Browse products
- View product details
- Manage shopping cart
- Create orders
- View own orders
- Manage addresses
- Update profile
- Change password

**Admin Role:**
- All customer permissions PLUS:
- View dashboard analytics
- CRUD operations on products
- CRUD operations on categories
- Manage all orders
- Update order status
- View all user orders
- Access admin notifications

---

## 💾 State Management

### AuthContext
**Location:** `src/context/AuthContext.jsx`

**State:**
```javascript
{
  user: {
    id: "user-123",
    email: "user@example.com",
    fullName: "John Doe",
    role: "Customer" | "Admin"
  },
  accessToken: "eyJhbGc...",
  isAuthenticated: boolean
}
```

**Methods:**
- `login(email, password)` - Authenticate user
- `logout()` - Clear session and logout
- `refreshToken()` - Get new access token
- `clearSession()` - Clear all stored data

**Usage:**
```javascript
const { user, isAuthenticated, logout } = useAuth();
```

### CartContext
**Location:** `src/context/CartContext.jsx`

**State:**
```javascript
{
  count: number,  // Total items in cart
  refreshCartCount: function
}
```

**Methods:**
- `refreshCartCount()` - Sync cart count from backend

**Usage:**
```javascript
const { count, refreshCartCount } = useCart();
```

### Cross-Tab Synchronization
AuthContext uses `BroadcastChannel` API to sync logout across browser tabs:
```javascript
// When user logs out in one tab
channel.postMessage("logout");

// All other tabs receive and handle logout
listener: (event) => {
  if (event.data === "logout") {
    clearSession();
    navigate("/login");
  }
}
```

---

## ⚡ Real-time Features

### SignalR Integration

**Product Hub (Public):**
```javascript
// src/realtime/signalr.js
export const createProductsHub = () => {
  return new HubConnectionBuilder()
    .withUrl("https://localhost:7278/hubs/products")
    .withAutomaticReconnect()
    .build();
};

// Listen for updates:
hub.on("ProductInventoryUpdated", (productId, newQuantity) => {
  // Update UI with new inventory
});
```

**Notifications Hub (Authenticated):**
```javascript
export const createNotificationsHub = (token) => {
  return new HubConnectionBuilder()
    .withUrl("https://localhost:7278/hubs/notifications", {
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .build();
};

// Listen for events:
hub.on("OrderNotification", (orderData) => {
  // Show notification toast
});
```

### Real-time Hooks

**useAdminAnalyticsRealtime.js:**
- Connects to analytics updates
- Refreshes dashboard metrics in real-time
- Handles connection lifecycle

**userProductRealtime.js:**
- Connects to product updates
- Updates inventory across UI
- Notifies users of price changes

---

## 🌐 API Integration

### Axios Setup with Interceptors

**Request Interceptor:**
```javascript
// Automatically adds Authorization header
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Response Interceptor:**
```javascript
// Handles 401 and token refresh
axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error?.response?.status === 401) {
      // Attempt token refresh
      // If successful, retry request
      // If fails, logout user
    }
    return Promise.reject(error);
  }
);
```

### API Module Pattern

Each API module follows a standard pattern:

```javascript
// src/api/productApi.js
import axiosClient from "./axiosClient";

export const getProductsApi = (page, pageSize) => {
  return axiosClient.get("/products", {
    params: { page, pageSize }
  });
};

export const createProductApi = (data) => {
  return axiosClient.post("/products", data);
};

export const updateProductApi = (id, data) => {
  return axiosClient.put(`/products/${id}`, data);
};

export const deleteProductApi = (id) => {
  return axiosClient.delete(`/products/${id}`);
};
```

### Error Handling

All API calls include error handling:
```javascript
try {
  const response = await getProductsApi(1, 10);
  const { data } = response.data;  // Extract data
  setProducts(data);
} catch (error) {
  toast.error(error.response?.data?.message || "Error fetching products");
}
```

---

## 📈 Export Functionality

### Excel Export

**Uses:** ExcelJS library

**Example:**
```javascript
const exportToExcel = (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");
  
  // Add headers
  worksheet.columns = Object.keys(data[0]).map(key => ({
    header: key,
    key: key
  }));
  
  // Add rows
  data.forEach(row => worksheet.addRow(row));
  
  // Generate file
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer]);
    saveAs(blob, `${filename}.xlsx`);
  });
};
```

### PDF Export

**Uses:** jsPDF library

**Example:**
```javascript
const exportToPDF = (data, filename) => {
  const doc = new jsPDF();
  doc.text("Report", 10, 10);
  
  // Add content
  doc.autoTable({
    body: data
  });
  
  doc.save(`${filename}.pdf`);
};
```

---

## 🎨 UI/UX Features

### Components Used

- **DevExtreme DataGrid:** For displaying large datasets with sorting/filtering
- **Recharts:** For business analytics visualizations
- **React Icons:** Icon set (100+ icons)
- **React Hot Toast:** Beautiful notifications
- **Tailwind CSS:** Responsive utility-first styling

### Responsive Design
- Mobile-first approach using Tailwind CSS
- Breakpoints: sm, md, lg, xl, 2xl
- All pages responsive on mobile/tablet/desktop

### Loading States
- Skeleton loaders for data tables
- Spinner components for async operations
- Disabled buttons during form submission

---

## 🔍 Key Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.5 | UI library |
| React Router | 7.14.2 | Client-side routing |
| Axios | 1.15.2 | HTTP requests |
| SignalR | 10.0.0 | Real-time communication |
| Tailwind CSS | 4.2.4 | Styling |
| DevExtreme React | 25.2.6 | Rich UI components |
| Recharts | 3.8.1 | Data visualization |
| ExcelJS | 4.4.0 | Excel export |
| jsPDF | 4.2.1 | PDF generation |
| react-hot-toast | 2.6.0 | Toast notifications |
| Vite | 8.0.10 | Build tool |

---

## 📝 Development Workflow

### 1. **Feature Development**
```bash
# Start dev server
npm run dev

# Make changes to components/pages
# HMR will auto-reload browser

# Test locally with backend running
```

### 2. **Code Quality**
```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### 3. **Production Build**
```bash
# Create optimized build
npm run build

# Test production build
npm run preview
```

### 4. **Version Control**
- Commit changes regularly
- Use meaningful commit messages
- Create branches for features

---

## 🐛 Common Issues & Solutions

### CORS Errors
- **Cause:** Backend doesn't allow frontend origin
- **Solution:** Configure CORS on backend for `http://localhost:5173`

### 401 Unauthorized
- **Cause:** Token expired or invalid
- **Solution:** Token refresh interceptor will handle automatically

### SignalR Connection Failed
- **Cause:** Backend hub not running or wrong URL
- **Solution:** Verify backend URL in `signalr.js`

### Blank Page After Login
- **Cause:** Token stored but user context not set
- **Solution:** Check AuthContext initialization logic

---

## 🔒 Security Best Practices

1. **Token Storage:** Tokens stored in localStorage (consider httpOnly cookies for production)
2. **HTTPS Only:** Always use HTTPS in production
3. **Token Expiration:** Access tokens short-lived, refresh tokens long-lived
4. **XSS Protection:** Sanitize user inputs in forms
5. **CSRF Protection:** Backend should handle CSRF tokens
6. **Role Validation:** Always validate roles server-side
7. **Secure Headers:** Implement Content-Security-Policy headers

---

## 📞 Contact & Support

For questions or issues related to this frontend:
1. Check backend API documentation
2. Review component prop types
3. Check browser console for errors
4. Verify backend is running and accessible

---

