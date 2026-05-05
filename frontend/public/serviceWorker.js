import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Cấu hình định tuyến riêng cho Task API
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/tasks'),
  new NetworkFirst({
    cacheName: 'task-api-cache',
    networkTimeoutSeconds: 3, // [QUAN TRỌNG] Tự động fallback về Cache sau 3s
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // Giữ cache trong 24 giờ
      }),
    ],
  })
);