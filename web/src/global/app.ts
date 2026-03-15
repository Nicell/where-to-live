const SERVICE_WORKER_CLEANUP_KEY = 'where-to-live-sw-cleanup-reloaded';

async function cleanupServiceWorkers() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  const unregistered = await Promise.all(
    registrations.map((registration) => registration.unregister())
  );

  if ('caches' in window) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map((key) => caches.delete(key)));
  }

  if (
    navigator.serviceWorker.controller &&
    unregistered.some(Boolean) &&
    !window.sessionStorage.getItem(SERVICE_WORKER_CLEANUP_KEY)
  ) {
    window.sessionStorage.setItem(SERVICE_WORKER_CLEANUP_KEY, 'true');
    window.location.reload();
  }
}

window.addEventListener('load', () => {
  cleanupServiceWorkers().catch((error) => {
    console.error('Failed to clean up service workers', error);
  });
});
