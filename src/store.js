import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { f } from "./config/config";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
import { reduxFirestore, getFirestore } from "redux-firestore";

// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
  attachAuthIsReady: true // attaches auth is ready promise to store
};

//this setting is used to avoid the error in non redux extension installed browsers

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    reactReduxFirebase(f, rrfConfig),
    reduxFirestore(f),
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore }))
  )
);

//this setting is used to avoid the error in non redux extension installed browsers

export default store;
