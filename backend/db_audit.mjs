import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const db = new sqlite3.Database('candy_ecommerce.db');
const dbRun = promisify(db.run.bind(db));
const dbAll = promisify(db.all.bind(db));

async function runAudit() {
  console.log('🚀 Starting Database Integrity Audit (State Debugging)...\n');

  try {
    // 1. Check for orphaned OrderItems (order_id or product_id missing)
    const orphans = await dbAll(`
      SELECT oi.id, oi.order_id, oi.product_id 
      FROM order_items oi
      LEFT JOIN orders o ON oi.order_id = o.id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id IS NULL OR p.id IS NULL
    `);
    console.log(`🔍 Orphaned OrderItems: ${orphans.length}`);
    if (orphans.length > 0) console.table(orphans);

    // 2. Check for negative stock levels
    const negativeStock = await dbAll(`
      SELECT id, product_name, stock FROM products WHERE stock < 0
    `);
    console.log(`📦 Products with Negative Stock: ${negativeStock.length}`);
    if (negativeStock.length > 0) console.table(negativeStock);

    // 3. Verify Order Totals vs Items sum
    const totalMismatches = await dbAll(`
      SELECT o.id, o.total_amount, SUM(oi.quantity * oi.unit_price) as actual_sum
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      HAVING ABS(o.total_amount - (SUM(oi.quantity * oi.unit_price) * 1.08 + (CASE WHEN SUM(oi.quantity * oi.unit_price) > 50 THEN 0 ELSE 5.99 END))) > 0.01
    `);
    // Note: 1.08 assumes 8% tax and shipping logic we implemented earlier
    console.log(`💰 Order Total Mismatches (Financial Precision): ${totalMismatches.length}`);
    if (totalMismatches.length > 0) console.table(totalMismatches);

    // 4. Check for duplicate emails
    const duplicateEmails = await dbAll(`
      SELECT email, COUNT(*) as count FROM users GROUP BY email HAVING count > 1
    `);
    console.log(`📧 Duplicate User Emails: ${duplicateEmails.length}`);
    if (duplicateEmails.length > 0) console.table(duplicateEmails);

    // 5. Schema Check: Null Check on required fields
    const nullFields = await dbAll(`
      SELECT 'Product' as table_name, id FROM products WHERE product_name IS NULL
      UNION
      SELECT 'User' as table_name, id FROM users WHERE email IS NULL
    `);
    console.log(`🚫 Required Null Fields Violations: ${nullFields.length}`);

    console.log('\n✅ Audit Complete.');
  } catch (error) {
    console.error('❌ Audit Failed:', error.message);
  } finally {
    db.close();
  }
}

runAudit();
