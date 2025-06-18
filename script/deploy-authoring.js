#!/usr/bin/env node

/**
 * deploy-authoring.js
 * 
 * Uploads the local authoring document to either the staging or production firebase database.
 *
 * Usage:
 *  -d/--dry-run      report what would be deployed without actually deploying (default: false)
 *  -p/--production   deploy to production database; otherwise staging database (default: false)
 */

const argv = require('minimist')(process.argv.slice(2));
const fbAdmin = require("firebase-admin");

/**
 * A service account key is required to gain admin access to the database.
 * To obtain a service account key,
 * 1. log into the Firebase console
 * 2. navigate to project settings
 * 3. select the Service Accounts tab
 * 4. "Generate new private key" to download a key
 * 5. Rename the key file to `gvstaging-firebase-key.json` or `gvproduction-firebase-key.json`
 * 6. move it into this folder (`./script`). It will be imported below.
 * IMPORTANT: Never commit your private key! It should be ignored by .gitignore.
 */
const isDryRun = argv.d || argv["dry-run"];
const isProduction = argv.p || argv.production;

let fbKey;
// GitHub Actions 등 CI 환경에서는 환경 변수에서 키를 읽어옵니다.
if (process.env.FIREBASE_KEY_JSON) {
  try {
    fbKey = JSON.parse(process.env.FIREBASE_KEY_JSON);
  } catch (e) {
    console.error("Failed to parse FIREBASE_KEY_JSON environment variable.");
    process.exit(1);
  }
} else {
  // 로컬 환경에서는 파일에서 키를 읽어옵니다.
  const keyPath = "./cc-korea-snu-firebase-key.json";
  try {
    fbKey = require(keyPath);
  } catch (e) {
    console.error(`Failed to load Firebase key from ${keyPath}.`);
    console.error("For CI/CD, set the FIREBASE_KEY_JSON environment variable.");
    console.error("For local development, make sure the key file exists.");
    process.exit(1);
  }
}

const fbDatabaseUrl = "https://cc-korea-snu-default-rtdb.firebaseio.com";
const dbVersion = "1";
const authoringKey = "authoring";

fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(fbKey),
  databaseURL: fbDatabaseUrl
});
const authoringRef = fbAdmin.database().ref(`/${dbVersion}/${authoringKey}`);

async function readStdinSync() {
  return new Promise(resolve => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.resume();
    // use timer to detect when there's no input
    let t = setTimeout(() => {
      process.stdin.pause();
      resolve(data);
    }, 1000);
    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read())) {
        data += chunk;
      }
      if (t) {
        clearTimeout(t);
        t = null;
      }
    }).on('end', () => {
      if (t) clearTimeout(t);
      resolve(data);
    });
  });
}

async function main() {
  const input = await readStdinSync();
  if (input) {
    if (isDryRun) {
      console.log(input);
      console.log(`dry-run: would have pushed authoring to ${isProduction ? "production" : "staging"} database`);
      process.exit(0);
    }
    else {
      // upload the authoring to firebase
      const parsedAuthoring = JSON.parse(input);
      authoringRef.set(parsedAuthoring, error => {
        if (!error) {
          console.log(`Successfully deployed authoring to ${isProduction ? "production" : "staging"} database!`);
          process.exit(0);
        }
        else {
          console.error("Deploy failed!");
          process.exit(1);
        }
      });
    }
  }
  else {
    console.error("No input received!");
    process.exit(1);
  }
}

main();
