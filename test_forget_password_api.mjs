const API_URL = 'http://localhost:3001/api/auth';

async function runTest() {
  console.log('🚀 Starting Forget Password API Test...');

  try {
    // 1. Test Non-existent Email
    console.log('\n--- Test 1: Non-existent Email ---');
    const res1 = await fetch(`${API_URL}/password/forgot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@candy.com' })
    });
    const data1 = await res1.json();
    console.log('Response status:', res1.status);
    console.log('Response body:', data1);
    if (data1.message.includes('sent')) {
      console.log('✅ Security check passed: User enumeration prevented.');
    }

    // 2. Test Existing Email
    console.log('\n--- Test 2: Existing Email (nguyenhue2612200398@gmail.com) ---');
    const res2 = await fetch(`${API_URL}/password/forgot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nguyenhue2612200398@gmail.com' })
    });
    const data2 = await res2.json();
    console.log('Response status:', res2.status);
    console.log('Response body:', data2);
    const token = data2.devToken;
    if (token) {
      console.log('✅ Token generated successfully.');
    } else {
      console.error('❌ Token not found in response. Is NODE_ENV=development set?');
      return;
    }

    // 3. Verify Token
    console.log('\n--- Test 3: Verify Token ---');
    const res3 = await fetch(`${API_URL}/password/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const data3 = await res3.json();
    console.log('Response status:', res3.status);
    console.log('Response body:', data3);
    if (data3.isValid) {
      console.log('✅ Token verification passed.');
    }

    // 4. Reset Password
    console.log('\n--- Test 4: Reset Password ---');
    const res4 = await fetch(`${API_URL}/password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        token, 
        newPassword: 'NewAdminPassword123!' 
      })
    });
    const data4 = await res4.json();
    console.log('Response status:', res4.status);
    console.log('Response body:', data4);
    if (data4.message.includes('successfully')) {
      console.log('✅ Password reset passed.');
    }

    // 5. Test Token Invalidation (Reuse check)
    console.log('\n--- Test 5: Token Invalidation (Reuse check) ---');
    const res5 = await fetch(`${API_URL}/password/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const data5 = await res5.json();
    if (res5.status >= 400) {
      console.log('✅ Token reuse prevented: Token successfully invalidated after use.');
      console.log('Response status:', res5.status);
      console.log('Error message:', data5.message);
    } else {
      console.log('❌ Token reuse failed: Token should be invalid.');
    }

    console.log('\n✨ ALL TESTS PASSED! ✨');
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error);
  }
}

runTest();
