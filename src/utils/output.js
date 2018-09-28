/**
 * @name output.js
 * @desc Manage the console output
 */

// const
const debug = true;

export function printc(string) {
  if (debug) {
    console.log(string);
  }
}
