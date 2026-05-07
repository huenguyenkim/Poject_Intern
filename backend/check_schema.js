const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('candy_ecommerce.db');

db.all("PRAGMA table_info(banners)", (err, rows) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log(JSON.stringify(rows, null, 2));
  db.close();
});
