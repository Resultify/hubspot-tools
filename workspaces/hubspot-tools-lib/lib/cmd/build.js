
import { checkNode, checkPackageThemeConsistent } from '../check.js'
import { cleanAssets } from '../compile/clean.js'
import { compileScss } from '../compile/sass.js'
import { compileCss } from '../compile/css.js'
import { compileJs } from '../compile/js.js'
import * as utils from '../utils/utils.js'
checkNode()
checkPackageThemeConsistent()

/**
 * @summary Build/compile all src CSS/JS/SCSS files
 * @since 0.0.1
 * @async
 * @memberof Commands
 * @param {OPTIONS} [opt] - task options
 * @returns undefined
 * @example
 * node build/build.js
 */
async function build (opt) {
  await utils.confirmThemeName()
  const timeStart = utils.startTaskGroup('Build task')
  await cleanAssets()
  await compileScss()
  await Promise.all([compileCss(), compileJs(opt)])
  utils.endTaskGroup({ taskName: 'Build task', timeStart })
}

export { build }
