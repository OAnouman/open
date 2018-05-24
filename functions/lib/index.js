"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const algoliasearch = require("algoliasearch");
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
    ad.objectID = context.params.adId;
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    index.saveObject(ad);
});
//# sourceMappingURL=index.js.map