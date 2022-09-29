import { checkNode, checkPackageThemeConsistent } from '../check.js'
import { fetchModules } from '../hubspot/fetch.js'
import { globals } from '../config/globals.js'
import { getCustomAuthConfig } from '../hubspot/auth.js'
import * as utils from '../utils/utils.js'
checkNode()
checkPackageThemeConsistent()

/**
 * @summary Fetch Modules from HUBSPOT cms portall
 * @since 0.0.1
 * @async
 * @memberof Commands
 * @returns undefined
 * @example
 * node build/fetch.js
 */
async function hubspotFetchModules () {
  await utils.confirmThemeName()
  const auth = await getCustomAuthConfig()
  const timeStart = utils.startTaskGroup(`Fetch modules from ${globals.THEME_NAME}`)
  await fetchModules(auth)
  utils.endTaskGroup({ taskName: `Fetch modules from ${globals.THEME_NAME}`, timeStart })
}

export { hubspotFetchModules }
