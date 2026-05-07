const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('candy_ecommerce.db');

db.serialize(() => {
  // Add missing columns to 'banners' table
  const columnsToAdd = [
    { name: 'image_pc_url', type: 'VARCHAR' },
    { name: 'image_mobile_url', type: 'VARCHAR' },
    { name: 'start_date', type: 'DATETIME' },
    { name: 'position', type: 'VARCHAR DEFAULT "home"' },
    { name: 'priority', type: 'INTEGER DEFAULT 0' },
    { name: 'impressions', type: 'INTEGER DEFAULT 0' },
    { name: 'clicks', type: 'INTEGER DEFAULT 0' },
    { name: 'created_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    { name: 'updated_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  ];

  db.all("PRAGMA table_info(banners)", (err, rows) => {
    if (err) return console.error(err);
    
    const existingColumns = rows.map(r => r.name);
    
    columnsToAdd.forEach(col => {
      if (!existingColumns.includes(col.name)) {
        console.log(`Adding column ${col.name}...`);
        db.run(`ALTER TABLE banners ADD COLUMN ${col.name} ${col.type}`, (err) => {
          if (err) console.error(`Error adding ${col.name}:`, err.message);
        });
      }
    });

    // If 'image_url' exists and 'image_pc_url' was just added, migrate data
    if (existingColumns.includes('image_url') && !existingColumns.includes('image_pc_url')) {
        // This will run after the ALTER TABLE if we use serialize, 
        // but since we are inside a callback, it might be tricky.
    }
  });
});

setTimeout(() => {
    console.log('Migration attempt finished.');
    db.close();
}, 3000);
