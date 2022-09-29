
import { checkNode, checkPackageThemeConsistent } from '../check.js'
import { uploadTheme } from '../hubspot/upload.js'
import { cleanAssets } from '../compile/clean.js'
import { compileScss } from '../compile/sass.js'
import { compileCss } from '../compile/css.js'
import { compileJs } from '../compile/js.js'
import { globals } from '../config/globals.js'
import { getCustomAuthConfig } from '../hubspot/auth.js'
import * as utils from '../utils/utils.js'
checkNode()
checkPackageThemeConsistent()

/**
 * @summary Upload theme to HUBSPOT cms portall
 * @since 0.0.1
 * @async
 * @memberof Commands
 * @param {OPTIONS} [opt] - task options
 * @returns undefined
 * @example
 * node build/upload.js
 */
async function upload (opt) {
  await utils.confirmThemeName()
  const auth = await getCustomAuthConfig()
  const timeStart = utils.startTaskGroup(`Upload ${globals.THEME_NAME}`)
  await cleanAssets()
  await compileScss()
  await Promise.all([compileCss(), compileJs(opt)])
  await uploadTheme(auth)
  utils.endTaskGroup({ taskName: `Upload ${globals.THEME_NAME}`, timeStart })
}

export { upload }
