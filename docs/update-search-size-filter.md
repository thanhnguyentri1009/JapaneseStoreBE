# Cập nhật API: tìm kiếm theo tên (`searchText`) + lọc theo `size`

Base URL: `/api`

## 1. ⚠️ Breaking change: `colorCount` → `size`

Field `colorCount` trong `product_details` đã đổi tên thành **`size`** (số lượng màu trong 1 set/hộp — ví dụ 70 màu, 150 màu). Lý do đổi: cùng 1 tên sản phẩm (ví dụ "Copic Sketch Set") có thể bán nhiều loại khác nhau theo số màu, mỗi loại là 1 product row riêng — tên `colorCount` gây hiểu lầm là số màu lọc/filter, còn `size` mô tả đúng bản chất "loại/size của set".

Ảnh hưởng tới FE:
- Request `POST /products` / `PATCH /products/:id`: đổi field `colorCount` → `size`.
- Response `ProductResponseDto.detail`: đổi field `colorCount` → `size`.

```diff
  // request tạo/sửa product
  {
    "nibType": "Brush & Chisel",
    "inkType": "Alcohol-based",
-   "colorCount": 70,
+   "size": 70,
    "price": 45000
  }
```

```diff
  // response GET /products/:id
  "detail": {
    "nibType": "Brush & Chisel",
    "inkType": "Alcohol-based",
-   "colorCount": 70,
+   "size": 70,
    "stock": 42,
    "isActive": true
  }
```

## 2. Filter mới: `size` (chỉ Products)

Lọc sản phẩm theo số màu trong set — dùng khi cùng 1 tên sản phẩm có nhiều loại (70 màu / 150 màu...) và cần cho khách chọn đúng loại.

```
GET /products?size=70
GET /products/category/:categoryId?size=70
GET /products/brand/:brandId?size=70
```

- Optional, số nguyên (`?size=70`). Không truyền → không lọc.
- Match tuyệt đối (không phải khoảng), vì `size` là 1 giá trị rời rạc (70, 150, ...), không phải range.

## 3. Filter mới: `searchText` (tìm theo tên)

Query param `searchText`, tìm gần đúng, không phân biệt hoa/thường (`%text%`). Áp dụng cho các `GET` danh sách sau:

| Endpoint | Field được search |
|---|---|
| `GET /products` | `name` |
| `GET /products/category/:categoryId` | `name` |
| `GET /products/brand/:brandId` | `name` |
| `GET /categories` | `name` |
| `GET /brands` | `name` |
| `GET /customers` 🔒admin | `name` |
| `GET /accounts` 🔒admin | `username` |

```
GET /products?searchText=copic
GET /categories?searchText=marker
```

`searchText` và `size` có thể kết hợp cùng lúc và kết hợp với `page`/`perPage`:

```
GET /products?page=1&perPage=20&searchText=sketch&size=70
```

**Không** áp dụng `searchText` cho: `roles`, `orders`, `order-items`, `payments`, `addresses` (không có field tên phù hợp để search).

## 4. Lưu ý cache (không ảnh hưởng FE, chỉ để biết)

`GET /products/category/:categoryId` và `GET /products/brand/:brandId` khi gọi **không** kèm `searchText`/`size` sẽ được cache (Redis, phía server) — gọi có filter thì luôn lấy dữ liệu mới, không bị cache stale.
