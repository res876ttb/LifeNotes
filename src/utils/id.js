/**
 * @name id.js
 * @desc The api which generate proper Random string for id
 */

var us = require('microseconds');

export function getNewID() {
  return us.now().toString() + Math.random().toString().slice(2);
}
