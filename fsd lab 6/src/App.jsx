import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [permission, setPermission] = useState(Notification.permission);
  const [product, setProduct] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Check permission status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPermission(Notification.permission);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Capture the install prompt event
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // Prevent automatic prompt
      setDeferredPrompt(e); // Save the event to trigger later
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Handle "Install App" button click
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the browser's install prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User installed the PWA');
      }
      setDeferredPrompt(null); // Can only use the prompt once
    }
  };

  // Request push notification permission
  const requestNotificationPermission = async () => {
    console.log('📱 Requesting notification permission...');
    
    if (!('Notification' in window)) {
      alert('❌ This browser does not support notifications.');
      return;
    }

    if (Notification.permission === 'granted') {
      console.log('✅ Notifications already enabled');
      alert('✅ Notifications are already enabled!');
      return;
    }

    try {
      const status = await Notification.requestPermission();
      console.log('📱 Permission result:', status);
      setPermission(status);

      if (status === 'granted') {
        alert('✅ Notifications enabled! Click "🎉 Trigger Sale Alert" to test.');
        // Test notification
        new Notification('🎉 Notifications Enabled!', {
          body: 'You\'re all set to receive sale alerts!',
          icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163337.png',
        });
      } else if (status === 'denied') {
        alert('❌ Notifications blocked. Please enable in browser settings.');
      }
    } catch (err) {
      console.error('❌ Error requesting permission:', err);
      alert('Error: ' + err.message);
    }
  };

  // Trigger a "Sale starts now" notification
  const triggerSaleNotification = async () => {
    console.log('🔔 Trigger clicked, current permission:', Notification.permission);
    
    if (Notification.permission !== 'granted') {
      console.log('❌ Permission not granted');
      alert('Please enable notifications first. Then try clicking the button again.');
      return;
    }

    try {
      // Create a simple notification for Mac
      const notification = new Notification('🎉 Sale Starts Now!', {
        body: 'Don\'t miss out! Huge discounts just went live!',
        icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163337.png',
        tag: 'sale-notification',
      });

      console.log('✅ Mac notification created successfully');

      // Handle notification click
      notification.onclick = function() {
        window.focus();
        notification.close();
      };

      // Auto-close after 5 seconds (Mac notifications stay until clicked by default)
      setTimeout(() => {
        notification.close();
      }, 5000);

    } catch (err) {
      console.error('❌ Error creating notification:', err);
      alert('Error: ' + err.message);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'sans-serif',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <h1>🛍️ PWA Deal Alerts</h1>

      {/* --- INSTALL APP PROMPT --- */}
      {deferredPrompt && (
        <div
          style={{
            padding: '15px',
            background: '#e0f7fa',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <p>Get the best experience by installing our app!</p>
          <button
            onClick={handleInstallClick}
            style={{
              padding: '10px',
              background: '#00838f',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Install App
          </button>
        </div>
      )}

      {/* --- PUSH NOTIFICATION PERMISSION --- */}
      <div
        style={{
          padding: '15px',
          background: '#f4f4f4',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <p>
          <strong>🔔 Notification Status:</strong> {permission === 'granted' ? '✅ ' : '❌ '}{permission}
        </p>

        {permission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            style={{
              padding: '10px 15px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            📱 Enable Notifications
          </button>
        )}
      </div>

      {/* --- NOTIFICATION TEST SECTION --- */}
      {permission === 'granted' && (
        <div
          style={{
            padding: '15px',
            background: '#e3f2fd',
            borderRadius: '8px',
            border: '2px solid #1976d2',
          }}
        >
          <p><strong>✅ Notifications Enabled!</strong></p>
          <p style={{fontSize: '14px', marginBottom: '10px'}}>Click the button below to send a test Mac notification:</p>
          <button
            onClick={triggerSaleNotification}
            style={{
              padding: '12px 20px',
              background: '#ff6f00',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            🎉 Send Test Notification
          </button>
          <p style={{fontSize: '12px', marginTop: '10px', color: '#666'}}>
            💡 Tip: Check your Mac notification center (top-right corner) for the alert
          </p>
        </div>
      )}
    </div>
  );
}

export default App;