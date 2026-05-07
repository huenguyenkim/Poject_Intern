const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('candy_ecommerce.db');

db.serialize(() => {
  // Try to find the banner
  db.get("SELECT id FROM banners WHERE title LIKE '%SPRING%'", (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }
    
    if (row) {
      console.log('Found banner ID:', row.id);
      const stmt = db.prepare("UPDATE banners SET image_pc_url = ?, image_mobile_url = ? WHERE id = ?");
      stmt.run('/images/banners/spring-delights.png', '/images/banners/spring-delights.png', row.id);
      stmt.finalize();
      console.log('Update successful');
    } else {
      console.log('Banner not found, inserting...');
      const stmt = db.prepare("INSERT INTO banners (title, description, image_pc_url, image_mobile_url, is_active, priority, link_url, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      stmt.run(
        'SPRING DELIGHTS', 
        'Đắm chìm trong bộ sưu tập kẹo dẻo thủ công mới của chúng tôi. Giảm giá lên đến 40% cho tất cả các loại kẹo trái cây tuần này!', 
        '/images/banners/spring-delights.png', 
        '/images/banners/spring-delights.png', 
        1, 10, '/shop', 'home'
      );
      stmt.finalize();
      console.log('Insert successful');
    }
  });
});

db.close();
