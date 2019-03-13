/**
 * @name download.js
 * @desc ...
 */

// ===================================================================================
// import
const download = require('../../vendor/download.js');

// ===================================================================================
// constant


// ===================================================================================
// global variable


// ===================================================================================
// private function


// ===================================================================================
// public function

/**
 * @public @func downloadFile
 * @desc Download file from browser direcctly
 * @param {string} content The content of file
 * @param {string} filename Name if the file to be downloaded
 * @param {number} filetype Type of the file. 0 for plain text, otherwise for pdf.
 */
export function downloadFile(content, filename, filetype) {
  download(content, filename, filetype ? 'application/pdf' : 'text/plain');
}

/*
global function list:
 */