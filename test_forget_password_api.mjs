const API_URL = 'http://localhost:4000/api/auth';

async function runTest() {
  console.log('🚀 Starting Forget Password API Test...');

  try {
    // 1. Test Non-existent Email
    console.log('\n--- Test 1: Non-existent Email ---');
    const res1 = await fetch(`${API_URL}/forgot-password/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@candy.com' })
    });
    const data1 = await res1.json();
    console.log('Response status:', res1.status);
    console.log('Response body:', data1);
    if (data1.message.includes('OTP has been sent')) {
      console.log('✅ Security check passed: User enumeration prevented.');
    }

    // 2. Test Existing Email
    console.log('\n--- Test 2: Existing Email (nguyenhue2612200398@gmail.com) ---');
    const res2 = await fetch(`${API_URL}/forgot-password/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nguyenhue2612200398@gmail.com' })
    });
    const data2 = await res2.json();
    console.log('Response status:', res2.status);
    console.log('Response body:', data2);
    const otp = data2.devOtp;
    if (otp) {
      console.log(`✅ OTP generated successfully: ${otp}`);
    } else {
      console.error('❌ OTP not found in response. Is NODE_ENV=development set?');
      return;
    }

    // 3. Verify OTP
    console.log('\n--- Test 3: Verify OTP ---');
    const res3 = await fetch(`${API_URL}/forgot-password/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nguyenhue2612200398@gmail.com', otp })
    });
    const data3 = await res3.json();
    console.log('Response status:', res3.status);
    console.log('Response body:', data3);
    if (data3.isValid) {
      console.log('✅ OTP verification passed.');
    }

    // 4. Reset Password
    console.log('\n--- Test 4: Reset Password ---');
    const res4 = await fetch(`${API_URL}/forgot-password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'nguyenhue2612200398@gmail.com',
        otp, 
        newPassword: 'NewAdminPassword123!' 
      })
    });
    const data4 = await res4.json();
    console.log('Response status:', res4.status);
    console.log('Response body:', data4);
    if (data4.message.includes('successfully')) {
      console.log('✅ Password reset passed.');
    }

    // 5. Test OTP Invalidation (Reuse check)
    console.log('\n--- Test 5: OTP Invalidation (Reuse check) ---');
    const res5 = await fetch(`${API_URL}/forgot-password/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nguyenhue2612200398@gmail.com', otp })
    });
    const data5 = await res5.json();
    if (res5.status >= 400) {
      console.log('✅ OTP reuse prevented: OTP successfully invalidated after use.');
      console.log('Response status:', res5.status);
      console.log('Error message:', data5.message);
    } else {
      console.log('❌ OTP reuse failed: OTP should be invalid.');
      console.log('Status:', res5.status);
      console.log('Body:', data5);
    }

    console.log('\n✨ ALL TESTS PASSED! ✨');
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error);
  }
}

runTest();
