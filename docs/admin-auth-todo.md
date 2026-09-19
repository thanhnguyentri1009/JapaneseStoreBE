# TODO cho BE — Auth & phân quyền Admin Panel

File này liệt kê lại các gap mà chính `admin-api.md` đã note (⚠️/ghi chú rải rác), gộp thành checklist theo độ ưu tiên, cộng thêm 1 điểm phát sinh từ việc FE admin vừa đổi cách lưu access token (xem mục "Phụ thuộc mới từ FE" ở cuối).

## 1. Ưu tiên cao — khoá quyền

| Resource | Hiện tại | Cần | Ghi chú |
|---|---|---|---|
| `/roles` (toàn bộ, kể cả POST/PATCH/DELETE) | Public, không cần token | **Admin-only** | Đây là chỗ hở nặng nhất: ai cũng tạo/sửa/xoá role kể cả role `admin` mà không cần đăng nhập. |
| `/accounts` (toàn bộ) | Cần login, role bất kỳ | **Admin-only** | Account thường (`role: user`) hiện gọi được GET/PATCH/DELETE account của người khác. |
| `/addresses` PATCH/DELETE | Cần login, **không có ownership check** | Admin-only, hoặc tối thiểu: chỉ owner (`customer.accountId === request user`) mới sửa/xoá được address của chính mình | Hiện ai login cũng sửa/xoá address của customer bất kỳ nếu biết ID. |

## 2. Ưu tiên trung bình — ghi dữ liệu catalog/khách hàng

| Resource | Hiện tại | Cần |
|---|---|---|
| `/categories` POST/PATCH/DELETE | Cần login, role bất kỳ | Admin-only |
| `/brands` POST/PATCH/DELETE | Cần login, role bất kỳ | Admin-only |
| `/products` POST/PATCH/DELETE | Cần login, role bất kỳ | Admin-only |
| `/customers` (toàn bộ) | Cần login, role bất kỳ | Admin-only |

Lý do gộp nhóm này ở mức trung bình (không phải cao): đây là các API mà **chỉ admin panel gọi tới** (storefront không đụng vào catalog viết hay customers), nên rủi ro thực tế thấp hơn nhóm 1, nhưng vẫn nên khoá theo đúng nguyên tắc least privilege thay vì dựa vào "FE không cho bấm nút".

## 3. Doc bị thiếu / lệch giữa 2 file

- `POST /auth/logout` **có tồn tại** (thấy trong `storefront-api.md`: cần Bearer token, xoá cookie `refresh_token`) nhưng **không được nhắc tới trong `admin-api.md`**. Đề nghị:
  1. Xác nhận endpoint này hoạt động đúng với account `role: admin` (không riêng gì storefront).
  2. Bổ sung vào `admin-api.md` mục Auth.
- FE admin hiện đã wire nút "Logout" gọi `POST /auth/logout` trước khi xoá session ở client — nếu endpoint có edge case riêng cho admin (ví dụ thu hồi tất cả refresh token đang active, không chỉ token trong cookie hiện tại) thì cần ghi rõ trong doc.

## 4. Phụ thuộc mới từ FE — quan trọng, có thể chặn hoàn toàn luồng login

FE admin (`japanese-store-fe-admin`) vừa đổi kiến trúc lưu `access_token`: **không còn lưu ở localStorage**, chỉ giữ trong memory (biến JS), để giảm rủi ro XSS đọc token vĩnh viễn. Hệ quả: **mỗi lần user F5 / mở lại tab, FE bắt buộc phải gọi `POST /auth/refresh` ngay khi app khởi động** để khôi phục phiên từ cookie `refresh_token`, trước khi cho vào bất kỳ trang admin nào.

Điều này chỉ hoạt động được nếu:

1. **Cookie `refresh_token` gửi được cross-site.** FE và BE thường deploy khác domain (VD: FE trên Vercel/Netlify, BE trên Render — xem `VITE_API_URL` hiện trỏ `japanesestorebe.onrender.com`). Cookie cross-site cần `SameSite=None; Secure` (và `Secure` bắt buộc phải chạy trên HTTPS). Nếu hiện tại cookie đang set `SameSite=Lax` hoặc `Strict`, request `withCredentials: true` từ domain FE sẽ **không gửi được cookie**, khiến `/auth/refresh` luôn thất bại sau mỗi lần reload → user bị đá về login liên tục dù vừa đăng nhập.
2. **CORS cho phép credentials với origin cụ thể.** `Access-Control-Allow-Credentials: true` + `Access-Control-Allow-Origin` phải là origin chính xác của FE (không được dùng `*` khi có credentials — trình duyệt sẽ chặn).

➡️ Nhờ BE xác nhận lại 2 điểm trên trước khi FE release bản đổi kiến trúc auth này lên production. Nếu hiện tại cookie đang set `SameSite=Lax` (phổ biến do NestJS default), đây sẽ là việc cần sửa trước tiên, ưu tiên cao hơn cả mục 1.
