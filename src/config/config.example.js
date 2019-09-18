import * as firebase from "firebase";

const config = {
  apiKey: "<your-api-key>",
  authDomain: "<your-auth-domain>",
  databaseURL: "<your-database-url>",
  projectId: "<your-project-id>",
  storageBucket: "<your-storage-bucket-url>",
  messagingSenderId: "<your-messaging-sender-id>",
  appId: "<your-app-id>"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const auth = firebase.auth();
export const f = firebase;
// Get a reference to the storage service, which is used to create references in your storage bucket
export const storage = firebase.storage();
// Create a storage reference from our storage service
export const storageRef = storage.ref();
export const database = firebase.firestore();
