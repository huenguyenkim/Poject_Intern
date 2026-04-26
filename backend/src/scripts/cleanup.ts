import { AppDataSource } from '../data-source';

async function cleanup() {
  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    console.log('🧹 [TRANSACTION] Starting industrial-strength cleanup...');

    // 1. Inventory Logs (FK neutral)
    await queryRunner.query('DELETE FROM inventory_logs');
    console.log(' - Deleted inventory_logs');

    // 2. Audit Logs (Partial wipe: delete TEST actions or older logs)
    // For forensic integrity, we keep 'CREATE' actions for base data but wipe everything else
    await queryRunner.query("DELETE FROM audit_logs WHERE actionType != 'CREATE'");
    console.log(' - Sanitized audit_logs (kept initial CREATE records)');

    // 3. Transactions (Order Items first)
    await queryRunner.query('DELETE FROM order_items');
    await queryRunner.query('DELETE FROM orders');
    console.log(' - Wiped orders and order_items');

    // 4. Master Data (Wipe to prepare for Premium Seed)
    await queryRunner.query('DELETE FROM products');
    await queryRunner.query('DELETE FROM categories');
    await queryRunner.query('DELETE FROM banners');
    // Wipe all users EXCEPT the primary admin (ID = 1) if exists
    await queryRunner.query('DELETE FROM users WHERE id > 1');
    console.log(' - Reset Master Data (keeping primary admin if present)');

    await queryRunner.commitTransaction();
    console.log('✅ [SUCCESS] Database sanitized and ready for seeding.');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('❌ [FAILURE] Cleanup failed, transactional rollback executed:', err.message);
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

cleanup().catch((err) => {
  console.error('🔥 Fatal error in cleanup script:', err);
  process.exit(1);
});
