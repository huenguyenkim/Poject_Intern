const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('candy_ecommerce.db');

db.serialize(() => {
  db.run(`ALTER TABLE banners ADD COLUMN created_at DATETIME`, (err) => {
    if (err) console.log('created_at already exists or error:', err.message);
    else console.log('created_at added');
  });
  db.run(`ALTER TABLE banners ADD COLUMN updated_at DATETIME`, (err) => {
    if (err) console.log('updated_at already exists or error:', err.message);
    else console.log('updated_at added');
  });
});

setTimeout(() => db.close(), 2000);
