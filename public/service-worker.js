self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
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

  self.clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'NOTIFY_REACT',
          payload: { message: notificationData },
        });
      });
    });
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
