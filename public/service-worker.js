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
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        if (clients.length === 0) {
          console.log(' No clients to send message to.');
          return;
        }
        clients.forEach((client) => {
          client.postMessage({
            type: 'NOTIFY_REACT',
            payload: { message: notificationData },
          });
        });
      })
      .catch((error) => console.error(' Error matching clients:', error))
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
