# 🍭 Antigravity Candy E-Commerce Platform

A premium, high-fidelity e-commerce experience for artisanal candies. Built with a focus on vibrant aesthetics, bouncy micro-animations, and robust administrative control.

## 🚀 Features

### Storefront
- **Dynamic Catalog**: Browse and filter candies by category.
- **Premium UI**: Glassmorphism effects, custom typography (DM Sans), and playful transitions.
- **Smart Cart**: Persistent shopping cart with real-time subtotal calculation.
- **Secure Checkout**: Guest-to-auth redirect logic ensuring seamless user conversion.

### Administrative Portal
- **Dashboard Overview**: Real-time sales stats, order charts, and inventory alerts.
- **Product Management**: Full CRUD for products with multi-category support.
- **Order Management**: Track, view details, and update shipping statuses.
- **Banner Management**: Control homepage hero and promotional content.
- **Responsive Design**: Fully optimized for mobile (375x812) and desktop viewports.

## 🛡️ Quality & Security

### Authentication & Authorization
- **JWT Simulation**: Secure session management using tokens stored in local storage.
- **Role-Based Access Control (RBAC)**: 
  - `admin`: Full access to the Management Portal and storefront.
  - `user`: Access to personal profile, order history, and storefront.
- **Protected Routes**: Middleware-style wrappers ensure unauthorized users are redirected to login while preserving their target URL.

### Data Integrity
- **Strict Validation**: 
  - Email Regex verification on all forms.
  - Required field checks for product creation and checkout.
  - Numeric validation ensuring prices are strictly positive.

## 🛠️ Tech Stack
- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS Transitions
- **State Management**: React Context (Auth, Store, Cart)

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd candy-ecommerce
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Storefront: `http://localhost:5173`
   - Admin Login: `admin@candy.com` / `admin123`
