# CLAUDE.md — JapaneseStoreBE

## Project Overview

NestJS REST API backend for a Japanese art-supply store (primarily Copic-style alcohol/water-based markers). PostgreSQL + TypeORM, Redis caching, JWT auth, Swagger docs.

**Global API prefix**: `/api`  
**Swagger docs**: `/docs`  
**Default port**: `3000` (env `PORT`)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS 11 |
| Language | TypeScript (strict disabled — `strictNullChecks: false`) |
| ORM | TypeORM |
| Database | PostgreSQL |
| Cache | Redis (`cache-manager-redis-yet`, 60 s TTL) |
| Auth | JWT (`@nestjs/jwt`) — access 3 d, refresh 15 d |
| Password | bcrypt, 10 salt rounds |
| Validation | `class-validator` + global `ValidationPipe` (whitelist, transform) |
| Docs | `@nestjs/swagger` with Bearer auth |
| CORS | Enabled — `Content-Type`, `Authorization`, `allowRetry` headers; credentials allowed |

---

## Repository Layout

```
src/
├── main.ts                   # Bootstrap (CORS, global prefix, Swagger, ValidationPipe)
├── app.module.ts             # Root module — ConfigModule, CacheModule (Redis), TypeORM, JwtModule
├── common/
│   ├── decorators/public.decorator.ts   # @Public() — skips JWT guard
│   └── guards/jwt-auth.guard.ts         # Global APP_GUARD — checks Bearer token
├── database/
│   ├── data-source.ts        # TypeORM DataSource (used by migrations CLI)
│   └── seed.ts               # npm run seed — populates test data
├── entities/                 # TypeORM entities (all imported via index.ts)
│   ├── account.entity.ts
│   ├── role.entity.ts
│   ├── category.entity.ts
│   ├── product.entity.ts
│   ├── product-color.entity.ts
│   ├── customer.entity.ts
│   ├── address.entity.ts
│   ├── order.entity.ts
│   ├── order-item.entity.ts
│   └── payment.entity.ts
├── modules/
│   ├── auth/                 # Login, register, refresh token
│   ├── account/              # User account CRUD + role change
│   ├── role/                 # Role bootstrap (user / admin)
│   ├── category/             # Product categories (Redis cached)
│   ├── product/              # Product catalog (Redis cached)
│   ├── product-color/        # Color variants per product (Redis cached)
│   ├── customer/             # Customer records (Redis cached)
│   ├── address/              # Customer shipping addresses
│   ├── order/                # Orders
│   ├── order-item/           # Line items per order
│   └── payment/              # Payment records
└── utils/index.ts            # Constants: ACCESS_TOKEN, REFRESH_TOKEN
```

---

## Auth Flow

1. `POST /api/auth/register` (public) — creates account, hashes password, assigns `user` role
2. `POST /api/auth/login` (public) — validates bcrypt, returns `access_token` + `refresh_token`; refresh token stored in DB
3. `POST /api/auth/refresh` (public) — validates stored refresh token, returns new pair
4. All other routes require `Authorization: Bearer <access_token>` — enforced by global `JwtAuthGuard`
5. Mark route public with `@Public()` decorator

Secrets: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (from env).

---

## Database Entities & Key Relationships

```
Role (1) ──< Account (many)
Category (1) ──< Product (many) ──< ProductColor (many)
Customer (1) ──< Address (many)
Customer (1) ──< Order (many) >── Address (1)
Order (1) ──< OrderItem (many) >── Product (1)
Order (1) ──1 Payment
```

**Enums**:
- `OrderStatus`: `pending | confirmed | shipping | delivered | cancelled`
- `PaymentMethod`: `cod | bank_transfer | momo | vnPay`
- `PaymentStatus`: `pending | paid | failed`

**Notable entity fields**:
- `Account.role` — eager-loaded ManyToOne
- `Product.series` — e.g. `"Honolulu"`, `"Oahu"`, `"Kaala"`
- `Product.nibType` — e.g. `"Brush & Chisel"`
- `Product.inkType` — `"Alcohol-based"` or `"Water-based"`
- `ProductColor.colorCode` — e.g. `"R01"`, `hexValue` — e.g. `"#DC143C"`

**Composite DB indexes**:
- `Product`: `[series, inkType]`, `[isActive, categoryId]`
- `Order`: `[customerId, status]`
- `OrderItem`: `[orderId, productId]`

---

## Caching Pattern (Redis)

