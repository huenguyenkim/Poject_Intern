const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('candy_ecommerce.db');

db.serialize(() => {
  // Check which column exists
  db.all("PRAGMA table_info(banners)", (err, rows) => {
    if (err) return console.error(err.message);
    
    const hasImagePc = rows.some(r => r.name === 'image_pc_url');
    const imageCol = hasImagePc ? 'image_pc_url' : 'image_url';
    const linkCol = rows.some(r => r.name === 'link_url') ? 'link_url' : 'link';

    db.get("SELECT id FROM banners WHERE title LIKE '%SPRING%'", (err, row) => {
      if (err) return console.error(err.message);
      
      const imagePath = '/images/banners/spring-delights.png';

      if (row) {
        console.log(`Updating banner ID: ${row.id} using column: ${imageCol}`);
        db.run(`UPDATE banners SET ${imageCol} = ? WHERE id = ?`, [imagePath, row.id], function(err) {
          if (err) console.error(err.message);
          else console.log('Update successful');
        });
      } else {
        console.log('Banner not found, inserting new one...');
        db.run(`INSERT INTO banners (title, ${imageCol}, is_active) VALUES (?, ?, ?)`, 
          ['SPRING DELIGHTS', imagePath, 1], function(err) {
            if (err) console.error(err.message);
            else console.log('Insert successful');
          });
      }
    });
  });
});

// We don't close immediately to let async finish
setTimeout(() => db.close(), 2000);
