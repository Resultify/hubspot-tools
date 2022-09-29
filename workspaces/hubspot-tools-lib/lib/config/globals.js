import { createRequire } from 'module'
const require = createRequire(import.meta.url)

/**
 * @summary Global constants
 * @typedef GLOBALS
 * @type {object}
 * @property {string} [ROOT_PATH]
 * @property {string} [ROOT_DIR_NAME]
 * @property {string} [SRC]
 * @property {string} [THEME]
 * @property {string} [THEME_ASSETS]
 * @property {string} [THEME_NAME]
 * @property {string} [TMP]
 * @property {string} [CSS_SRC]
 * @property {string} [CSS_DIST]
 * @property {string} [SCSS_SRC]
 * @property {string} [JS_SRC]
 * @property {string} [JS_DIST]
 */

/**
 * @summary Global constants
 * @type {GLOBALS}
 */
const globals = {}

if (process.env.MODE === 'test') {
  globals.ROOT_PATH = process.cwd()
  globals.ROOT_DIR_NAME = globals.ROOT_PATH.split('/').pop()
} else {
  globals.ROOT_PATH = process.cwd()
  globals.ROOT_DIR_NAME = globals.ROOT_PATH.split('/').pop()
}

globals.SRC = `${globals.ROOT_PATH}/src`
globals.TMP = `${globals.SRC}/tmp`
globals.THEME = `${globals.ROOT_PATH}/theme`
globals.THEME_ASSETS = `${globals.ROOT_PATH}/theme/assets`
globals.THEME_NAME = require(`${globals.THEME}/theme.json`).label

// CSS compilation variables
globals.CSS_SRC = `${globals.SRC}/css`
globals.CSS_DIST = `${globals.THEME_ASSETS}/css`

// SCSS compilation variables
globals.SCSS_SRC = `${globals.SRC}/scss`

// JS compilation variables
globals.JS_SRC = `${globals.SRC}/js`
globals.JS_DIST = `${globals.THEME_ASSETS}/js`

export { globals }
