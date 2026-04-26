const API_URL = 'http://localhost:3000';

async function runAuthTests() {
  console.log('🚀 Bắt đầu kịch bản API Test luồng Xác thực (Auth)...\n');
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
    const randomEmail = `test_customer_${Date.now()}@sweet.com`;
    const password = 'Password@123';

    // ----------------------------------------------------
    // 1. REGISTER (ĐĂNG KÝ)
    // ----------------------------------------------------
    console.log('--- 1. Kiểm thử ĐĂNG KÝ (Register) ---');
    const registerReq = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Testing User', email: randomEmail, password })
    });
    assert(registerReq.status === 201, `POST /auth/register HTTP 201 (Created) cho email mới.`);
    const createdUser = await registerReq.json();
    assert(createdUser.id != null && createdUser.password !== password, 'User tạo ra có sinh ID và Mật khẩu trên DB đã được (Hashed) mã hoá an toàn.');
    assert(createdUser.role === 'customer', 'Tài khoản mốc được gán quyền "customer" (Kiểm tra Phân Quyền ngầm).');

    // Edge Case: Trùng Email
    const registerConflictReq = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Duplicate User', email: randomEmail, password: 'pw' })
    });
    assert(registerConflictReq.status === 409, 'Edge Case: Đăng ký trùng Email trả về chốt lỗi HTTP 409 (Conflict).');
    console.log();

    // ----------------------------------------------------
    // 2. LOGIN (ĐĂNG NHẬP) & JWT TOKEN
    // ----------------------------------------------------
    console.log('--- 2. Kiểm thử ĐĂNG NHẬP (Login & JWT) ---');
    const loginReq = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: randomEmail, password })
    });
    assert(loginReq.status === 200, `POST /auth/login trả về HTTP 200 (OK).`);
    const loginData = await loginReq.json();
    assert(loginData.accessToken != null, 'Dữ liệu trả về (State ngầm cập nhật) chứa JWT AccessToken.');
    
    // Edge Case: Sai Mật Khẩu
    const loginWrongReq = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: randomEmail, password: 'wrongPassword!' })
    });
    assert(loginWrongReq.status === 401, 'Edge Case: Đăng nhập sai mật khẩu chặn trả lỗi HTTP 401 (Unauthorized).');
    console.log();

    // ----------------------------------------------------
    // 3. JWT GUARDS & PHÂN QUYỀN TRUY CẬP (Thực thi Get Me)
    // ----------------------------------------------------
    console.log('--- 3. Kiểm thử Bảo Mật Route (JWT Guard) & Dữ liệu Phiên ---');
    
    // Yêu cầu hợp lệ
    const token = loginData.accessToken;
    const getMeReq = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });
    assert(getMeReq.status === 200, 'GET /auth/me thành công (200) với JWT Token hợp lệ đính kèm ở Header.');
    const myProfile = await getMeReq.json();
    assert(myProfile.email === randomEmail, 'Hệ thống tự nhận diện đúng Email (Xác thực chéo ID nằm trong Token).');

    // Edge Case: Gọi API yêu cầu JWT nhưng không truyền Token
    const getMeFailed = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' } // No token
    });
    assert(getMeFailed.status === 401, 'Edge Case: Tuyệt đối chặn request thiếu JWT Guard trả 401.');
    // Edge Case: Dùng Token Fake/Hỏng
    const getMeFakeToken = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.randomHackedToken.abc`
      } 
    });
    assert(getMeFakeToken.status === 401, 'Edge Case: JWT Guard bẻ khoá token Fake cực chặt (Báo 401).');
    console.log();

  } catch (error) {
    console.error('CRITICAL ERROR:', error.message);
  }

  console.log('--------------------------------------');
  console.log(`📊 Kết quả: ${passed} PASS, ${failed} FAIL`);
}

runAuthTests();
