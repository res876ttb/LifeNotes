/**
 * @name date.js
 * @desc Time functions which are frequently used.
 */

export function getCurTime() {
  let date = new Date(); 
  return date.getTime();
}