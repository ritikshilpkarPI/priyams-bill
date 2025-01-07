self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(self.clients.claim());
});
self.addEventListener('push', (event) => {
  const notificationData = event.data ? event.data.text() : 'New message!';

  const options = {
    body: notificationData,
  };
  event.waitUntil(
    self.registration.showNotification('New Notification', options)
  );
  event.waitUntil(
    (async function retryClients() {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      for (let i = 0; i < 5; i++) {
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        if (clients.length > 0) {
          clients.forEach((client) => {
            client.postMessage({
              type: 'NOTIFY_REACT',
              payload: { message: notificationData },
            });
          });
          return; 
        }
        await delay(1000); 
      }
      console.log('No clients found after retries.');
    })()
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'ACTION_TYPE') {
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'NOTIFY_REACT',
            payload: { message: 'Hello from Service Worker!' },
          });
        });
      });
  }
});
