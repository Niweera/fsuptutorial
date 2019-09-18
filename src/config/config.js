import * as firebase from "firebase";

//for this tutorial I have exposed the config object, but for a real production environment, never expose the folowing keys in public repos.

const config = {
  apiKey: "AIzaSyDu2NqtN1oHVFz-ncuifR6CZVtZeCMWGM0",
  authDomain: "fsuptutorial.firebaseapp.com",
  databaseURL: "https://fsuptutorial.firebaseio.com",
  projectId: "fsuptutorial",
  storageBucket: "fsuptutorial.appspot.com",
  messagingSenderId: "178410331690",
  appId: "1:178410331690:web:992bdd008f3f2a59306d53"
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
