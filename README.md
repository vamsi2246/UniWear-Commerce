# UniWear Commerce — Premium Fashion E-Commerce Platform

A production-quality, full-stack fashion e-commerce marketplace built from scratch. Inspired by premium, minimalist design aesthetics (Apple + Linear + Shopify). Designed with modular Route-Controller-Service backend layers, PostgreSQL persistence via Prisma ORM, and React + TailwindCSS + Radix UI frontend.

This project was built to showcase clean coding, security best practices, and sound database modeling for the internship technical assessment.

---

## 🚀 Deployed URLs
* **Frontend (Vercel):** [https://uniwear-commerce.vercel.app](https://uniwear-commerce.vercel.app) (Placeholder)
* **Backend API (Render):** [https://uniwear-api.onrender.com](https://uniwear-api.onrender.com) (Placeholder)
* **Database:** Neon Serverless PostgreSQL

---

## 🛠️ Tech Stack & Decisions

### Frontend
* **React 19 & Vite:** Next-gen rendering and ultra-fast hot module replacement.
* **TailwindCSS v4:** Utility-first CSS compiling instantly with a consistent tokens grid system.
* **React Router v7:** Programmatic routing with layouts and authentication guards.
* **TanStack Query (React Query) v5:** Declarative caching, state sync, and optimistic UI updates.
* **Radix UI Primitives (Shadcn/UI):** Headless, accessible keyboard-friendly components.
* **Framer Motion:** High-fidelity animations and smooth micro-interactions.
* **Zod & React Hook Form:** Type-safe schema validation for user details forms.

### Backend
* **Node.js & Express.js:** Event-driven async architecture for serving client requests.
* **Prisma ORM:** Strictly type-safe DB client generation, declarative migration schema, and seed handlers.
* **PostgreSQL:** Reliable ACID compliance, indexing on target columns, and JSON data type support.
* **JWT (JSON Web Token) with httpOnly Cookies:** Prevents token leakage and cross-site scripting (XSS) vulnerabilities.
* **bcryptjs:** Highly secure salted password hashing algorithm.

---

## 📁 Folder Structure

```
UniWear-Commerce/
├── docker-compose.yml              # Multi-container local orchestration
├── package.json                    # Root workspaces setup
├── client/                         # React Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # Accessible Radix primitives
│   │   │   ├── layout/             # Header, Footer, and mobile menus
│   │   │   ├── products/           # Cards, Skeletons, filters, and grids
│   │   │   └── shared/             # Errors, spinners, empty states, ratings
│   │   ├── contexts/               # Theme and Auth context providers
│   │   ├── hooks/                  # useCart, useWishlist, useDebounce
│   │   ├── layouts/                # ProtectedRoute, AdminLayout
│   │   ├── lib/                    # Axios instance with interceptors, utils
│   │   ├── pages/
│   │   │   └── admin/              # Admin CRUD dashboards
│   │   └── services/               # Modular REST API service wrappers
│   └── package.json
└── server/                         # Express Backend Application
    ├── src/
    │   ├── controllers/            # Request handlers
    │   ├── middleware/             # Role guards, validation, errors
    │   ├── routes/                 # API endpoint declarations
    │   ├── services/               # Core business logic
    │   ├── types/                  # Request type overrides
    │   ├── validators/             # Request payloads schema (Zod)
    │   └── utils/                  # Prisma connection, JWT tokens, bcrypt
    ├── prisma/
    │   ├── schema.prisma           # Normalised relational models
    │   └── seed.ts                 # Catalog populating script
    └── package.json
```

---

## 🛢️ Database Design & Models (ERD)

The database schema is fully normalized with correct foreign key constraints and indexes on frequently queried fields.

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│   users      │       │  categories  │       │   coupons    │
├─────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)     │       │ id (PK)      │       │ id (PK)      │
│ name        │       │ name         │       │ code (UQ)    │
│ email (UQ)  │       │ slug (UQ)    │       │ discount_pct │
│ password    │       │ description  │       │ min_order    │
│ role (Enum) │       │ image        │       │ max_discount │
│ avatar      │       └──────┬───────┘       │ usage_limit  │
│ phone       │              │               │ used_count   │
│ created_at  │              │ 1:N           │ expires_at   │
└──────┬──────┘              │               │ is_active    │
       │              ┌──────▼───────┐       └──────────────┘
       │              │  products    │
       │              ├──────────────┤
       │              │ id (PK)      │
       │              │ name         │
       │              │ slug (UQ)    │
       │              │ price        │
       │              │ stock        │
       │              │ category_id  │── FK → categories.id
       └──────┬───────┘              │
              │                      │
    ┌─────────┼──────────────────────┤
    │         │                      │
┌───▼───┐ ┌───▼──────┐           ┌───▼──────┐
│ carts │ │wishlists │           │ reviews  │
└───┬───┘ └──────────┘           ├──────────┤
    │ 1:N                        │ rating   │
┌───▼──────┐                     │ comment  │
│cart_items│                     └──────────┘
└──────────┘
```

### Main Database Relationships
1. **User (1) ↔ Cart (1):** One active shopper cart model per registered user.
2. **Category (1) ↔ Product (N):** Categorization of store products.
3. **Cart (1) ↔ CartItem (N):** List of products added by the user with quantity, size, and color details.
4. **Order (1) ↔ OrderItem (N):** Capture snapshotted product price, sizing, and quantity at purchase time.
5. **Product (1) ↔ Review (N):** Product star-ratings and customer feedback.
6. **Product (1) ↔ Wishlist (N):** Save-for-later functionality junction table.

---

## 🔒 Security Plan
* **Stateless Authenticated Sessions:** JWT is signed and set as an `httpOnly`, `Secure` (in production), and `SameSite=Lax` cookie to block CSRF and XSS.
* **Role-Based Routing:** Express request chain routes through `authMiddleware` and `adminMiddleware` to restrict admin dashboard access.
* **Brute Force Defense:** `express-rate-limit` limits login/register attempts.
* **Data Sanitization & Validation:** Strict request body validation on the server using Zod schemas before running database mutations.
* **Prisma Injection Prevention:** Parametrisation is built-in by default for all SQL queries compiled from the client operations.

---

## ⚡ System Architecture & Flows

### Authentication Flow
1. Shopper registers/logs in → Express validates input via Zod.
2. Server hashes password with `bcryptjs` (12 rounds) and creates user record.
3. JWT is signed with payload `{ userId, role }` and attached as an `httpOnly` cookie.
4. Client's subsequent requests automatically send cookie header, verified by middleware.

### Order Placement Transaction Flow
All operations are executed inside a **Prisma Database Transaction (`$transaction`)** to guarantee data integrity:
1. Verify each item's stock status.
2. Calculate order subtotal and validate coupon (minimum order limit, expiry, usage count).
3. Insert record into `Order` and `OrderItem` tables.
4. Decrement product stock levels.
5. Increment coupon usage counter.
6. Clear user's cart items.
7. If any step fails, the entire transaction rolls back.

---

## 🛠️ Installation & Setup (Local Development)

### Prerequisites
* Node.js v20+
* Docker & Docker Compose (optional, for DB)
* PostgreSQL locally running (if not using Docker)

### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/vamsi2246/UniWear-Commerce.git
   cd UniWear-Commerce
   ```

2. **Configure environment variables:**
   Create a `.env` file in the `server/` directory (use `server/.env.example` as a reference).
   ```bash
   cp server/.env.example server/.env
   ```

3. **Install all dependencies:**
   From the root folder, run:
   ```bash
   npm run install:all
   ```

4. **Spin up database & seed data:**
   If using Docker for the database:
   ```bash
   docker-compose up -d db
   ```
   Apply Prisma migrations:
   ```bash
   npm run db:migrate
   ```
   Seed the database with sample products and admin user:
   ```bash
   npm run db:seed
   ```

5. **Start development servers:**
   Run both frontend and backend concurrently:
   ```bash
   npm run dev
   ```
   * Frontend will run on: `http://localhost:5173`
   * Backend API will run on: `http://localhost:5000`

### 👥 Demo Accounts
* **Admin User:** `admin@uniwear.com` / `password123`
* **Regular Customer:** `john@example.com` / `password123`

---

## 🐳 Docker Deployment Setup
To run the entire ecosystem (DB, server, client) locally in a dockerized stack:
```bash
docker-compose up --build
```
The client will be accessible at `http://localhost:5173` served via Nginx.

---

## 📈 Git Commit Strategy
We suggest following these semantic commits to demonstrate progress:
1. `chore: initialize monorepo client and server folders`
2. `feat(db): establish Prisma schema with relational models`
3. `feat(db): write catalog populating seed.ts script`
4. `feat(auth): JWT session authentication using httpOnly cookies`
5. `feat(auth): role-based check middlewares`
6. `feat(client): API client setup with Axios interceptor`
7. `feat(client): authentication context wrapper`
8. `feat(client): register and login pages validation`
9. `feat(products): CRUD endpoints for catalog`
10. `feat(cart): server-persisted cart state`
11. `feat(checkout): transaction-based order creation with stock check`
12. `feat(orders): tracking history details API`
13. `feat(admin): analytics dashboard layout`
14. `feat(admin): product catalog CRUD screens`
15. `feat(admin): category manager page`
16. `feat(admin): customer orders tracking panel`
17. `feat(search): debounced catalog filtering & sorting`
18. `feat(wishlist): save-for-later database wishlist`
19. `feat(reviews): star-ratings review sub-module`
20. `feat(coupons): coupon validate and apply logic`
21. `feat(ui): responsive navigation headers`
22. `feat(ui): dynamic skeletons loading state`
23. `feat(ui): interactive transition animations`
24. `feat(ui): light and dark mode toggles`

---

## ⚠️ Known Limitations & Future Roadmap
* **Simulated Payments:** Orders are completed using simulated checkout. Integration with Stripe/Razorpay would be the next step.
* **Search Optimization:** Large datasets would benefit from Meilisearch/Elasticsearch index syncing instead of raw PG `ILIKE` operations.
* **Refresh Tokens:** Access tokens expire in 7 days; adding token rotation would enhance security.
* **Image Uploads:** Integrates Multer/Cloudinary memory storage; adding S3 buckets or CDN distribution would scale asset hosting.

---

## 🤖 AI Usage Statement
AI was utilized as an engineering accelerator to structure boilerplate routes, controllers, typescript typings, and Tailwind layout skeletons, allowing focus on core database transactions, security cookies, and custom hooks integration.
