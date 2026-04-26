const API_URL = 'http://localhost:3000';

async function verifyJwtPayload() {
  console.log('🔍 Kiểm tra cấu trúc Token JWT...\n');
  
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@candy.com', password: 'admin123' })
  });
  const { accessToken } = await loginRes.json();
  
  if (!accessToken) {
    console.error('❌ Không lấy được Token.');
    return;
  }

  // Decode JWT Payload (phần thứ 2)
  const base64Payload = accessToken.split('.')[1];
  const decodedPayload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());

  console.log('🔹 Decoded JWT Payload:', decodedPayload);

  const hasSub = 'sub' in decodedPayload;
  const hasRole = 'role' in decodedPayload;
  const noEmail = !('email' in decodedPayload);

  if (hasSub && hasRole && noEmail) {
    console.log('✅ PASS: Token chỉ chứa ID (sub) và Role. Email đã được loại bỏ.');
  } else {
    console.error('❌ FAIL: Cấu trúc Token chưa đúng yêu cầu.');
  }
}

verifyJwtPayload();
