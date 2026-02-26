import localforage from 'localforage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {

};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const firebaseCloudMessaging = {

  tokenInLocalforage: async () => {
    return await localforage.getItem('fcm_token');
  },

  init: async function () {
    try {
      /*
      if ((await this.tokenInLocalforage()) !== null) {
        return false;
      }
      */

      const messaging = getMessaging(app);
      await Notification.requestPermission();
      getToken(messaging, {
        vapidKey: '',
      })
        .then((currentToken) => {
          if (currentToken) {
            localforage.setItem('fcm_token', currentToken);
          } else {
            console.log('Notification, No registration token available. Request permission to generate one. =====>')
          }
        })
        .catch((err) => {
          console.log('NotificationAn error occurred while retrieving token. =====>', err)
        });
    } catch (error) {
      console.error(error);
    }
  },
};

export { firebaseCloudMessaging };
