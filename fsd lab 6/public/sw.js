// public/sw.js

// 1. Listen for background push events
self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Message Received.');

  // Default payload in case the server sends an empty ping
  let pushData = {
    title: '🎉 Sale Starts Now!',
    body: 'Don\'t miss out! Huge discounts just went live!',
    image: 'https://cdn-icons-png.flaticon.com/512/1163/1163337.png'
  };

  // 2. Extract the JSON payload sent from the server
  if (event.data) {
    try {
      pushData = event.data.json();
    } catch (e) {
      pushData.body = event.data.text();
    }
  }

  // 3. Configure how the system notification looks
  const options = {
    body: pushData.body,
    icon: pushData.image || 'https://cdn-icons-png.flaticon.com/512/1163/1163337.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/1163/1163337.png',
    tag: 'sale-alert', // Prevents duplicate notifications
    requireInteraction: true, // Keeps notification until user interacts
    data: {
      url: 'http://localhost:5173'
    }
  };

  console.log('[Service Worker] Showing notification:', pushData.title, options);

  // 4. Instruct the OS to show the notification as a system alert
  event.waitUntil(
    self.registration.showNotification(pushData.title, options)
      .then(() => console.log('[Service Worker] Notification shown successfully'))
      .catch(err => console.error('[Service Worker] Notification error:', err))
  );
});

// 5. Handle the user clicking the notification
self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification clicked');
  event.notification.close(); // Dismiss the alert

  // Open the app in a new browser tab
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// 6. Listen for messages from the app
self.addEventListener('message', function (event) {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, image } = event.data.data;
    
    const options = {
      body: body,
      icon: image || 'https://cdn-icons-png.flaticon.com/512/1163/1163337.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/1163/1163337.png',
      tag: 'sale-alert',
      requireInteraction: true,
      data: {
        url: 'http://localhost:5173'
      }
    };

    self.registration.showNotification(title, options)
      .then(() => console.log('[Service Worker] Notification shown from message'))
      .catch(err => console.error('[Service Worker] Notification error:', err));
  }
});