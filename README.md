# 🍭 Candy E-Commerce Platform

[![Premium Design](https://img.shields.io/badge/Design-Premium-ff69b4?style=for-the-badge)](https://github.com/huenguyenkim/Poject_Intern)
[![Bilingual](https://img.shields.io/badge/Language-EN%20%7C%20VI-blue?style=for-the-badge)](https://github.com/huenguyenkim/Poject_Intern)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-e0234e?style=for-the-badge)](https://github.com/huenguyenkim/Poject_Intern)
[![React](https://img.shields.io/badge/Frontend-React-61dafb?style=for-the-badge)](https://github.com/huenguyenkim/Poject_Intern)

Welcome to **Candy Shop**, a high-fidelity, premium e-commerce platform designed for artisanal confectionery. This project showcases a sophisticated integration of modern web technologies to deliver a "sweet" user experience with a focus on performance, accessibility, and bilingual inclusivity.

---

## ✨ Premium Features

### 🌐 Bilingual Localization (i18n)
- **Full Parity**: 100% bilingual support for English and Vietnamese across all pages.
- **Smart Routing**: URL-based locale persistence (`/en/` or `/vi/`) for seamless language switching.
- **Dynamic Content**: Localized dates, currency formatting, and context-aware validation messages.

### 👤 Advanced User Ecosystem
- **Interactive Profile**: Personalized greetings (Good morning/afternoon/evening) based on real-time data.
- **Rich Identity**: Support for detailed bios, gender selection, and social-style profile cards.
- **Security Suite**: Secure password updates with mandatory verification and automatic cross-device session invalidation.

### 📦 Order Intelligence
- **Visual Tracking**: Real-time order progress with a beautiful step-by-step timeline.
- **History Management**: Tab-based filtering (Pending, Shipping, Delivered, Cancelled) with functional search.
- **One-Click Reorder**: Intelligent stock checking and automated cart restoration for favorite treats.

### 🛡️ Administrative Portal
- **Real-Time Analytics**: Live dashboard tracking total revenue, order volume, and active visitor counts.
- **Inventory Control**: Comprehensive product and category management with role-based access control (RBAC).
- **Staff Operations**: Real-time task dashboard powered by Socket.io for streamlined fulfillment.

### 🎨 Design & UX Excellence
- **Glassmorphism UI**: Modern, translucent interface elements for a premium aesthetic.
- **Micro-Animations**: Smooth transitions and interactive hover effects powered by Framer Motion.
- **SEO Optimized**: Dynamic meta tags, JSON-LD structured data, and performance-first architecture.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) (Vite 8)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **Localization**: [i18next](https://www.i18next.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [NestJS 11](https://nestjs.com/)
- **Persistence**: [TypeORM](https://typeorm.io/) (PostgreSQL / SQLite support)
- **Security**: [Passport.js](https://www.passportjs.org/) with JWT Strategy
- **Real-time**: [Socket.io](https://socket.io/)
- **Communication**: [Nodemailer](https://nodemailer.com/) for transactional emails

---

## 📂 Project Structure

```text
candy-ecommerce/
├── frontend/           # React (Vite) storefront application
│   ├── src/
│   │   ├── components/ # Reusable UI & Layout components
│   │   ├── pages/      # Route-level components
│   │   ├── store/      # Redux slices & logic
│   │   └── locales/    # Translation JSON files (EN/VI)
├── backend/            # NestJS API infrastructure
│   ├── src/
│   │   ├── auth/       # Authentication & Security
│   │   ├── users/      # User profile & management
│   │   ├── products/   # Catalog & Inventory
│   │   └── orders/     # Order processing & transactions
└── package.json        # Root workspace configuration
```

---

## 📦 Setup & Installation

### 1. Prerequisites
- Node.js (v20 or higher)
- npm or yarn

### 2. Installation
Clone the repository and install all dependencies using the root convenience script:
```bash
git clone https://github.com/huenguyenkim/Poject_Intern.git
cd candy-ecommerce
npm run install:all
```

### 3. Configuration
Create a `.env` file in the `backend` directory based on `.env.example`:
```env
JWT_SECRET=your_premium_secret_key
DATABASE_URL=your_database_url
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

### 4. Running the Project
Start both servers simultaneously or individually:

**Frontend (Storefront):**
```bash
npm run dev:frontend
```

**Backend (API):**
```bash
npm run dev:backend
```

The application will be accessible at `http://localhost:5173`.

---

## 🍬 Developed with Passion
This project was developed by **Hue Nguyen Kim** as part of a high-impact internship project, focusing on building scalable, production-ready e-commerce infrastructure with a "Wow" factor in design.

*Special thanks to the open-source community for the amazing tools used in this project.*
