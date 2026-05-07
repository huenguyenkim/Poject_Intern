const axios = require('axios');

async function testAddBanner() {
  try {
    const response = await axios.post('http://localhost:4001/api/banners', {
      title: 'Script Test Banner',
      imagePcUrl: 'https://images.unsplash.com/photo-1582050041567-9cfdd330d545',
      linkUrl: '/shop',
      isActive: true,
      priority: 50,
      position: 'home'
    });
    console.log('Success:', response.data);
  } catch (err) {
    console.error('Error:', err.response?.status, err.response?.data || err.message);
  }
}

testAddBanner();
