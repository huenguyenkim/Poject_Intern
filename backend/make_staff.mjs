import sqlite3Pkg from 'sqlite3';
const sqlite3 = sqlite3Pkg.verbose();

const db = new sqlite3.Database('./candy_ecommerce.db', (err) => {
    if (err) {
        console.error('❌ Lỗi kết nối DB:', err.message);
        return;
    }
    console.log('🔗 Đã kết nối tới SQLite Database.');
});

const targetUserId = 1;

db.run(`UPDATE users SET role = 'staff' WHERE id = ?`, [targetUserId], function (err) {
    if (err) {
        return console.error('❌ Lỗi khi cập nhật:', err.message);
    }

    if (this.changes === 0) {
        console.log(`⚠️ Không tìm thấy user nào có ID = ${targetUserId}. Bạn hãy thử đăng ký 1 tài khoản trên web trước nhé!`);
    } else {
        console.log(`✅ [THÀNH CÔNG] Đã cấp quyền STAFF cho User ID = ${targetUserId}`);

        db.get(`SELECT id, email, role FROM users WHERE id = ?`, [targetUserId], (err, row) => {
            console.log('👤 Thông tin tài khoản Staff của bạn:', row);
        });
    }
});

db.close();