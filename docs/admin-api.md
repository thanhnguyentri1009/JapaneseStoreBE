# API cho Admin Panel

Base URL: `/api` (mặc định `http://localhost:3000/api`)

## Auth

Đăng nhập bằng một account có `role = admin`:

```
POST /api/auth/login
{ "username": "...", "password": "..." }
```

Trả về `{ access_token }` (JSON) + set cookie `refresh_token` (httpOnly). Cookie này dùng `Secure` luôn bật, và `SameSite=None` khi `NODE_ENV=production` (bắt buộc để trình duyệt gửi cookie cross-site khi FE và BE khác domain, ví dụ FE trên Vercel/Netlify, BE trên Render) — dev local (`NODE_ENV` khác `production`, chạy `http`) dùng `SameSite=Lax`. Gửi `access_token` trong header:

```
Authorization: Bearer <access_token>
```

Refresh token khi access token hết hạn (3 ngày):

```
POST /api/auth/refresh   // đọc cookie refresh_token, trả access_token mới
```

Đăng xuất — cần Bearer token hợp lệ (mọi role, kể cả `admin`):

```
POST /api/auth/logout
```

Xoá cookie `refresh_token` phía client **và** vô hiệu hoá refresh token đó trong DB (set `NULL`) — token cũ dùng lại `POST /auth/refresh` sẽ bị `401`. Không có khái niệm "thu hồi tất cả session": mỗi account chỉ lưu 1 refresh token còn hiệu lực tại một thời điểm (login/refresh mới sẽ ghi đè token cũ), nên logout luôn thu hồi toàn bộ phiên đang có của account đó, kể cả cho `admin`.

> Muốn tạo account admin: hiện **chưa có** endpoint đổi role cho account đã tồn tại. Chỉ set được `roleId` lúc `POST /accounts` (tạo mới, **cần role `admin`**). Lấy `roleId` của role `admin` qua `GET /roles` (**cần role `admin`**) — account admin đầu tiên phải được tạo qua `npm run seed` hoặc thao tác DB trực tiếp.

## Response envelope (áp dụng cho MỌI endpoint thành công)

```json
{
  "success": true,
  "statusCode": 200,
  "data": { /* nội dung thật nằm ở đây */ },
  "timestamp": "2026-09-19T...",
  "requestId": "..."
}
```

Lỗi (4xx/5xx) **không** đi qua envelope này, trả nguyên format chuẩn của NestJS:
```json
{ "statusCode": 400, "message": "...", "error": "Bad Request" }
```

## Pagination (query params)

Áp dụng cho mọi `GET` danh sách: `?page=1&perPage=10` (mặc định `page=1`, `perPage=10`).
Response `data`: `{ items: [...], page, perPage, total }`.

## Phân quyền

- Token hợp lệ nhưng role không đủ → `403 Forbidden`.
- Không có token / token sai → `401 Unauthorized`.
- `role` lấy từ JWT payload (`admin` hoặc `user`), gán lúc tạo account.

---

## 1. Accounts — `/accounts` 🔒 admin-only (toàn bộ)

| Method | Path | Body | Ghi chú |
|---|---|---|---|
| GET | `/accounts?page&perPage` | — | danh sách account |
| GET | `/accounts/:id` | — | |
| POST | `/accounts` | `{ username, email, password, roleId? }` | không có `roleId` → gán role `user` mặc định |
| PATCH | `/accounts/:id` | `{ username, email?, password? }` | |
| DELETE | `/accounts/:id` | — | trả `204 No Content` |

Response account (`AccountResponseDto`): `{ id, username, email, role: { id, name } | null }` (không có `password`, `refresh_token`).

Account thường (`role: user`) tự sửa thông tin của chính mình qua `PATCH /profile/me` (mục 12), không qua `/accounts`.

## 2. Roles — `/roles` 🔒 admin-only (toàn bộ)

| Method | Path | Body |
|---|---|---|
| GET | `/roles?page&perPage` | — |
| GET | `/roles/:id` | — |
| POST | `/roles` | `{ name }` |
| PATCH | `/roles/:id` | `{ name? }` |
| DELETE | `/roles/:id` | — |

Role mặc định `user`/`admin` tự tạo lúc app khởi động (không cần gọi API).

## 3. Categories — `/categories`

Đọc (`GET`) là **public**. Ghi (`POST`/`PATCH`/`DELETE`) 🔒 **admin-only**.

| Method | Path | Body |
|---|---|---|
| GET | `/categories?page&perPage` | public |
| GET | `/categories/:id` | public |
| POST | `/categories` | **admin** — `{ name }` |
| PATCH | `/categories/:id` | **admin** — `{ name? }` |
| DELETE | `/categories/:id` | **admin** |

## 4. Brands — `/brands`

Giống Categories.

| Method | Path | Body |
|---|---|---|
| GET | `/brands?page&perPage` | public |
| GET | `/brands/:id` | public |
| POST | `/brands` | **admin** — `{ name }` (max 100 ký tự) |
| PATCH | `/brands/:id` | **admin** — `{ name? }` |
| DELETE | `/brands/:id` | **admin** |

## 5. Products — `/products`

Đọc là public. Ghi (`POST`/`PATCH`/`DELETE`) 🔒 **admin-only**.

| Method | Path | Body |
|---|---|---|
| GET | `/products?page&perPage` | public |
| GET | `/products/category/:categoryId` | public, trả array |
| GET | `/products/brand/:brandId` | public, trả array |
| GET | `/products/:id` | public |
| POST | `/products` | **admin** — xem dưới |
| PATCH | `/products/:id` | **admin** — các field optional |
| DELETE | `/products/:id` | **admin** |

