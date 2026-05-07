const axios = require('axios');

async function update() {
  try {
    const res = await axios.get('http://localhost:4001/api/banners');
    const banners = res.data;
    const springBanner = banners.find(b => b.title && b.title.includes('SPRING'));
    
    if (springBanner) {
      console.log('Found banner:', springBanner.id);
      await axios.put(`http://localhost:4001/api/banners/${springBanner.id}`, {
        imagePcUrl: '/images/banners/spring-delights.png',
        imageMobileUrl: '/images/banners/spring-delights.png'
      });
      console.log('Update successful');
    } else {
      console.log('Banner not found, creating...');
      await axios.post('http://localhost:4001/api/banners', {
        title: 'SPRING DELIGHTS',
        imagePcUrl: '/images/banners/spring-delights.png',
        imageMobileUrl: '/images/banners/spring-delights.png',
        isActive: true,
        priority: 10,
        linkUrl: '/shop'
      });
      console.log('Create successful');
    }
  } catch (err) {
    console.error('Error:', err.message);
    if (err.response) console.error(err.response.data);
  }
}

update();
