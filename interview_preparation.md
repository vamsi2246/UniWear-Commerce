# UniWear Commerce — Technical Interview Preparation Guide

This handbook is designed to help you ace your technical interview by highlighting the architectural decisions, design patterns, and engineering challenges solved in the **UniWear Commerce** codebase.

---

## 🏛️ 1. Architecture Overview

UniWear is built as a **decoupled full-stack monorepo** consisting of two main parts:
1. **Frontend Client (`client/`):** A fast React single-page application (SPA) built with Vite, TypeScript, and TailwindCSS.
2. **Backend Server (`server/`):** A modular REST API built with Node.js, Express, TypeScript, and Prisma ORM.

### Key Architectural Flow
```
[User Browser] 
    └── (React SPA + Tailwind CSS + TanStack Query)
         └── (Axios Requests with httpOnly Credentials)
              └── [Nginx Proxy / Vite Dev Server Proxy]
                   └── [Express REST API (Port 5001)]
                        └── (Zod Body Validation)
                             └── (Passport / Session Guard Middleware)
                                  └── (Business Service Layer)
                                       └── (Prisma Client ORM)
                                            └── [PostgreSQL Database]
```

---

## 🛠️ 2. Detailed Tech Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | **React 19 + Vite 6** | Rapid HMR (Hot Module Replacement) during development and highly optimized production builds. |
| **Style** | **TailwindCSS 4 + Radix UI** | Accessible, headless primitives paired with utility-first responsive styling. |
| **State** | **TanStack Query v5 (React Query)** | Eliminates client-side boilerplates by handling query caching, background refetching, and state mutation out of the box. |
| **Backend** | **Node.js + Express 5** | High-throughput asynchronous routing utilizing Express 5's native support for unhandled promise rejection catches in handlers. |
| **ORM** | **Prisma ORM v6** | Type-safe SQL querying, auto-generated TypeScript models, and declarative database migrations. |
| **Database** | **PostgreSQL** | Relational integrity (ACID compliance) necessary for financial and order transaction records. |
| **Validation** | **Zod** | Schema-first verification securing Express endpoints against corrupt request parameters. |

---

## 💡 3. Key Engineering Highlights & Interview Talking Points

Be ready to explain these specific implementations during your interview:

### 🔒 3.1. Stateless JWT Cookie Authentication
* **The Design:** Instead of storing JSON Web Tokens (JWT) in local storage, UniWear passes tokens inside secure `httpOnly`, `SameSite=Lax`, and `Secure` cookies.
* **Why it matters:** This design shields the application from Cross-Site Scripting (XSS) attacks. Because browser scripts cannot read `httpOnly` cookies, malicious scripts cannot extract user sessions.

### 🛡️ 3.2. Axios Response Interceptors
* **The Design:** The client-side Axios instance (`client/src/lib/api.ts`) utilizes global interceptors to check responses.
* **Why it matters:** If the backend returns a `401 Unauthorized` status (e.g., token expired), the interceptor catches it, dispatches a global `auth:unauthorized` event, and redirects the shopper to the login screen automatically without requiring manual error checks on every single page component.

### 📈 3.3. Relational ACID Transactions (Checkout)
* **The Design:** During checkout, multiple database operations must succeed together:
  1. Verify active stock for all items in the cart.
  2. Decrement stock levels on the `Product` table.
  3. Validate discount coupons.
  4. Create the `Order` and `OrderItem` records.
  5. Clear the shopper's `Cart`.
* **Why it matters:** This is executed inside a single **Prisma `$transaction`**. If any step fails (e.g., stock is insufficient), the entire transaction rolls back, preserving data integrity and preventing race conditions or phantom stock allocations.

### 🎨 3.4. Dynamic SVG Analytics
* **The Design:** The Admin Dashboard displays charts generated using native SVG nodes (`<svg>`, `<rect>`, `<path>`) computed mathematically in TypeScript.
* **Why it matters:** It keeps the client bundle exceptionally lightweight by avoiding heavy chart libraries (like Chart.js or Recharts).

---

## 🗄️ 4. Relational Database Schema Design

The PostgreSQL database (managed via `schema.prisma`) enforces relational integrity:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(CUSTOMER) // CUSTOMER, ADMIN
  orders    Order[]
  cart      CartItem[]
}

model Product {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String
  price       Float
  images      String[]    // Array of local paths [front, back, side, detail]
  sizes       String[]
  colors      String[]
  stock       Int
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
}
```

---

## 🚀 5. Production Deployment Best Practices

* **Containerization:** The platform is configured with `Dockerfile` and `docker-compose.yml` defining multi-stage builds.
* **Port Conflict Mitigation:** Ports are unified on `5001` (backend) and `5173` (frontend/Nginx) to avoid conflict with default AirPlay ports on macOS.
* **Vite Environment Binding:** The frontend API path resolves to `import.meta.env.VITE_API_URL || "/api"` dynamically to support cross-domain hosting (e.g. Vercel client connecting to Render API).
