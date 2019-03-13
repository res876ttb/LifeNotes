/**
 * @name version.js
 * @desc ...
 */

const appVersion = '0.1.0';
const dataVersion = '0.1.0';

/**
 * @public @func getVersion
 * @desc Return current software version
 * @returns {string} appVersion, dataVersion
 */
export function getVersion() {
  return {
    appVersion: appVersion,
    dataVersion: dataVersion,
  };
}

/*
global function list:
  getVersion
 */