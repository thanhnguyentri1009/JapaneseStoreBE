# API Thống kê — cho FE

Base URL: `/api` (mặc định `http://localhost:3000/api`)

| Endpoint | Dùng cho | Role |
|----------|----------|------|
| `GET /api/statistics/top-selling-products` | Biểu đồ / danh sách sản phẩm bán chạy | `admin` |

> ⚠️ Endpoint này hiện **yêu cầu role `admin`**. User thường gọi sẽ nhận `403`, còn không có token thì nhận `401`. Nếu storefront cần hiển thị cho user thường thì phía BE phải đổi quyền.

## Auth

Đăng nhập bằng account có `role = admin` (`POST /api/auth/login`), rồi gửi token trong header:

```
Authorization: Bearer <access_token>
```

## Response envelope

Mọi response thành công đều được bọc như sau, dữ liệu thật nằm trong `data`:

```json
{
  "success": true,
  "statusCode": 200,
  "data": [],
  "timestamp": "2026-09-26T...",
  "requestId": "..."
}
```

Lỗi trả về theo format chuẩn của NestJS: `{ "statusCode": 400, "message": [...], "error": "Bad Request" }`.

Rate limit toàn cục là 20 request / phút / client, vượt quá sẽ trả `429`.

---

## Sản phẩm bán chạy theo tháng

```
GET /api/statistics/top-selling-products
```

Trả về top N sản phẩm theo **tổng số lượng bán** trong 1 tháng, sắp xếp giảm dần.

### Query params

| Param | Kiểu | Bắt buộc | Mặc định | Ràng buộc |
|-------|------|----------|----------|-----------|
| `month` | int | không | tháng hiện tại | `1`–`12` |
| `year` | int | không | năm hiện tại | số nguyên |
| `limit` | int | không | `10` | `>= 1` |

Giá trị không hợp lệ (vd. `month=13`, `limit=0`) sẽ trả `400 Bad Request`.

### Quy tắc tính

- Chỉ tính các đơn có `orderedAt` nằm trong tháng được chọn (theo giờ server).
- **Bỏ qua** đơn `cancelled`. Các trạng thái còn lại (`pending`, `confirmed`, `shipping`, `delivered`) đều được tính.
- `totalQuantitySold` là tổng `quantity` của các order item.
- `totalRevenue` là tổng `quantity × unitPrice`, trong đó `unitPrice` là giá tại thời điểm đặt (VND).
- Tháng không có đơn nào sẽ trả `data: []`.

### Ví dụ

```
GET /api/statistics/top-selling-products?month=9&year=2026&limit=5
```

```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "productId": "3f1c2e9a-...",
      "productName": "Tombow Dual Brush 96 Colors",
      "image": "https://.../tombow-96.jpg",
      "totalQuantitySold": 42,
      "totalRevenue": 134400000
    },
    {
      "productId": "a8d4b1f0-...",
      "productName": "Copic Sketch 72A Set",
      "image": null,
      "totalQuantitySold": 35,
      "totalRevenue": 157500000
    }
  ],
  "timestamp": "2026-09-26T08:00:00.000Z",
  "requestId": "..."
}
```

### Kiểu dữ liệu (TypeScript)

```ts
interface TopSellingProduct {
  productId: string;        // uuid
  productName: string;
  image: string | null;     // null nếu sản phẩm chưa có ảnh
  totalQuantitySold: number;
  totalRevenue: number;     // VND
}
// data: TopSellingProduct[]
```

---

## Dữ liệu test

Chạy `npm run seed` sẽ tạo sẵn đơn hàng trải đều **6 tháng gần nhất** (tính cả tháng hiện tại), mỗi tháng 15–25 đơn gồm nhiều sản phẩm với số lượng khác nhau, đủ để FE hiển thị biểu đồ theo từng tháng. Lưu ý: seed sẽ **xoá toàn bộ** dữ liệu cũ trong DB.
