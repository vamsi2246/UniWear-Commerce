# ShopMyUniform (UniWear Commerce) — Technical Architecture Guide

This guide provides an in-depth explanation of how the **Frontend**, **Backend**, and **Database** layers are architected and how they interact within the ShopMyUniform codebase.

---

## 🎨 1. Frontend Architecture (`client/`)

The frontend is a modern React 19 Single Page Application (SPA) powered by Vite.

```
[Pages] (Home, Cart, Products)
   │
   ├──> [Hooks] (useCart, useWishlist) ──> uses TanStack Query
   │                                        │
   └──> [Contexts] (AuthContext, Theme)    └──> [Services] (api.ts) ──> Axios REST Calls
```

### 1.1. Core Components & Structure
* **`client/src/main.tsx`:** The entry point that mounts the React app, wraps it in the `QueryClientProvider` (TanStack Query), and initializes session contexts.
* **`client/src/components/layout/`:** Contains core structural elements like `Header.tsx` (navigation bar) and `Footer.tsx`.
* **`client/src/pages/`:** Individual page views (e.g., `Products.tsx` for the catalog, `ProductDetail.tsx` for the gallery and description, `Cart.tsx` for shopping, and `Checkout.tsx` for placing orders).

### 1.2. State Management & API Requests
* **Axios Client (`client/src/lib/api.ts`):** 
  * Configured with a default base URL (`/api` or custom `VITE_API_URL`).
  * `withCredentials: true` is enabled so the browser automatically sends HTTP-only session cookies with every request.
  * Axios interceptors capture `401 Unauthorized` responses globally to log out the user if their session expires.
* **TanStack Query (React Query):**
  * Handled inside custom hooks like `client/src/hooks/useCart.ts`.
  * Queries (`useQuery`) manage data fetching and automatic caching (e.g., fetching cart items).
  * Mutations (`useMutation`) manage user actions (e.g., adding an item, updating quantities) and automatically invalidate caches to trigger background refetching.

---

## ⚙️ 2. Backend Architecture (`server/`)

The backend is built as a modular Express server using the **Route-Controller-Service** design pattern.

```
[HTTP Request] ──> [Routes] ──> [Middleware] (Zod / Auth) ──> [Controllers] ──> [Services] (Prisma)
```

### 2.1. Layer Division
1. **Routing Layer (`server/src/routes/`):** Matches URL endpoints (e.g., `POST /api/orders`) to their corresponding handlers.
2. **Middleware Layer (`server/src/middleware/`):**
   * **`validate.ts`:** Uses Zod schemas to validate request bodies before controllers process them.
   * **`auth.ts`:** Decodes JWTs from incoming cookies and appends the user context to the request (`req.user`).
3. **Controller Layer (`server/src/controllers/`):** Decouples HTTP concerns (reading headers, sending status codes) from business logic.
4. **Service Layer (`server/src/services/`):** The core business logic containing queries, calculations, and database calls.

### 2.2. Error Handling
* **`catchAsync` Wrapper:** Express 5 handlers are wrapped in `catchAsync` to forward errors to the global error middleware without requiring `try/catch` boilerplate blocks in every controller.
* **`ApiError` class:** Standardizes error responses (e.g., `400 Bad Request`, `404 Not Found`) across the system.

---

## 🗄️ 3. Database & ORM Layer

The data layer uses **PostgreSQL** for persistent storage, managed via **Prisma ORM**.

### 3.1. Prisma ORM Workflow
* **`server/prisma/schema.prisma`:** The single source of truth for the database schema.
* **Client Generation:** Running `npx prisma generate` compiles the schema into TypeScript types, preventing invalid column queries at compile time.
* **Migrations:** Running `npx prisma migrate dev` creates structured SQL version files to sync the database schema state.

### 3.2. ACID Transaction Logic (Checkout)
Inside `server/src/services/order.service.ts`, checkout transactions are executed using the Prisma `$transaction` method:

```typescript
await prisma.$transaction(async (tx) => {
  // 1. Lock and verify stock levels for each item
  const product = await tx.product.findUnique({ where: { id: itemId } });
  if (product.stock < quantity) throw new Error("Out of stock");

  // 2. Decrement stock levels
  await tx.product.update({
    where: { id: itemId },
    data: { stock: product.stock - quantity }
  });

  // 3. Create the Order and OrderItem records
  const order = await tx.order.create({ data: { ... } });

  // 4. Clear the Cart
  await tx.cartItem.deleteMany({ where: { userId } });
});
```

If *any* step fails (e.g., one item is out of stock), Prisma automatically rolls back all operations, ensuring that the database never records an unpaid order or incorrect inventory levels.
