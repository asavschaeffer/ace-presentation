/**
 * Service Worker for ACE Presentation
 * Implements offline-first caching strategy
 */

const CACHE_NAME = 'ace-presentation-v1.0';
const CACHE_VERSION = '1.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/js/main.js',
  '/js/data-manager.js',
  '/js/three-scene.js',
  '/js/modal-system.js',
  '/js/pdf-export.js',
  '/js/demo-mode.js',
  '/data/presentation-data.json'
];

// External libraries to cache
const EXTERNAL_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/interact.js/1.10.11/interact.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

/**
 * Service Worker Install Event
 */
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        // Cache static assets
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Cache external assets
        return caches.open(CACHE_NAME)
          .then((cache) => {
            console.log('Service Worker: Caching external assets');
            return Promise.all(
              EXTERNAL_ASSETS.map((url) => {
                return fetch(url)
                  .then((response) => {
                    if (response.ok) {
                      return cache.put(url, response);
                    }
                  })
                  .catch((error) => {
                    console.warn(`Failed to cache external asset: ${url}`, error);
                  });
              })
            );
          });
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

/**
 * Service Worker Activate Event
 */
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        // Take control of all pages immediately
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('Service Worker: Activation failed', error);
      })
  );
});

/**
 * Service Worker Fetch Event
 * Implements cache-first strategy for assets, network-first for API calls
 */
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (isStaticAsset(request.url)) {
    // Cache-first strategy for static assets
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request.url)) {
    // Network-first strategy for API requests
    event.respondWith(networkFirst(request));
  } else if (isExternalAsset(request.url)) {
    // Cache-first strategy for external assets
    event.respondWith(cacheFirst(request));
  } else {
    // Default to network-first for other requests
    event.respondWith(networkFirst(request));
  }
});

/**
 * Cache-first strategy
 * Try cache first, fall back to network
 */
async function cacheFirst(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Service Worker: Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      console.log('Service Worker: Cached from network:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Cache-first failed:', error);
    
    // Try to serve a fallback for HTML requests
    if (request.destination === 'document') {
      const cache = await caches.open(CACHE_NAME);
      return cache.match('/index.html');
    }
    
    throw error;
  }
}

/**
 * Network-first strategy
 * Try network first, fall back to cache
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      console.log('Service Worker: Network response cached:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache:', request.url);
    
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Service Worker: Serving from cache (network failed):', request.url);
      return cachedResponse;
    }
    
    // No cache available, throw error
    throw error;
  }
}

/**
 * Check if URL is a static asset
 */
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.endsWith(asset)) ||
         url.includes('/styles/') ||
         url.includes('/js/') ||
         url.includes('/images/') ||
         url.includes('/assets/');
}

/**
 * Check if URL is an API request
 */
function isAPIRequest(url) {
  return url.includes('/api/') ||
         url.includes('/data/') ||
         url.endsWith('.json');
}

/**
 * Check if URL is an external asset
 */
function isExternalAsset(url) {
  return EXTERNAL_ASSETS.some(asset => url.includes(asset)) ||
         url.includes('cdnjs.cloudflare.com') ||
         url.includes('cdn.jsdelivr.net') ||
         url.includes('unpkg.com');
}

/**
 * Handle background sync for offline actions
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(handleBackgroundSync());
  }
});

/**
 * Handle background sync
 */
async function handleBackgroundSync() {
  try {
    // Check for any pending offline actions
    const pendingActions = await getStoredActions();
    
    if (pendingActions.length > 0) {
      console.log('Service Worker: Processing pending actions:', pendingActions.length);
      
      for (const action of pendingActions) {
        await processAction(action);
      }
      
      // Clear processed actions
      await clearStoredActions();
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}

/**
 * Get stored offline actions
 */
async function getStoredActions() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match('/offline-actions');
    
    if (response) {
      return await response.json();
    }
    
    return [];
  } catch (error) {
    console.error('Service Worker: Failed to get stored actions:', error);
    return [];
  }
}

/**
 * Process an offline action
 */
async function processAction(action) {
  try {
    switch (action.type) {
      case 'feedback':
        await submitFeedback(action.data);
        break;
      case 'analytics':
        await sendAnalytics(action.data);
        break;
      default:
        console.warn('Service Worker: Unknown action type:', action.type);
    }
  } catch (error) {
    console.error('Service Worker: Failed to process action:', error);
  }
}

/**
 * Submit feedback when online
 */
async function submitFeedback(feedbackData) {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(feedbackData)
    });
    
    if (response.ok) {
      console.log('Service Worker: Feedback submitted successfully');
    }
  } catch (error) {
    console.error('Service Worker: Failed to submit feedback:', error);
  }
}

/**
 * Send analytics when online
 */
async function sendAnalytics(analyticsData) {
  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(analyticsData)
    });
    
    if (response.ok) {
      console.log('Service Worker: Analytics sent successfully');
    }
  } catch (error) {
    console.error('Service Worker: Failed to send analytics:', error);
  }
}

/**
 * Clear stored actions
 */
async function clearStoredActions() {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.delete('/offline-actions');
  } catch (error) {
    console.error('Service Worker: Failed to clear stored actions:', error);
  }
}

/**
 * Handle push notifications (if needed in future)
 */
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push message received');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/images/icon-192x192.png',
      badge: '/images/badge-72x72.png',
      tag: 'ace-presentation',
      renotify: true,
      actions: [
        {
          action: 'view',
          title: 'View Presentation'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

/**
 * Handle messages from the main thread
 */
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

/**
 * Log service worker errors
 */
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error occurred:', event.error);
});

/**
 * Log unhandled promise rejections
 */
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled promise rejection:', event.reason);
});

console.log('Service Worker: Script loaded');