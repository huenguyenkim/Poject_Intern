const API_URL = 'http://localhost:3000';

async function runAdminTests() {
  console.log('🚀 Bắt đầu kịch bản API Test luồng Admin (CRUD)...\n');
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
    // ----------------------------------------------------
    // LUỒNG 1: CATEGORY CRUD (DANH MỤC)
    // ----------------------------------------------------
    console.log('--- 1. Kiểm thử CRUD Danh mục (Category) ---');
    
    // CREATE
    const createCatReq = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryName: 'TEST_CATEGORY', description: 'Test Cat' })
    });
    assert(createCatReq.status === 201, `POST /categories trả về HTTP Status ${createCatReq.status} (Created)`);
    const createdCat = await createCatReq.json();
    assert(createdCat.id != null, 'Dữ liệu trả về (State ngầm cập nhật) phải chứa ID mới tạo.');
    
    // UPDATE
    const catId = createdCat.id;
    const updateCatReq = await fetch(`${API_URL}/categories/${catId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryName: 'TEST_CATEGORY_UPDATED' })
    });
    assert(updateCatReq.status === 200, `PUT /categories/${catId} trả về HTTP Status ${updateCatReq.status} (OK)`);
    const updatedCat = await updateCatReq.json();
    assert(updatedCat.categoryName === 'TEST_CATEGORY_UPDATED', 'Tên danh mục sau khi sửa trên Endpoint đã được lưu chính xác (State Debugging).');

    // ----------------------------------------------------
    // LUỒNG 2: PRODUCT CRUD (SẢN PHẨM)
    // ----------------------------------------------------
    console.log('--- 2. Kiểm thử CRUD Sản phẩm (Product) ---');
    
    // CREATE
    const createProdReq = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName: 'TEST_PRODUCT', price: 15.5, categoryId: catId })
    });
    assert(createProdReq.status === 201, `POST /products trả về HTTP Status ${createProdReq.status} (Created)`);
    const createdProd = await createProdReq.json();
    assert(createdProd.id != null, 'Sản phẩm mới trả về ID.');
    
    // UPDATE
    const prodId = createdProd.id;
    const updateProdReq = await fetch(`${API_URL}/products/${prodId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName: 'TEST_EDIT', price: 9.99 })
    });
    const updatedProd = await updateProdReq.json();
    // Validate value persistence (JS floats!)
    assert(updatedProd.price === "9.99" || Number(updatedProd.price) === 9.99, 'Endpoint đã cập nhật giá sản phẩm thành công.');
    
    // DELETE PRODUCT
    const delProdReq = await fetch(`${API_URL}/products/${prodId}`, { method: 'DELETE' });
    assert(delProdReq.status === 204, `DELETE /products/${prodId} trả về HTTP Status 204 (No Content).`);
    
    // NOW WE CAN DELETE CATEGORY (Avoiding Foreign Key Violation)
    const delCatReq = await fetch(`${API_URL}/categories/${catId}`, { method: 'DELETE' });
    assert(delCatReq.status === 204, `DELETE /categories/${catId} trả về HTTP Status 204 (No Content).`);
    // Edge case test after deletion: Fetching should fail
    const edgeCaseCat = await fetch(`${API_URL}/categories/${catId}`);
    assert(edgeCaseCat.status === 404, 'Edge Case: Lấy danh mục vừa xoá sinh ra lỗi 404 chuẩn xác (NotFound).');
    console.log();

    // ----------------------------------------------------
    // LUỒNG 3: BANNER CRUD
    // ----------------------------------------------------
    console.log('--- 3. Kiểm thử CRUD Banner Quảng cáo ---');
    const createBanner = await fetch(`${API_URL}/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'SPRING_SALE', isActive: false, imageUrl: '/foo.png' })
    });
    assert(createBanner.status === 201, `POST /banners trả về HTTP Status ${createBanner.status}`);
    const bannerData = await createBanner.json();
    const bannerId = bannerData.id;

    // UPDATE Status
    const updateBanner = await fetch(`${API_URL}/banners/${bannerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: true })
    });
    const updatedBannerData = await updateBanner.json();
    assert(updatedBannerData.isActive === true, 'Kiểm thử dữ liệu ngầm (State): Cập nhật trạng thái Banner sang ACTIVE chuẩn xác.');

    // DELETE
    const delBanner = await fetch(`${API_URL}/banners/${bannerId}`, { method: 'DELETE' });
    assert(delBanner.status === 204, 'DELETE /banners thành công (204).');

  } catch (error) {
    console.error('CRITICAL ERROR:', error.message);
  }

  console.log('\n--------------------------------------');
  console.log(`📊 Kết quả: ${passed} PASS, ${failed} FAIL`);
}

runAdminTests();
