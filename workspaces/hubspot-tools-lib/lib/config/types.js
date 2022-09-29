/**
 * @summary Additions common options
 * @description Additional options to use locally in functions
 * @exports LOCAL_OPTIONS
 * @typedef LOCAL_OPTIONS
 * @type {object}
 * @property {boolean} [hideStatus] - hide task status from showing in console
 * @memberof Types
 */

/**
 * @summary Global config
 * @description Global general config variables
 * @exports GLOBAL_CONFIG
 * @typedef GLOBAL_CONFIG
 * @type {object}
 * @property {Object} [js]
 * @property {Array<string>} [js.external]
 * @property {Object} [js.replace]
 * @property {Object} [js.globals]
 * @memberof Types
 */

/**
 * @summary Options
 * @exports OPTIONS
 * @typedef OPTIONS
 * @type {object}
 * @property {GLOBAL_CONFIG} [config] - Global general config variables
 * @property {LOCAL_OPTIONS} [options] - Additional options to use locally in functions
 * @memberof Types
 */

/**
 * @summary Hubspot Auth config schema based on personalaccesskey
 * @exports AUTH_CONFIG
 * @typedef AUTH_CONFIG
 * @type {Object}
 * @property {Object[]} portals
 * @property {string} portals[].authType - auth Type - personalaccesskey
 * @property {string} portals[].portalId
 * @property {string} portals[].personalAccessKey
 * @property {string} portals[].env
 * @memberof Types
 */
