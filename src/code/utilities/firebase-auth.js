/* global firebase */
import urlParams from "./url-params";

export default function initFirebase() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCr8UbzmHqWVuOIQrU2_1_CIIwT-GphnYo",
    authDomain: "gvstaging.firebaseapp.com",
    databaseURL: "https://gvstaging.firebaseio.com",
    projectId: "gvstaging",
    storageBucket: "",
    messagingSenderId: "574673678327"
  };
  firebase.initializeApp(config);

  // send request to portal for JWT
  let jwtUrl = urlParams.domain + "api/v1/jwt/firebase?firebase_app=" + config.projectId;

  let jwtRequest = new Request(jwtUrl);
  console.log(jwtRequest);
  fetch(jwtRequest).then(function (response) {
    return response;
  }).then(function (response) {
    if (!response.ok) console.log("nope");
    else {
      response.json().then(function (token) {
        firebase.auth().signInWithCustomToken(token).catch(function (error) {
          // Handle Errors here.
          console.log(error);
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // ...
        });
      });
    }

    console.log("Response: " + response.body);
  });
  // https://learn.staging.concord.org/api/v1/jwt/firebase?firebase_app=GVStaging
  console.log(firebase);
}