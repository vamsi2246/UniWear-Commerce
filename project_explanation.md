# ShopMyUniform (UniWear Commerce) — Complete Project Documentation

Welcome to the full documentation handbook for the **ShopMyUniform (UniWear Commerce)** e-commerce application. This guide explains the project's features, tech stack, codebase structure, data models, and backend endpoints.

---

## 🚀 1. Feature Set

* **Dynamic Product Catalog:** Categorized products with pagination, pricing filters, search parameters, sorting, sizing, and color attributes.
* **Decoupled Shopping Cart:** Shoppers can add items, choose sizes/colors, adjust quantities, and have their state persisted persistently in the database.
* **Persistent Wishlist:** Customers can add items to their personal wishlist for later viewing.
* **Relational Transactions (Checkout):** A secure transactional checkout workflow that locks stock, checks discount vouchers, creates orders, and empties carts atomically.
* **Google OAuth & JWT Session:** Security-enhanced customer authentication supporting credentials and Google Sign-In with automated HTTP-only cookie parsing.
* **Admin Dashboard:** Features inventory management, order tracking, categories controls, and custom SVG analytics visualization.

---

## 💻 2. Full Technology Stack

### Frontend Client (`client/`)
* **React 19 (SPA):** Single Page Application built on React 19.
* **Vite 6:** Rapid development bundle compiler.
* **TypeScript:** Strong type safety across components and services.
* **TailwindCSS 4:** Native Utility-first responsive design.
* **Radix UI:** Headless components for highly accessible design patterns.
* **TanStack Query v5:** Caches and syncs query queries without global state overhead.

### Backend Server (`server/`)
* **Node.js & Express 5:** Fast REST API backend.
* **TypeScript:** Typed routing, controller, and service interfaces.
* **Prisma ORM v6:** Database schema migration, model generator, and ACID query transactions.
* **Zod:** Runtime input sanitization and verification middleware.
* **JWT & Cookie-Parser:** Secure user sessions via signed HTTP-only cookies.

### Database
* **PostgreSQL:** Neon.tech serverless PostgreSQL database.

---

## 🗄️ 3. Relational Schema Configuration

The relational schema is configured in [schema.prisma](file:///Users/apple/Desktop/UniWear-Commerce/server/prisma/schema.prisma):

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  name      String
  role      Role       @default(CUSTOMER)
  orders    Order[]
  cart      CartItem[]
  wishlist  WishlistItem[]
}

model Product {
  id          String         @id @default(cuid())
  name        String
  slug        String         @unique
  description String
  price       Float
  comparePrice Float?
  images      String[]       // Array of local paths [front, back, side, detail]
  sizes       String[]
  colors      String[]
  stock       Int
  isFeatured  Boolean        @default(false)
  isArchived  Boolean        @default(false)
  categoryId  String
  category    Category       @relation(fields: [categoryId], references: [id])
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  products Product[]
}

model Order {
  id         String      @id @default(cuid())
  userId     String
  user       User        @relation(fields: [userId], references: [id])
  items      OrderItem[]
  total      Float
  status     OrderStatus @default(PENDING) // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  address    String
}
```

---

## 📞 4. REST API Endpoint Map

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new user account. |
| **POST** | `/api/auth/login` | Log in and receive HTTP-only session cookie. |
| **GET** | `/api/auth/me` | Fetch active user session contexts. |
| **GET** | `/api/products` | Retrieve paginated products with filters. |
| **GET** | `/api/products/:slug` | Fetch product details by slug. |
| **GET** | `/api/cart` | Get active shopping cart. |
| **POST** | `/api/cart/items` | Add item to cart. |
| **POST** | `/api/orders` | Checkout cart and place order. |

---

## 🐳 5. How to Deploy to Production

1. **Database:** Create a serverless database on **Neon.tech** and copy the database URI to `DATABASE_URL`.
2. **Backend:** Deploy to Render using the [server/Dockerfile](file:///Users/apple/Desktop/UniWear-Commerce/server/Dockerfile). Set build command to:
   ```bash
   npm install --include=dev && npx prisma generate && npm run build
   ```
3. **Frontend:** Deploy to Vercel/Netlify. Set environment `VITE_API_URL` to point to the backend domain.
