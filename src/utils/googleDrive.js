/**
 * @name googleDrive.js
 * @desc Provide APIs to synchronize data in PouchDB with GoogleDrive
 */

// ===================================================================================
// import


// ===================================================================================
// constant
const scope = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.profile';
const apiKey = 'AIzaSyCBNvLSlqKjmCPEufgh97XTFeOIn4v3d68';
const clientId = '695448691018-v7q04dii2ekr2fuq8tirtk8dg7q619hb.apps.googleusercontent.com';

// ===================================================================================
// global variable


// ===================================================================================
// private function


// ===================================================================================
// public function

/**
 * @public @func initGDAPI
 * @param {func} updateSigninStatus Param: status
 * @param {func} callback Param: None
 * @returns {null}
 */
export function initGDAPI(updateSigninStatus, callback) {
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: apiKey,
      clientId: clientId,
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