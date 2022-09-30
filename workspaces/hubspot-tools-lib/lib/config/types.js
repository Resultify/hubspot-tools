/**
 * @summary Additions common options
 * @description Additional options to use locally in functions
 * @exports BUILD_OPTIONS
 * @typedef BUILD_OPTIONS
 * @type {object}
 * @property {object} [config] - local theme based config
 * @property {boolean} [hideStatus] - hide task status from showing in console
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

/**
 * @summary File Info
 * @exports FILE_INFO
 * @typedef FILE_INFO
 * @type {object}
 * @property {string} [name]
 * @property {string} [path]
 * @property {string} dist
 * @property {string} size
 * @memberof Types
 */