Modules that cache: **Category, Product, ProductColor, Customer**  
Modules without cache: Order, OrderItem, Payment, Address, Account

Cache key convention:
```
categories                          # list
category:{id}                       # single
products                            # list
product:{id}                        # single
products:category:{categoryId}      # filtered list
product-colors                      # list
product-color:{id}                  # single
product-colors:product:{productId}  # filtered list
customers                           # list
customer:{id}                       # single
customer:email:{email}              # by email
```

All cached services inject `CACHE_MANAGER` and call `cache.del()` on mutations. Cache failures are caught and logged — never thrown.

---

## Module Pattern

Every feature module follows the same shape:

```
module-name/
├── module-name.module.ts
├── module-name.controller.ts
├── module-name.service.ts
├── interfaces/module-name-service.interface.ts   # IModuleNameService
└── dto/
    ├── create-module-name.dto.ts
    └── update-module-name.dto.ts
```

Services are injected by Symbol token (`MODULE_NAME_SERVICE`), not by class. The interface is provided via:
```ts
{ provide: MODULE_NAME_SERVICE, useClass: ModuleNameService }
```

---

## API Endpoints Reference

| Module | Method | Path | Auth |
|--------|--------|------|------|
| Auth | POST | /api/auth/register | Public |
| Auth | POST | /api/auth/login | Public |
| Auth | POST | /api/auth/refresh | Public |
| Account | GET/POST | /api/accounts | JWT |
| Account | GET/PATCH/DELETE | /api/accounts/:id | JWT |
| Account | PATCH | /api/accounts/:id/role | JWT |
| Role | GET | /api/roles | JWT |
| Role | GET | /api/roles/:id | JWT |
| Category | GET/POST | /api/categories | JWT |
| Category | GET/PATCH/DELETE | /api/categories/:id | JWT |
| Product | GET/POST | /api/products | JWT |
| Product | GET/PATCH/DELETE | /api/products/:id | JWT |
| Product | GET | /api/products/category/:categoryId | JWT |
| ProductColor | GET/POST | /api/product-colors | JWT |
| ProductColor | GET/PATCH/DELETE | /api/product-colors/:id | JWT |
| ProductColor | GET | /api/product-colors/product/:productId | JWT |
| Customer | GET/POST | /api/customers | JWT |
| Customer | GET/PATCH/DELETE | /api/customers/:id | JWT |
| Customer | GET | /api/customers/email/:email | JWT |
| Address | GET/POST | /api/addresses | JWT |
| Address | GET/PATCH/DELETE | /api/addresses/:id | JWT |
| Address | GET | /api/addresses/customer/:customerId | JWT |
| Order | GET/POST | /api/orders | JWT |
| Order | GET/PATCH/DELETE | /api/orders/:id | JWT |
| Order | GET | /api/orders/customer/:customerId | JWT |
| OrderItem | GET/POST | /api/order-items | JWT |
| OrderItem | GET/PATCH/DELETE | /api/order-items/:id | JWT |
| OrderItem | GET | /api/order-items/order/:orderId | JWT |
| Payment | GET/POST | /api/payments | JWT |
| Payment | GET/PATCH/DELETE | /api/payments/:id | JWT |
| Payment | GET | /api/payments/order/:orderId | JWT |

---

## Environment Variables

```env
PORT=3000
NODE_ENV=development          # 'production' disables DB auto-sync and verbose logging
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=japanese_store
REDIS_HOST=localhost           # inferred from cache config
REDIS_PORT=6379
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
```

TypeORM `synchronize: true` in dev, `false` in prod.

---

## Common Commands

```bash
npm run start:dev       # watch mode
npm run seed            # populate test data
npm run migration:generate -- src/database/migrations/MigrationName
npm run migration:run
npm run migration:revert
npm run build
npm run lint
npm test
```

---

## Conventions & Gotchas

- **TypeScript strict is OFF** — `strictNullChecks: false`, `noImplicitAny: false`. Don't enable without a full type-audit.
- **UUIDs everywhere** — all primary keys are `uuid`.
- `SafeAccount` type omits `password` and `refresh_token` from API responses.
- Role bootstrapping happens in `RoleService.onModuleInit()` — roles `user` and `admin` are auto-created on startup if missing.
- `AccountService` auto-assigns `user` role on registration via `RoleService.findByName('user')`.
- **Swagger** bearer auth is configured — click Authorize in `/docs` before testing protected routes.
- Docker Compose available for local Postgres + Redis setup.
