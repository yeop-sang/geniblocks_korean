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

  // communicate with portal for JWT
  // if there is no domain parameter, there is no authentication
  if (!urlParams.domain) {
    console.log("Not authenticated via portal");
    return;
  } else {
    // send request to portal - for staging:
    // https://learn.staging.concord.org/api/v1/jwt/firebase?firebase_app=GVStaging
    let jwtUrl = urlParams.domain + "api/v1/jwt/firebase?firebase_app=" + config.projectId;
    fetch(jwtUrl, {
      method: 'post',
      headers: new Headers({
        'Authorization': `Bearer ${urlParams.token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: 'A=1&B=2'
    }).then(function (response) {
      return response;
    }).then(function (response) {
      if (!response.ok) console.log("nope");
      else {
        response.json().then(function (token) {
          // TODO: This will need some attention once tokens are returned
          firebase.auth().signInWithCustomToken(token).catch(function (error) {
            // Handle Errors here.
            console.log(error);
            // var errorCode = error.code;
            // var errorMessage = error.message;
            // ...
          });
        });
      }

      console.log("Response: ", response.body);
    });

  }
}