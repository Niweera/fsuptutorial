import { combineReducers } from "redux";
import itemReducer from "./itemReducer";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

export default combineReducers({
  item: itemReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});
