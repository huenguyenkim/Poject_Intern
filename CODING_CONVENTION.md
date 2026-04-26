# Candy E-Commerce: Coding Convention

This document outlines the coding standards, naming conventions, and structural organization of the Candy E-Commerce project. Adherence to these rules ensures long-term maintainability and consistency.

---

## 🏗️ Project Structure (Clean Architecture)

We follow a **Feature-based Hybrid Clean Architecture** to decouple business logic from UI frameworks and data sources.

### Frontend (`frontend/src`)
- `core/`: 🛡️ **Domain & Application**. Pure business entities and use cases.
- `data/`: 🔌 **Infrastructure**. Repositories and data sources (API clients).
- `presentation/`: 🎨 **UI Layer**.
    - `components/ui`: Generic atomic components (buttons, inputs).
    - `features/`: Business-specific feature modules.
    - `pages/`: Routing-level view components.
    - `context/`: State management adapters.

### Backend (`backend/src`)
- `core/`: 🛡️ **Domain & Application**. NestJS-agnostic business logic.
- `infrastructure/`: 🔌 **Data & Frameworks**. Persistence (TypeORM) and Web (NestJS Controllers/Modules).

---

## 🏷️ Naming Conventions

### 1. Files
- **React Components**: Must use `PascalCase`.
    - ✅ `ProductCard.jsx`, `CheckoutForm.tsx`
    - ❌ `productCard.jsx`, `checkout-form.jsx`
- **Utilities / Logic**: Must use `camelCase`.
    - ✅ `dateUtils.js`, `useProducts.js`
    - ❌ `DateUtils.js`, `date-utils.js`
- **Style Files**: Must use `kebab-case`.
    - ✅ `index.css`, `product-card.module.css`

### 2. Directories
- **All Folders**: Must use `kebab-case`.
    - ✅ `product-features`, `shared-ui`, `core-logic`
    - ❌ `ProductFeatures`, `SharedUI`

---

## 🛠️ Automated Enforcement

We use **ESLint** to automatically verify these naming rules.

### ESLint Plugin: `eslint-plugin-check-file`
The project is configured to throw errors if:
1. A folder under `src` is not named in `kebab-case`.
2. A React component is not named in `PascalCase`.

To check for compliance, run:
```bash
npm run lint
```

---

## 🎨 Styling Standard
- Use **Vanilla CSS** or **Tailwind CSS** as per the project requirements.
- Modularize CSS whenever possible to avoid global namespace pollution.
- Use the predefined design system tokens (e.g., `#FF76B8` for Candy Pink).

---

## ✅ Best Practices
1. **No direct API calls in Components**: Use Use Cases or Repositories.
2. **Prop Validation**: Use `PropTypes` or Typescript interfaces.
3. **Immutability**: Maintain item immutability in state management.
