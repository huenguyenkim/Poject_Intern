# Kế Hoạch Áp Dụng Hệ Sinh Thái Redux & Các Concept React Chuyên Sâu

Bạn đang yêu cầu một cuộc đại tu kiến trúc (Architecture Refactoring) kinh điển để đưa những khái niệm lõi của React và Redux vào dự án. Hiện tại dự án đang sử dụng `Context API` và `@tanstack/react-query`. Kế hoạch dưới đây sẽ từng bước chuyển đổi mảng **Giỏ Hàng (Cart)** và **Xác thực (Auth)** sang kiến trúc `Redux` theo đúng yêu cầu:

## User Review Required

> [!WARNING]  
> Việc đưa Redux vào sẽ thay thế một phần của `[CartContext]` hiện tại và cần cài thêm thư viện `@reduxjs/toolkit`, `react-redux`. Bạn có đồng ý cài đặt và cho phép refactor Cart system bằng Redux không?

## Proposed Changes

Tôi sẽ áp dụng đầy đủ các keyword bạn yêu cầu theo hệ thống sau:

### 1. Kiến trúc Redux: Redux, Thunk, Action Creator, Call API
- **[NEW] `src/store/store.js`**: Khởi tạo Redux Store quản lý Global State.
- **[NEW] `src/store/cartSlice.js`**: Tạo Slice quản lý trạng thái giỏ hàng (State).
- **[NEW] `src/store/authActions.js` (Thunk & Call API)**: Chứa các hàm asynchorous (Redux Thunk) gọi API đăng nhập, lấy thông tin User từ backend. Nơi này sẽ implement khái niệm **Action Creator** trả về một Promise.

### 2. Thiết kế Component Nâng Cao: HOC, Pure Component, Lifecycle
- **[NEW] `src/hoc/withAuth.jsx` (HOC - Higher Order Component)**: Một decorator component làm nhiệm vụ bọc (wrap) các trang Admin (`CategoryMgmt`, `ProductMgmt`). Nó sẽ truy cập Global Store (Redux), nếu chưa đăng nhập sẽ đẩy (Router Redirect) về trang báo lỗi - thể hiện khái niệm **Router**.
- **[MODIFY] `src/components/ui/Badge.jsx` (Pure Component)**: Bọc Component này bằng `React.memo` để tránh bị **Render** lại không cần thiết khi **Props** không đổi (Đại diện cho Pure Component trong functional style).
- **[NEW] `src/components/misc/Clock.jsx` (Lifecycle & Binding)**: Chèn một widget đồng hồ tại Header, sử dụng Class Component với `componentDidMount`, `componentWillUnmount` (hoặc `useEffect` đại diện cho hàm Lifecycle) và xử lý biến con trỏ cẩn thận bằng **Binding** / **Handling Events**.

### 3. State, Props, UI Components, Events, Hook
- Sửa đổi toàn bộ hệ thống Component dính dáng đến Cart (như `ProductCard`, `CartDrawer`, `Navbar`) để xóa `useCart` hook tùy chỉnh cũ và thay phiên sử dụng **React Hook** của Redux là `useSelector` (để lấy State) và `useDispatch` (để trigger **Event** / Action).

## Quy trình Thực thi

1. **Phase 1**: Cài đặt Package (`@reduxjs/toolkit`, `react-redux`).
2. **Phase 2**: Dựng Cây cấu trúc Thư mục Redux Store (Action Creator + Thunk + Slice).
3. **Phase 3**: Triển khai `HOC` (`withAuth`) và `Pure Component` (`React.memo` cho Card/Badge).
4. **Phase 4**: Setup và trỏ lại hệ thống Component (Gắn `Provider` ở Root + Thay đổi Logic trong `ProductCard`, `CartDrawer`).

## Open Questions
- Bạn muốn tôi tạo hệ thống Redux Thuần (Classic Redux kết hợp `redux-thunk`) hay Redux Toolkit (Morden Redux có tích hợp sẵn thunk)? *Gợi ý: Redux Toolkit hiện đang là tiêu chuẩn của React.*
