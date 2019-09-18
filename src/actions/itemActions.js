import {
  UPLOADING_START,
  UPLOADING_SUCCESS,
  UPLOADING_FAIL,
  UPLOADING,
  GET_DATA
} from "./types";

import { storageRef } from "../config/config";

// Update the image
export const uploadImage = data => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  try {
    // Create the file metadata
    const metadata = {
      contentType: "image/jpeg"
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const uploadTask = storageRef
      .child("images/" + data.name)
      .put(data, metadata);

    dispatch({ type: UPLOADING_START });

    uploadTask.on(
      "state_changed",
      function(snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        dispatch({ type: UPLOADING, payload: Math.floor(progress) });
      },
      function(error) {
        // Handle unsuccessful uploads
        dispatch({ type: UPLOADING_FAIL, payload: error });
      },
      function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          dispatch({ type: UPLOADING_SUCCESS });
          firestore
            .collection("data")
            .doc("user")
            .update({
              image_url: downloadURL
            })
            .then(() => {
              //get the latest data
              //once the data is sent to the firestore the latest version is stored in the redux store
              get_Data(dispatch, getState, { getFirestore });
            })
            .catch(e => {
              console.log(e);
            });
        });
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const getData = () => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  try {
    const res = await firestore
      .collection("data")
      .doc("user")
      .get();

    const data = res.data().image_url ? res.data().image_url : "empty";
    if (data) {
      dispatch({ type: GET_DATA, payload: data });
    } else {
      dispatch({ type: GET_DATA, payload: null });
    }
  } catch (e) {
    console.log(e);
  }
};

const get_Data = async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  try {
    const res = await firestore
      .collection("data")
      .doc("user")
      .get();

    const data = res.data().image_url;

    if (data) {
      dispatch({ type: GET_DATA, payload: data });
    } else {
      dispatch({ type: GET_DATA, payload: null });
    }
  } catch (e) {
    console.log(e);
  }
};
