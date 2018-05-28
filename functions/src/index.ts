import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp(functions.config().firebase);

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const ALGOLIA_INDEX_NAME = 'ads';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

exports.onAdCreated = functions.firestore
  .document('ads/{adId}')
  .onCreate((snap, context) => {
    const ad = snap.data();

    // ad.objectID = context.params.adId;

    // const index = client.initIndex(ALGOLIA_INDEX_NAME);
    // index.saveObject(ad);

    //Setting up message
    const message: admin.messaging.Message = {
      notification: {
        title: `Nouvelle annonce - ${ad.title}`,
        body: ad.body
      },
      android: {
        ttl: 3600 * 4 * 1000,
        priority: 'normal',
        notification: {
          sound: 'default',
          icon:
            'https://firebasestorage.googleapis.com/v0/b/fir-crud-422c3.appspot.com/o/private_app_files%2Ficon.png?alt=media&token=3a09ec10-91f1-4124-8477-049788173ba3',
          clickAction: 'FCM_PLUGIN_ACTIVITY'
        }
      },
      topic: ad.category
    };

    //Sending messge
    admin
      .messaging()
      .send(message)
      .then(res => {
        console.log('Message successfully sent', res);
      })
      .catch(err => console.log(err));
  });
