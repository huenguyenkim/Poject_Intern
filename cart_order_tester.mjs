const API_URL = 'http://localhost:3000';

async function runCartOrderTests() {
  console.log('🚀 Bắt đầu kịch bản API Test luồng Giỏ hàng & Đơn hàng...\n');
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
    // 1. CHUẨN BỊ USER & SẢN PHẨM
    console.log('--- 1. Chuẩn bị dữ liệu ---');
    
    // Đăng nhập để lấy Token và UserId
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@candy.com', password: 'admin123' })
    });
    const { user, accessToken } = await loginRes.json();
    assert(loginRes.ok, `Đăng nhập thành công Admin (ID: ${user.id}).`);

    // Lấy một sản phẩm để giả lập giỏ hàng
    const prodRes = await fetch(`${API_URL}/products`);
    const products = await prodRes.json();
    if (products.length === 0) throw new Error('Không có sản phẩm trong DB để test!');
    
    const targetProduct = products[0];
    const unitPrice = parseFloat(targetProduct.price);
    console.log(`📦 Sản phẩm mẫu: ${targetProduct.productName} - Giá: $${unitPrice}`);

    // 2. TẠO ĐƠN HÀNG (SIMULATE CHECKOUT)
    console.log('\n--- 2. Kiểm thử TẠO ĐƠN HÀNG (Checkout) ---');
    const orderItems = [
      { productId: targetProduct.id, quantity: 2 }
    ];

    const createOrderRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        userId: user.id,
        receiverName: 'Nguyen Van Test',
        phone: '0987654321',
        address: '123 Candy Lane, Sweet City',
        cartItems: orderItems
      })
    });

    assert(createOrderRes.status === 201, `Tạo đơn hàng thành công (HTTP 201).`);
    const createdOrder = await createOrderRes.json();
    
    // Kiểm tra tính toán tiền (Base + 8% Tax + Shipping)
    // subtotal = 2 * unitPrice
    // tax = subtotal * 0.08
    // shipping = subtotal > 50 ? 0 : 5.99
    const subtotal = unitPrice * 2;
    const expectedTotal = Number((subtotal + (subtotal * 0.08) + (subtotal > 50 ? 0 : 5.99)).toFixed(2));
    
    assert(createdOrder.totalAmount === expectedTotal, `Tính toán tổng tiền chính xác ($${createdOrder.totalAmount} vs Expected $${expectedTotal}).`);
    assert(createdOrder.status === 'pending', 'Trạng thái mặc định của đơn hàng là "pending".');

    // 3. ADMIN LIST ORDERS
    console.log('\n--- 3. Kiểm thử ADMIN XEM DANH SÁCH ĐƠN ---');
    const listRes = await fetch(`${API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const orders = await listRes.json();
    assert(Array.isArray(orders), 'Admin lấy được danh sách đơn hàng (Array).');
    const myOrderInList = orders.find(o => o.id === createdOrder.id);
    assert(!!myOrderInList, 'Đơn hàng vừa tạo xuất hiện trong danh sách của Admin.');

    // 4. ADMIN CẬP NHẬT TRẠNG THÁI
    console.log('\n--- 4. Kiểm thử CẬP NHẬT TRẠNG THÁI (Status Transitions) ---');
    const updateRes = await fetch(`${API_URL}/orders/${createdOrder.id}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ status: 'confirmed' })
    });
    
    assert(updateRes.ok, 'Cập nhật trạng thái sang "confirmed" thành công.');
    const updatedOrder = await updateRes.json();
    assert(updatedOrder.status === 'confirmed', 'Dữ liệu State ngầm đã được cập nhật chính xác sang "confirmed".');

    // 5. EDGE CASE: ORDER KHÔNG TỒN TẠI
    console.log('\n--- 5. Kiểm thử EDGE CASE ---');
    const failUpdate = await fetch(`${API_URL}/orders/99999/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ status: 'completed' })
    });
    assert(failUpdate.status === 404, 'Cập nhật đơn hàng ảo ID:99999 trả về 404 chuẩn xác.');

  } catch (error) {
    console.error('CRITICAL ERROR:', error.message);
  }

  console.log('\n--------------------------------------');
  console.log(`📊 Kết quả: ${passed} PASS, ${failed} FAIL`);
}

runCartOrderTests();
