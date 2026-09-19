# API cho Page Bán Hàng (Storefront)

Base URL: `/api` (mặc định `http://localhost:3000/api`)

## Nguyên tắc chung của luồng mua hàng

- **Duyệt hàng: không cần đăng nhập.** Sản phẩm/danh mục/hãng đều public.
- **Chỉ khi bấm "Mua hàng" (checkout) mới bắt buộc đăng nhập.**
- Toàn bộ response thành công đều bọc trong:
  ```json
  { "success": true, "statusCode": 200, "data": { /* nội dung thật */ }, "timestamp": "...", "requestId": "..." }
  ```
  → luôn đọc `response.data`.
- Lỗi (4xx/5xx) trả format chuẩn NestJS, **không** bọc envelope: `{ "statusCode": 400, "message": "...", "error": "Bad Request" }`.
- Gửi token: header `Authorization: Bearer <access_token>`.

---

## 1. Đăng ký / Đăng nhập — `/auth` (public)

```
POST /auth/register
{ "username": "...", "email": "...", "password": "... (>=6 ký tự)" }
→ data: { id, username, email, role: { id, name } }
```

```
POST /auth/login
{ "username": "...", "password": "..." }
→ data: { access_token }   (+ set cookie httpOnly "refresh_token", 15 ngày)
```

```
POST /auth/refresh          // không cần Bearer, dùng cookie refresh_token
→ data: { access_token }    (cookie refresh_token cũng được cấp mới)
```

```
POST /auth/logout           // cần Bearer token
→ xoá cookie refresh_token
```

Access token sống 3 ngày. Lưu `access_token` ở phía client (memory/localStorage), **không tự set cookie access token** — server không đọc cookie cho access token.

## 2. Duyệt sản phẩm — public, không cần token

```
GET /products?page=1&perPage=20
GET /products/:id
GET /products/category/:categoryId     → trả array, không phân trang
GET /products/brand/:brandId           → trả array, không phân trang
GET /categories?page&perPage
GET /categories/:id
GET /brands?page&perPage
GET /brands/:id
```

Response 1 product:
```json
{
  "id": "uuid", "name": "Copic Sketch R01", "series": "Sketch", "price": 45000,
  "image": "https://...",
  "categoryId": "uuid", "category": { "id": "...", "name": "Marker" },
  "brandId": "uuid", "brand": { "id": "...", "name": "Copic" },
  "detail": { "nibType": "Brush & Chisel", "inkType": "Alcohol-based", "colorCount": 1, "stock": 42, "isActive": true },
  "createdAt": "..."
}
```
`detail.stock` dùng để hiển thị còn hàng/hết hàng ngay trên UI (không cần gọi API riêng).

## 3. Hồ sơ cá nhân — `/profile/me` (cần đăng nhập)

```
GET /profile/me
→ data: { id, accountId, fullName, username, email, phone, address, img }
```
```
PATCH /profile/me
{ "fullName"?, "phone"?, "address"?, "img"? }
```
`username`/`email` chỉ đọc (đồng bộ từ account lúc đăng ký, không sửa qua đây).

## 4. Mua hàng — `POST /checkout` (cần đăng nhập, bất kỳ role)

Đây là **API duy nhất nên dùng để tạo đơn hàng** từ storefront — atomic, tự tính giá/tồn kho/tổng tiền, không cần gọi `orders`/`order-items`/`payments` riêng lẻ (những API đó giờ chỉ admin gọi được).

```
POST /checkout
{
  "name": "Nguyễn Văn A",          // optional, điền hồ sơ khách nếu chưa có
  "phone": "0901234567",           // optional
  "email": "a@gmail.com",          // optional, mặc định lấy email của account đang login

  "addressId": "uuid",             // dùng địa chỉ đã lưu — PHẢI thuộc đúng khách này
  // HOẶC
  "newAddress": { "address": "123 Lê Lợi", "city": "HCM", "country": "Vietnam" },

  "items": [
    { "productId": "uuid", "quantity": 2 },
    { "productId": "uuid", "quantity": 1 }
  ],

  "paymentMethod": "cod"           // optional: cod | bank_transfer | momo | vnPay
}
```

