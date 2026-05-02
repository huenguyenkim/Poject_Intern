# 🍭 Candy - E-Commerce Platform

Welcome to the **Candy Shop**, a premium, high-fidelity e-commerce experience designed for artisanal candy lovers. This platform combines vibrant aesthetics with robust functionality, providing a seamless journey from browsing to secure checkout.

## 🌟 Introduction
Candy Shop is more than just a store; it's a visual delight. Built with modern web technologies, it features a "bouncy" design language, glassmorphism UI elements, and high-performance state management. Whether you're a customer looking for the perfect treat or an admin managing a global inventory, the platform offers a polished and intuitive interface.

## 🛠️ Tech Stack

### Frontend
- **React (Vite 6)**: Lightning-fast development and optimized production builds.
- **Redux Toolkit**: Centralized state management for authentication, cart, and catalog.
- **Ant Design & Tailwind CSS**: A hybrid design system combining robust components with custom utility-first styling.
- **Lucide React**: Beautiful, consistent iconography.
- **Framer Motion**: Smooth micro-animations and page transitions for a premium feel.

### Backend
- **NestJS**: Enterprise-grade Node.js framework for scalable server-side applications.
- **TypeORM**: Data persistence with PostgreSQL support.
- **Passport & JWT**: Secure, stateless authentication with advanced session management.
- **Socket.io**: Real-time bidirectional communication for notifications and task updates.

## ✨ Key Features

### 🛒 Customer Storefront
- **Dynamic Product Catalog**: Browse a wide range of candies with real-time category filtering.
- **Interactive Shopping Cart**: Add, update, and manage your cravings with a persistent cart.
- **Secure Security Suite**: 3-step password changes with mandatory current password verification.
- **Cross-Device Session Control**: Automatic logout from all devices upon security updates via token versioning.

### 🛡️ Administrative Portal
- **Advanced Dashboard**: Real-time analytics tracking total sales, order volume, and live visits.
- **Role-Based Access Control (RBAC)**: Strict separation between `ADMIN`, `STAFF`, and `CUSTOMER` roles.
- **Login Guard**: Dedicated portal security that blocks non-administrative accounts from entering management zones.
- **Task Management**: Real-time staff dashboard for managing daily fulfillment operations.

### ⚙️ Core Engines
- **Pricing Engine**: Secure server-side calculation of totals, taxes, and coupon stacking logic.
- **Analytics Engine**: Persistent tracking of user behavior and sales metrics.
- **Notification Engine**: Integrated system alerts for security events and order updates.

## 📂 Project Structure

This project is organized into two main directories:
- `/frontend`: The React (Vite) storefront.
- `/backend`: The NestJS infrastructure.

## 📦 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/huenguyenkim/Poject_Intern.git
cd candy-ecommerce
```

### 2. Install Dependencies
```bash
# Root directory
npm install

# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 3. Environment Configuration
Create a `.env` file in the `/backend` directory:
```env
JWT_SECRET=your_secret_key
DATABASE_URL=your_db_connection
```

### 4. Run Development Servers

To run the **frontend**:
```bash
npm run dev:frontend
```

To run the **backend**:
```bash
npm run dev:backend
```
The application will be available at `http://localhost:5173`.

---
*Developed with ❤️ as part of the Intern Project.*