`CreateProductDto`:
```json
{
  "categoryId": "uuid?",
  "brandId": "uuid?",
  "name": "string",
  "series": "string?",
  "image": "string",
  "nibType": "string?",
  "inkType": "string?",
  "colorCount": 1,
  "price": 45000,
  "stock": 100,
  "isActive": true
}
```
`nibType/inkType/colorCount/stock/isActive` thực chất lưu ở bảng `product_details` riêng, nhưng gộp vào 1 DTO cho tiện.

Response (`ProductResponseDto`):
```json
{
  "id": "uuid", "name": "...", "series": "...", "price": 45000, "image": "...",
  "categoryId": "uuid", "category": { "id": "...", "name": "..." },
  "brandId": "uuid", "brand": { "id": "...", "name": "..." },
  "detail": { "nibType": "...", "inkType": "...", "colorCount": 1, "stock": 100, "isActive": true, "descriptions": [] },
  "createdAt": "..."
}
```

## 6. Customers — `/customers` 🔒 admin-only (toàn bộ)

Dùng để quản lý khách hàng thủ công (customer thật ra được tạo tự động khi khách checkout — xem file storefront).

| Method | Path | Body |
|---|---|---|
| GET | `/customers?page&perPage` | |
| GET | `/customers/email/:email` | |
| GET | `/customers/:id` | |
| POST | `/customers` | `{ name, email, phone? }` |
| PATCH | `/customers/:id` | các field optional |
| DELETE | `/customers/:id` | |

Response có thêm `accountId` (null nếu khách chưa từng đăng nhập khi mua) và `isRegistered` (true nếu customer này gắn với 1 account).

## 7. Addresses — `/addresses`

Cần login. `PATCH`/`DELETE` giờ có **ownership check**: `admin` sửa/xoá address bất kỳ; account `role: user` chỉ sửa/xoá được address thuộc `customer` gắn với chính account đó (`customer.accountId === request.user.sub`) — sai chủ sẽ trả `403 Forbidden`. `GET`/`POST` vẫn mở cho mọi role đã login (không đổi).

| Method | Path | Body | Role |
|---|---|---|---|
| GET | `/addresses?page&perPage` | | mọi role |
| GET | `/addresses/customer/:customerId` | | mọi role |
| GET | `/addresses/:id` | | mọi role |
| POST | `/addresses` | `{ customerId, address, city?, country?, isDefault? }` | mọi role |
| PATCH | `/addresses/:id` | optional fields | **admin**, hoặc **owner** của address |
| DELETE | `/addresses/:id` | | **admin**, hoặc **owner** của address |

## 8. Orders — `/orders` 🔒 admin-only cho ghi

| Method | Path | Role | Body |
|---|---|---|---|
| GET | `/orders?page&perPage` | mọi role (user chỉ thấy đơn của mình) | |
| GET | `/orders/customer/:customerId` | mọi role (user chỉ xem được customerId của chính mình) | |
| GET | `/orders/:id` | mọi role (user chỉ xem được đơn của mình) | |
| POST | `/orders` | **admin** | `{ customerId, addressId?, status? }` — không nhận `totalAmount`, server tự tính từ order-items |
| PATCH | `/orders/:id` | **admin** | `{ addressId?, status? }` — chuyển `status` sang `cancelled` sẽ tự hoàn kho |
| DELETE | `/orders/:id` | **admin** | |

> Với luồng bán hàng thật, **không dùng các API tạo/sửa order này** — dùng `POST /checkout` (xem file storefront) để đảm bảo giá/tồn kho/tổng tiền đúng và atomic.

`status` enum: `pending | confirmed | shipping | delivered | cancelled`.

## 9. Order Items — `/order-items` 🔒 admin-only cho ghi

| Method | Path | Role |
|---|---|---|
| GET | `/order-items?page&perPage` | mọi role (scoped) |
| GET | `/order-items/order/:orderId` | mọi role (scoped) |
| GET | `/order-items/:id` | mọi role (scoped) |
| POST | `/order-items` | **admin** — `{ orderId, productId, quantity }` (không nhận `unitPrice`, server tự lấy giá `Product.price` hiện tại) |
| POST | `/order-items/bulk` | **admin** — `{ items: [{ orderId, productId, quantity }] }` |
| PATCH | `/order-items/:id` | **admin** — đổi `quantity`/`productId` sẽ tự điều chỉnh lại kho |
| DELETE | `/order-items/:id` | **admin** — tự hoàn kho |

## 10. Payments — `/payments` 🔒 admin-only cho ghi

*(Ghi chú: chưa tích hợp cổng thanh toán thật Momo/VNPay — bảng này hiện chỉ để ghi nhận trạng thái thủ công.)*

| Method | Path | Role |
|---|---|---|
| GET | `/payments?page&perPage` | mọi role (scoped) |
| GET | `/payments/order/:orderId` | mọi role (scoped) |
| GET | `/payments/:id` | mọi role (scoped) |
| POST | `/payments` | **admin** — `{ orderId, method?, status?, amount?, paidAt? }` |
| PATCH | `/payments/:id` | **admin** |
| DELETE | `/payments/:id` | **admin** |

`method` enum: `cod | bank_transfer | momo | vnPay`. `status` enum: `pending | paid | failed`.

## 11. Storage (upload ảnh) — `/storage`

| Method | Path | Body |
|---|---|---|
| POST | `/storage/upload` | multipart/form-data, field `image` (jpg/png, tối đa 2MB) |

Trả về `{ filename, url, createdAt }` (ảnh lưu trên Supabase Storage, bucket public).

## 12. Profile — `/profile/me`

Dùng chung với storefront (mỗi account, kể cả admin, đều có 1 profile riêng). Xem chi tiết ở file storefront.
