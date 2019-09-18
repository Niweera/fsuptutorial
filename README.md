# FSUPTUTORIAL

> Upload images to the Google Cloud Storage with ReactJS, Firebase SDK and Firestore

To view the application we are going to build beforehand, if you are familiar with `Heroku` just click the `Heroku Button`.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Prerequisites

    1. Create a Firebase project [Firebase Console](https://console.firebase.google.com) => Click + Add Project => Follow along...

    2. Create a Storage Bucket and allow appropriate rules. [docs](https://firebase.google.com/docs/storage/web/start)

    3. Create a ReactJS application and register the app in Firebase Console. [docs](https://firebase.google.com/docs/web/setup)

Lets move on to the real deal...

## Create Firebase Config object.

Create a folder inside /src/ as config => `/src/config`

Add the following lines to config.js inside config folder.

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

To get the `config` object => Go to Settings of Firebase project and look for `Your apps` section.

Now that you have created the Firebase config object let's move on to the ReactJS development.

For demonstration purposes, I'll use a single page with a header and a fixed footer and inside the page an image placeholder and file upload button.

For my ease, I'll be using [Bootstrap](https://getbootstrap.com/)

Now let's move onto creating the basic components for our App.

Create HOC folder on /src/

Now create `/src/HOC/Header.js` and `/src/HOC/Footer.js`

Now set up the Redux `store`

`/src/store.js`

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

Now create `rootReducer` file

`/src/reducers/index.js`

    import { combineReducers } from "redux";
    import itemReducer from "./itemReducer";
    import { firebaseReducer } from "react-redux-firebase";
    import { firestoreReducer } from "redux-firestore";

    export default combineReducers({
    item: itemReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
    });

    Now create the `reducer` file

    For my application I have used the `itemReducer.js`

    `/src/reducers/itemReducer.js`

    import {
    UPLOADING_START,
    UPLOADING_SUCCESS,
    UPLOADING_FAIL,
    UPLOADING,
    GET_DATA
    } from "../actions/types";

    const initialState = {
    error: null,
    percent: null,
    showProgress: false,
    image: null
    };

    export default function(state = initialState, action) {
    switch (action.type) {
        case UPLOADING_START:
        return {
            ...state,
            percent: 0,
            showProgress: true
        };
        case UPLOADING_SUCCESS:
        return {
            ...state,
            error: false,
            percent: null,
            showProgress: false
        };
        case UPLOADING_FAIL:
        return {
            ...state,
            error: action.payload,
            showProgress: false
        };
        case UPLOADING:
        return {
            ...state,
            percent: action.payload,
            showProgress: true
        };

        case GET_DATA:
        return {
            ...state,
            image: action.payload
        };
        default:
        return state;
    }
    }

Now we are done with the reducer stuff;

Now create the actions for reducer actions.

First we have to declare the action types.

`/src/actions/types.js`

    export const UPLOADING_START = "UPLOADING_START";
    export const UPLOADING_SUCCESS = "UPLOADING_SUCCESS";
    export const UPLOADING_FAIL = "UPLOADING_FAIL";
    export const UPLOADING = "UPLOADING";

    export const GET_DATA = "GET_DATA";

Now the `itemActions.js`

`/src/actions/itemActions.js`

    //import action types
    import {
    UPLOADING_START,
    UPLOADING_SUCCESS,
    UPLOADING_FAIL,
    UPLOADING,
    GET_DATA
    } from "./types";

    //import the Google Cloud Storage reference object
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

Now we are done with the reducer actions stuff.

At this point you can see the Redux Store if you have installed the Redux Dev Tools.

![image](/img/1.jpg)

Now let's set up `App.js` and without this you won't be able to render anything.

`/src/App.js`

    import React from "react";
    import "./App.css";
    import MainComponent from "./HOC/MainComponent";
    import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
    import { Provider } from "react-redux";
    import Header from "./HOC/Header";
    import Footer from "./HOC/Footer";

    import store from "./store";

    function App() {
    return (
        <Provider store={store}>
        <Router>
            <div className="App">
            <Header />
            <div className="container">
                <Switch>
                <Route exact path="/" component={MainComponent} />
                </Switch>
            </div>
            <Footer />
            </div>
        </Router>
        </Provider>
    );
    }

    export default App;

Now let's move on to the most important part.

Now create `/src/HOC/MainComponent.js` this MainComponent.js will contain the image upload button and other related components.

    import React, { Component } from "react";
    import { uploadImage, getData } from "../actions/itemActions";
    import Spinner from "../helpers/Spinner";
    import { connect } from "react-redux";
    import { withRouter } from "react-router-dom";

    class MainComponent extends Component {
    constructor() {
        super();
        this.state = {
        error: null,
        percent: 0,
        showProgress: null,
        image: null
        };
    }

    componentDidMount() {
        this.props.getData();
    }

    //create ref
    fileInputRef = React.createRef();

    onFormSubmit = e => {
        e.preventDefault(); // Stop form submit

        //validating the file
        //check if the file is exists
        if (this.state.file === null) {
        alert("No image is selected!");
        return;
        }

        //check if the image size is larger than 1MB
        if (this.state.file.size > 1048576) {
        alert("Image size must be less than 1MB!");
        return;
        }

        //check if the dimension of the image is 2048 x 2048 px
        if (this.state.file.width > 2048 || this.state.file.height > 2048) {
        alert("Image dimensions must be 2048 x 2048 px");
        return;
        }

        //check if the file is an image
        if (
        this.state.file.type === "image/jpeg" ||
        this.state.file.type === "image/png" ||
        this.state.file.type === "image/jpg"
        ) {
        this.props.uploadImage(this.state.file);
        } else {
        alert("Please provide a valid image. (JPG, JPEG or PNG)");
        }
    };

    //handle file change
    fileChange = event => {
        event.preventDefault();

        this.setState({ file: event.target.files[0] });

        let imageFile = event.target.files[0];

        if (imageFile) {
        const localImageUrl = URL.createObjectURL(imageFile);
        const imageObject = new window.Image();
        imageObject.onload = () => {
            imageFile.width = imageObject.naturalWidth;
            imageFile.height = imageObject.naturalHeight;
            URL.revokeObjectURL(imageFile);
        };
        imageObject.src = localImageUrl;
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.showProgress !== prevState.showProgress) {
        return { showProgress: nextProps.showProgress };
        }
        if (nextProps.image !== prevState.image) {
        return { image: nextProps.image };
        }
        if (nextProps.percent !== prevState.percent) {
        return { percent: nextProps.percent };
        }

        if (nextProps.error !== prevState.error) {
        return { error: nextProps.error };
        } else {
        return null;
        }
    }

    render() {
        const { image, percent, showProgress } = this.state;
        if (image) {
        return (
            <div
            className="jumbotron jumbotron-fluid mt-5 pt-4"
            style={{
                backgroundColor: "#3b3a30",
                textShadow: "0 1px 3px rgba(0,0,0,.5)",
                color: "white"
            }}
            >
            <div className="container">
                <div className="container">
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                    <div className="container">
                        <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8 mb-2">
                            {image === "empty" ? (
                            <img
                                className="card-img-top"
                                src="https://react.semantic-ui.com/images/wireframe/image.png"
                                alt=""
                                style={{ width: 250, height: 250 }}
                            />
                            ) : (
                            <img
                                className="card-img-top"
                                src={image}
                                style={{ width: 250, height: 250 }}
                                alt=""
                            />
                            )}
                        </div>
                        <div className="col-md-2"></div>
                        </div>
                    </div>
                    <div
                        className="card"
                        style={{
                        width: "25rem",
                        backgroundColor: "#e9ecef",
                        color: "black"
                        }}
                    >
                        <div className="card-body">
                        <h5 className="card-title">Upload image</h5>
                        <p className="card-text">
                            Select the image and click upload.
                        </p>
                        <form>
                            <div className="container">
                            <div className="row">
                                <div className="col-md-1"></div>
                                <div className="col-md-5">
                                <button
                                    className="btn btn-outline-secondary btn-block"
                                    type="button"
                                    onClick={() =>
                                    this.fileInputRef.current.click()
                                    }
                                >
                                    Select Image
                                </button>
                                </div>
                                <div className="col-md-5">
                                <button
                                    className="btn btn-outline-secondary btn-block"
                                    type="button"
                                    onClick={this.onFormSubmit}
                                >
                                    Upload
                                </button>
                                </div>
                                <div className="col-md-1">
                                <input
                                    type="file"
                                    ref={this.fileInputRef}
                                    onChange={event => this.fileChange(event)}
                                    hidden
                                />
                                </div>
                            </div>
                            {showProgress ? (
                                <div className="row mt-3">
                                <div className="col-md-12">
                                    <div className="progress">
                                    <div
                                        className="progress-bar bg-success"
                                        style={{ width: `${percent}%` }}
                                        role="progressbar"
                                        aria-valuenow={percent}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                    </div>
                                </div>
                                </div>
                            ) : null}
                            </div>
                        </form>
                        </div>
                    </div>
                    </div>
                    <div className="col-md-4"></div>
                </div>
                </div>
            </div>
            </div>
        );
        } else {
        return <Spinner />;
        }
    }
    }

    const mapStateToProps = ({ item }) => ({
    error: item.error,
    percent: item.percent,
    showProgress: item.showProgress,
    image: item.image
    });

    const mapDispatchToProps = {
    uploadImage,
    getData
    };

    export default connect(
    mapStateToProps,
    mapDispatchToProps
    )(withRouter(MainComponent));

Now we are done. Let's try out uploading...

![image](/img/2.gif)

To view this application to try it out,

Go to [FSUPTUTORIAL](https://fsuptutorial.firebaseapp.com) hosted on `Firebase`

To view the application repo in [GitHub](https://github.com/Niweera/fsuptutorial)

### Acknowledgement

This tutorial is just a dream, if it weren't for these resources;

https://medium.com/strands-tech-corner/how-to-validate-an-image-in-redux-form-1cef01e4ff6c

https://codesandbox.io/s/04lz4580pl
