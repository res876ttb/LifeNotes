/**
 * @name googleDrive.js
 * @desc Provide APIs to synchronize data in PouchDB with GoogleDrive
 */

// ===================================================================================
// import
const AES = require("crypto-js/aes");
const UTF8 = require('crypto-js/enc-utf8');

// ===================================================================================
// constant
const scope = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.profile';
const apiKey = 'U2FsdGVkX1/NTggGo6ANcV+zCHP6C4RWP6gL0KhEgjGm+ksIkfcpldR3UaZKA6eHwxn1h4yJMuo65UMI7A2Jsw==';
const clientId = 'U2FsdGVkX1+cF4ksZyItUk0D6Fci9RwU2NwmV2iC8vz3c6xS8RYwdlOTsVT8PzuW3cbWVNKtLLhyaXCy7N3sW7WildoKOfwZJBjlzKKD4/DgGQwMs4afiTgWmVln+U5E';

// ===================================================================================
// global variable


// ===================================================================================
// private function


// ===================================================================================
// public function

/**
 * @public @func initGDAPI
 * @param {func} updateSigninStatus Param: status
 * @param {string} key
 * @param {func} callback Param: None
 * @returns {null}
 */
export function initGDAPI(updateSigninStatus, key, callback) {
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: AES.decrypt(apiKey, key).toString(UTF8),
      clientId: AES.decrypt(clientId, key).toString(UTF8),
      discoveryDocs: null,
      scope: scope,
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
  
      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      
      // run callback
      if (callback) callback();
    }, function(error) {
      console.error(error);
    });
  });
}

/**
 * @public @func signInWithGoogle
 * @desc Sign in user google account
 * @param callback Param: userObject
 * @returns {null}
 */
export function signInWithGoogle(callback) {
  gapi.auth2.getAuthInstance().signIn().then(r => {
    callback(r);
  });
}

/**
 * @public @func signOutGoogle
 * @desc Sign out google account
 * @returns {null}
 */
export function signOutGoogle() {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * @public @func getGoogleUserProfile
 * @desc Get user info from google
 * @param callback Param: userName, userImageUrl, 
 * @returns {null}
 */
export function getGoogleUserProfile(callback) {
  let currentUser = gapi.auth2.getAuthInstance().currentUser;
  var profile = currentUser.get().getBasicProfile();
  callback(profile.getName(), profile.getImageUrl());
}

/**
 * @public @func runGoogleDriveAPITest
 * @desc Run api testing
 * @param {func} callback Callback function. Param: None
 * @returns {null}
 */
export function runGoogleDriveAPITest(callback) {
  callback();
}

/*
function list: 
 */