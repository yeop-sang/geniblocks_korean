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
    // send request to portal via domain url parameter
    // for example, https://learn.staging.concord.org/api/v1/jwt/firebase?firebase_app=GVStaging
    let jwtUrl = urlParams.domain + "api/v1/jwt/firebase?firebase_app=" + config.projectId;

    let jwtInit = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${urlParams.token}`
      }
    };

    fetch(jwtUrl, jwtInit)
      .then(function (response) {
        if (!response.ok) console.log("Failed to fetch JWT", response.error, response.body);
        else {
          response.json().then(function (jsonData) {
            // TODO: validate token!
            firebase.auth().signInWithCustomToken(jsonData.token).catch(function (error) {
              console.log("Error authenticating with Firebase", error);
            });
          });
        }
    });
  }
}