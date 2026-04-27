# Cấu hình Tên miền Tùy chỉnh (Custom Domain) & SEO Nâng cao

Hướng dẫn này giúp bạn đưa cửa hàng **Candy Shop** lên một tên miền riêng chuyên nghiệp và tối ưu khả năng hiển thị trên mạng xã hội.

---

## 1. Thiết lập Custom Domain (Theo Bài học 5)

### Bước 1: Mua Domain
Bạn có thể mua tên miền từ các nhà cung cấp uy tín:
- **Việt Nam**: Mắt Bão, PA Việt Nam, Tenten (Phù hợp cho đuôi `.vn`).
- **Quốc tế**: Namecheap, GoDaddy, Cloudflare (Phù hợp cho đuôi `.com`, `.shop`, `.io`).

### Bước 2: Cấu hình DNS
Sau khi mua, hãy vào trang quản trị DNS của nhà cung cấp và thêm bản ghi:
- **Loại (Type)**: `CNAME`
- **Tên (Name)**: `www` (hoặc `@` nếu nhà cung cấp hỗ trợ CNAME flattening)
- **Giá trị (Value)**: URL dự án của bạn (ví dụ: `candy-store.lovable.app`)

### Bước 3: Xác minh trong Hosting
Nếu bạn sử dụng Lovable hoặc các nền tảng tương tự, hãy vào **Project Settings → Domain** và nhập tên miền của bạn để hệ thống tự động xác minh.

---

## 2. Giải pháp cho Single Page Application (SPA)

Vì trang web được xây dựng bằng React, đôi khi các bot của **Facebook** hoặc **Zalo** có thể không chạy JavaScript để đọc các thẻ meta động từ `react-helmet-async`.

### Thách thức
Googlebot hiện tại đã đọc JavaScript rất tốt, nhưng để link hiển thị đẹp (có ảnh preview) khi gửi qua tin nhắn, bạn nên:

### Giải pháp Khuyên dùng
1. **Prerender.io**: Một dịch vụ giúp "chụp ảnh" trang web của bạn thành HTML tĩnh khi thấy bot truy cập. Rất dễ tích hợp và có gói miễn phí.
2. **SSR (Server Side Rendering)**: Nếu dự án phát triển lớn hơn, việc chuyển đổi sang **Next.js** hoặc sử dụng **Vite-plugin-ssr** sẽ giúp SEO đạt hiệu quả 100%.

---

## 3. Quản lý Price Validity (Schema Markup)

Trong file `src/components/seo/SEO.jsx`, tôi đã thiết lập logic tự động cập nhật trường `priceValidUntil`.
- **Logic**: Tự động đặt ngày hết hạn là ngày **31 tháng 12 của năm hiện tại**.
- **Lợi ích**: Giúp bạn không bao giờ bị Google Search Console báo lỗi "Thiếu ngày hết hạn giá" mà không cần can thiệp thủ công hàng ngày.

---

## 4. Tối ưu Image SEO

Đảm bảo mọi sản phẩm bạn đăng lên đều có **Tên sản phẩm** rõ ràng. Hệ thống sẽ tự động lấy tên đó để làm thẻ `alt` cho ảnh, giúp sản phẩm của bạn xuất hiện trong kết quả tìm kiếm hình ảnh của Google.

---
**Status**: Ready for Launch! 🚀🍭
