const Subscription = require('../db-models/subscription-model');
const webpush = require('web-push');

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function sendPushNotification(payload) {
  try {
    const subscriptions = await Subscription.find();
    subscriptions;

    for (const subscription of subscriptions) {
      if (subscription && subscription.endpoint) {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
      } else {
        console.log(`Invalid subscription: ${JSON.stringify(subscription)}`);
      }
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

module.exports = { sendPushNotification };
