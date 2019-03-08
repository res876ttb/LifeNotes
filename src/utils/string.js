/**
 * @name string.js
 * @desc Some useful function about string process
 */

// ===================================================================================
// import


// ===================================================================================
// constant
const specialChar = '¨';

// ===================================================================================
// global variable


// ===================================================================================
// private function


// ===================================================================================
// public function

/**
 * @public @func splitOnce
 * @param {string} str1 The string to be splitted
 * @param {string} str2 The split token
 * @returns {array} Return the splitted string array.
 */
export function splitOnce(str1, str2) {
  let tmp = str1.replace(str2, specialChar, 1);
  return tmp.split(specialChar);
}

/*
global function list: 
  split once
 */