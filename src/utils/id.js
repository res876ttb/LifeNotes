/**
 * @name id.js
 * @desc The api which generate proper Random string for id
 */

export function getNewID() {
  return Math.random().toString().slice(2) + Math.random().toString().slice(2);
}
