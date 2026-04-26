const API_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🚀 Bắt đầu chạy kịch bản API Test cho Storefront...\n');
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
    // 1. Kiểm tra API Categories (Danh mục)
    console.log('--- 1. Kiểm tra API Categories ---');
    const catRes = await fetch(`${API_URL}/categories`);
    assert(catRes.ok, `GET /categories trả về HTTP Status ${catRes.status}`);
    const categories = await catRes.json();
    assert(Array.isArray(categories), 'Dữ liệu trả về là Mảng (Array)');
    if (categories.length > 0) {
      assert(categories[0].hasOwnProperty('id') && categories[0].hasOwnProperty('name') || categories[0].hasOwnProperty('categoryName'), 'Danh mục có chứa properties hợp lệ (id, name)');
    } else {
      console.log('⚠️ INFO: Database Danh mục hiện đang trống (0 items).');
    }
    console.log();

    // 2. Kiểm tra API Products (Sản phẩm)
    console.log('--- 2. Kiểm tra API Products (Bình thường) ---');
    const prodRes = await fetch(`${API_URL}/products`);
    assert(prodRes.ok, `GET /products trả về HTTP Status ${prodRes.status}`);
    const products = await prodRes.json();
    assert(Array.isArray(products), 'Dữ liệu trả về là Mảng (Array)');
    if (products.length > 0) {
      assert(products[0].hasOwnProperty('id') && (products[0].hasOwnProperty('title') || products[0].hasOwnProperty('productName')), 'Sản phẩm có chứa properties hợp lệ (id, productName/title, price)');
      assert(typeof products[0].price === 'number' || !isNaN(Number(products[0].price)), 'Giá sản phẩm là một con số hợp lệ');
    } else {
      console.log('⚠️ INFO: Database Sản phẩm hiện đang trống (0 items).');
    }
    console.log();

    // 3. Kiểm tra API Banners (Banner Quảng cáo)
    console.log('--- 3. Kiểm tra API Banners ---');
    const banRes = await fetch(`${API_URL}/banners`);
    assert(banRes.ok, `GET /banners trả về HTTP Status ${banRes.status}`);
    const banners = await banRes.json();
    assert(Array.isArray(banners), 'Dữ liệu trả về là Mảng (Array)');
    if (banners.length > 0) {
      assert(banners[0].hasOwnProperty('id') && (banners[0].hasOwnProperty('imageUrl') || banners[0].hasOwnProperty('image')), 'Banner có chứa URL ảnh (imageUrl/image)');
    } else {
      console.log('⚠️ INFO: Database Banner hiện đang trống (0 items).');
    }
    console.log();

    // 4. Kiểm tra Edge Case (Sản phẩm không tồn tại)
    console.log('--- 4. Kiểm tra Edge Case (Sản phẩm không có thực - ID 99999) ---');
    const edgeProdRes = await fetch(`${API_URL}/products/99999`);
    assert(edgeProdRes.status === 404, `GET /products/99999 phải trả về HTTP Status 404 (Not Found). Hiện tại: ${edgeProdRes.status}`);
    const edgeData = await edgeProdRes.json();
    assert(edgeData.message && edgeData.message.toLowerCase().includes('not found') || edgeData.statusCode === 404, 'Thông báo lỗi trả về chính xác định dạng JSON cho front-end parse.');
    console.log();

  } catch (error) {
    console.error('CRITICAL ERROR: Không thể kết nối tới Backend API. Chi tiết:', error.message);
  }

  console.log('--------------------------------------');
  console.log(`📊 Kết quả: ${passed} PASS, ${failed} FAIL`);
}

runTests();
