import { checkNode, checkPackageThemeConsistent } from '../check.js'
import { cleanAssets } from '../compile/clean.js'
import { compileScss } from '../compile/sass.js'
import { compileCss } from '../compile/css.js'
import { compileJs } from '../compile/js.js'
import { watchSrc } from '../compile/watch.js'
import { getCustomAuthConfig } from '../hubspot/auth.js'
import { watchHubspotTheme } from '../hubspot/watch.js'
import * as utils from '../utils/utils.js'
checkNode()
checkPackageThemeConsistent()

/**
 * @summary Run watch process with css/js/scss compilation
 * @since 0.0.1
 * @async
 * @memberof Commands
 * @param {OPTIONS} [opt] - task options
 * @returns undefined
 * @example
 * node build/watch.js
 */
async function watch (opt) {
  await utils.confirmThemeName()
  const auth = await getCustomAuthConfig()
  const timeStart = utils.startTaskGroup('Build task')
  await cleanAssets()
  await compileScss()
  await Promise.all([compileCss(), compileJs(opt)])
  utils.endTaskGroup({ taskName: 'Build task', timeStart })
  await watchSrc()
  await watchHubspotTheme(auth)
  console.log('Watching files...')
}

export { watch }
