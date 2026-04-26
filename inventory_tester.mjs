const API_URL = 'http://localhost:3000';

async function runInventorySecurityTests() {
  console.log('🚀 Bắt đầu kịch bản API Test: Tồn kho (Inventory) & Bảo mật (Security)...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. CHUẨN BỊ USER (Admin & Customer)
    console.log('--- 1. Đăng nhập hệ thống ---');
    
    const adminLogin = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@candy.com', password: 'admin123' })
    });
    const adminData = await adminLogin.json();
    const adminToken = adminData.accessToken;

    const customerEmail = `user_test_${Date.now()}@sweet.com`;
    await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User Test', email: customerEmail, password: 'password123' })
    });
    const customerLogin = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: customerEmail, password: 'password123' })
    });
    const customerData = await customerLogin.json();
    const customerToken = customerData.accessToken;
    const customerId = customerData.user.id;

    // 2. KIỂM TRA TỒN KHO TRƯỚC (Deduction)
    console.log('\n--- 2. Kiểm thử TRỪ KHO (Inventory Deduction) ---');
    const prodRes = await fetch(`${API_URL}/products`);
    const products = await prodRes.json();
    const target = products[0];
    const initialStock = target.stock;
    console.log(`📦 Sản phẩm: ${target.productName} | Tồn kho ban đầu: ${initialStock}`);

    // Đặt hàng 5 cái
    const orderRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        userId: customerId,
        receiverName: 'Test Deduction',
        phone: '123',
        address: 'Test Addr',
        cartItems: [{ productId: target.id, quantity: 5 }]
      })
    });
    assert(orderRes.ok, 'Đặt hàng thành công.');
    const orderData = await orderRes.json();

    const afterProdRes = await fetch(`${API_URL}/products`);
    const afterProducts = await afterProdRes.json();
    const afterTarget = afterProducts.find(p => p.id === target.id);
    assert(afterTarget.stock === initialStock - 5, `Tồn kho đã bị trừ 5 (Còn ${afterTarget.stock}).`);

    // 3. KIỂM TRA HOÀN KHO (Refund on Cancel)
    console.log('\n--- 3. Kiểm thử HOÀN KHO (Inventory Refund - Canceled) ---');
    const cancelRes = await fetch(`${API_URL}/orders/${orderData.id}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'cancelled' })
    });
    assert(cancelRes.ok, 'Admin hủy đơn hàng thành công.');

    const finalProdRes = await fetch(`${API_URL}/products`);
    const finalProducts = await finalProdRes.json();
    const finalTarget = finalProducts.find(p => p.id === target.id);
    assert(finalTarget.stock === initialStock, `Tồn kho đã được HOÀN LẠI đủ ${initialStock} sau khi hủy đơn.`);

    // 4. KIỂM TRA BẢO MẬT (Security Guard)
    console.log('\n--- 4. Kiểm thử BẢO MẬT (Security Guard) ---');
    // Customer cố tình đổi trạng thái đơn
    const hackRes = await fetch(`${API_URL}/orders/${orderData.id}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({ status: 'confirmed' })
    });
    assert(hackRes.status === 403, 'Security: Customer bị chặn (403 Forbidden) khi cố tình gọi API của Admin.');

  } catch (error) {
    console.error('CRITICAL ERROR:', error.message);
  }

  console.log('\n--------------------------------------');
  console.log(`📊 Kết quả: ${passed} PASS, ${failed} FAIL`);
}

runInventorySecurityTests();
