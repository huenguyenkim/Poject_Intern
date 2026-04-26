import https from 'https';
https.get({
  hostname: 'www.pexels.com',
  path: '/search/jelly%20beans/',
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const urls = data.match(/images\.pexels\.com\/photos\/\d+\/[a-zA-Z0-9-]+\.(jpe?g|png)/g);
    console.log("Pexels Jelly Beans:", Array.from(new Set(urls || [])).slice(0, 5));
  });
});
