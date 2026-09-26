# API Dashboard — cho Admin FE

Base URL: `/api` (mặc định `http://localhost:3000/api`)

| Endpoint | Dùng cho | Role |
|----------|----------|------|
| `GET /api/dashboard/summary` | Các ô số liệu tổng quan trên trang Dashboard | `admin` |

## Auth

Đăng nhập bằng account có `role = admin` (`POST /api/auth/login`), rồi gửi token trong header:

```
Authorization: Bearer <access_token>
```

Nếu không có token sẽ nhận `401`, còn account không phải `admin` sẽ nhận `403`.

## Response envelope

Mọi response thành công đều được bọc như sau, dữ liệu thật nằm trong `data`:

```json
{
  "success": true,
  "statusCode": 200,
  "data": { },
  "timestamp": "2026-09-26T...",
  "requestId": "..."
}
```

Lỗi trả về theo format chuẩn của NestJS: `{ "statusCode": 403, "message": "Insufficient role permissions", "error": "Forbidden" }`.

Rate limit toàn cục là 20 request / phút / client, vượt quá sẽ trả `429`.

---

## Tổng quan Dashboard

```
GET /api/dashboard/summary
```

Endpoint này không có query param. Số liệu được tính trên **toàn thời gian**.

### Quy tắc tính

| Field | Ý nghĩa |
|-------|---------|
| `totalRevenue` | Tổng `totalAmount` của mọi đơn **không** bị `cancelled` (VND) |
| `totalOrders` | Tổng số đơn hàng, **bao gồm cả** đơn `cancelled` |
| `totalProduct` | Tổng số sản phẩm |
| `totalUser` | Tổng số account, **bao gồm cả** account `admin` |

### Ví dụ

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "totalRevenue": 1285430000,
    "totalOrders": 132,
    "totalProduct": 12,
    "totalUser": 12
  },
  "timestamp": "2026-09-26T08:00:00.000Z",
  "requestId": "..."
}
```

### Kiểu dữ liệu (TypeScript)

```ts
interface DashboardSummary {
  totalRevenue: number; // VND
  totalOrders: number;
  totalProduct: number;
  totalUser: number;
}
```

---

## Dữ liệu test

Chạy `npm run seed` sẽ tạo account `admin` (password xem trong `src/database/seed.ts`) và đơn hàng của 6 tháng gần nhất, để các ô tổng quan có số liệu. Lưu ý: seed sẽ **xoá toàn bộ** dữ liệu cũ trong DB.
