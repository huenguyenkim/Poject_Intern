import { io } from "socket.io-client";

console.log("[Test 2] Khởi tạo kết nối WebSocket KHÔNG có Token...");

// 1. Cố tình không truyền 'extraHeaders: { Authorization: ... }'
const socket = io("http://127.0.0.1:3000", {
    transports: ["websocket"]
});

// 2. Lắng nghe sự kiện kết nối thành công (Tầng Gateway)
socket.on("connect", () => {
    console.log("🔗 Đã kết nối được tới Gateway (Mức cơ bản).");
    console.log("🕵️‍♂️ Đang gửi lệnh 'joinAdminDashboard' để nghe lén dữ liệu Admin...");

    // Gửi sự kiện xin vào phòng Dashboard
    socket.emit("joinAdminDashboard");
});

// 3. NestJS WsException sẽ bắt lỗi và trả về sự kiện 'exception' hoặc 'error'
socket.on("exception", (error) => {
    console.log("\n✅ [THÀNH CÔNG] BẢO MẬT HOẠT ĐỘNG TỐT: Lệnh xâm nhập đã bị chặn!");
    console.log(`🛡️ Thông báo từ WsJwtGuard: "${error.message || error}"`);
    process.exit(0); // Kết thúc bài test
});

socket.on("error", (error) => {
    console.log("\n✅ [THÀNH CÔNG] BẢO MẬT HOẠT ĐỘNG TỐT: Lệnh xâm nhập đã bị chặn!");
    console.log(`🛡️ Lỗi trả về: "${error.message || error}"`);
    process.exit(0);
});

// Phòng trường hợp Middleware chặn ngay từ lúc bắt tay (Handshake)
socket.on("connect_error", (err) => {
    console.log("\n✅ [THÀNH CÔNG] BẢO MẬT HOẠT ĐỘNG TỐT: Bị từ chối ngay từ vòng Handshake!");
    console.log(`🛡️ Thông báo: "${err.message}"`);
    process.exit(0);
});