Bắt buộc: `items` (ít nhất 1), và **1 trong 2** `addressId`/`newAddress`.

Response = 1 order đầy đủ:
```json
{
  "id": "uuid", "customerId": "uuid", "addressId": "uuid",
  "status": "pending", "totalAmount": 91000, "orderedAt": "...",
  "items": [
    { "id": "uuid", "productId": "uuid", "quantity": 2, "unitPrice": 45000, "product": { "id": "...", "name": "...", "price": 45000 } }
  ],
  "payment": { "id": "uuid", "method": "cod", "status": "pending", "amount": 91000, "paidAt": null },
  "address": { "id": "uuid", "address": "123 Lê Lợi", "city": "HCM", "country": "Vietnam" }
}
```

Lỗi thường gặp:
- `400` — thiếu `items`/địa chỉ, hoặc hết hàng (`Insufficient stock for product #...`).
- `404` — `productId` không tồn tại, hoặc `addressId` không thuộc khách này.
- `409` — email trong request đã gắn với **account khác** (hiếm, xảy ra khi 2 người dùng chung email).

⚠️ **Chưa tích hợp cổng thanh toán thật** (Momo/VNPay) — `paymentMethod`/`Payment` hiện chỉ là ghi nhận ý định thanh toán, chưa có webhook xác nhận đã trả tiền thật. Với `cod`/`bank_transfer` không ảnh hưởng gì (đúng bản chất). Nếu cần Momo/VNPay thật phải làm thêm.

## 5. Đơn hàng của tôi — cần đăng nhập, tự động lọc theo tài khoản

Không cần biết `customerId` — các API này tự suy ra khách hàng từ token và chỉ trả dữ liệu của chính mình.

```
GET /orders?page&perPage                    → chỉ đơn của mình
GET /orders/:id                              → 403 nếu không phải đơn của mình
GET /orders/customer/:customerId             → 403 nếu customerId không phải của mình

GET /order-items?page&perPage
GET /order-items/order/:orderId
GET /order-items/:id

GET /payments?page&perPage
GET /payments/order/:orderId
GET /payments/:id
```

Không có quyền `POST/PATCH/DELETE` trên `orders`/`order-items`/`payments` từ storefront — mọi thay đổi đơn hàng đi qua `/checkout` (tạo mới) hoặc do admin xử lý (đổi status, huỷ đơn...).

## 6. Địa chỉ giao hàng — `/addresses` (cần đăng nhập)

Có thể quản lý sổ địa chỉ riêng ngoài `/checkout` (ví dụ trang "Địa chỉ của tôi"):

```
GET  /addresses/customer/:customerId
POST /addresses          { customerId, address, city?, country?, isDefault? }
PATCH /addresses/:id     { address?, city?, country?, isDefault? }
DELETE /addresses/:id
```

⚠️ **Chưa có kiểm tra ownership ở đây** (khác với `/checkout`, nơi đã kiểm tra) — về mặt kỹ thuật một user đăng nhập vẫn có thể sửa/xoá address của `customerId` khác nếu biết ID. Cẩn trọng khi build UI (chỉ hiển thị/thao tác trên địa chỉ mà chính app tạo/biết), và nên báo lại nếu cần khoá chặt hơn.

## 7. Lấy `customerId` của tôi để dùng cho `/addresses`

Hiện **không có endpoint "GET customer của tôi"** — `customerId` chỉ xuất hiện trong response của `/checkout` (field `customerId`) hoặc `/orders/:id`. Nên lưu lại `customerId` từ lần checkout/order gần nhất để dùng cho phần quản lý địa chỉ, hoặc hỏi lại nếu cần thêm 1 endpoint kiểu `GET /customers/me`.
