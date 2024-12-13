import { API_METHODS } from "./constants/apiMethods";
import { API_PATHS } from "./constants/apiPaths";
import { genericAxios } from "./genericAxiosMethod";

async function saveSubscriptionToBackend(subscription) {
  await genericAxios({
    url:API_PATHS.SUBSCRIPTION,
    data: subscription,
    method: API_METHODS.POST,
     headers: { 'Content-Type': 'application/json' },
  })
}
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }
  
export const subscribeToPushNotification = async () => {
  if (!('serviceWorker' in navigator && 'PushManager' in window)) {
    console.log('Push notifications are not supported in this browser.');
    return;
  }
 
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service Worker registered successfully:', registration);

    const applicationServerKey = urlBase64ToUint8Array(
        process.env.REACT_APP_CLIENT_VAPID_PUBLIC_KEY
    );

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log('No existing subscription found. Creating a new subscription...');
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
    }
   
    // Save the subscription to the backend
     await saveSubscriptionToBackend(subscription);
    console.log('Subscription saved to backend successfully.');
  } catch (error) {
    console.error('Error during push notification subscription:', error);
  }
};
