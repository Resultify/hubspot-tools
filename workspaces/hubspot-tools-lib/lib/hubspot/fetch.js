/** @module hubspot/fetch */

import { downloadFileOrFolder } from '@hubspot/cli-lib/fileMapper.js'
import logger from '@hubspot/cli-lib/logger.js'
import { globals } from '../config/globals.js'
import * as utils from '../utils/utils.js'
import { loadAuthConfig } from './auth.js'

let cmsMode = 'publish'
if (process.env.MODE === 'draft') {
  cmsMode = 'draft'
}

/**
 * @summary fetch all HubSpot theme Modules
 * @since 0.0.1
 * @async
 * @param {AUTH_CONFIG|boolean} customAuthConfig - Nimbly custom Hubspot authentication
 * @returns undefined
 * @example
 * await fetchModules()
 */
async function fetchModules (customAuthConfig) {
  try {
    const timeStart = utils.startTask('fetchModules')

    const hubconf = await loadAuthConfig(customAuthConfig)
    const src = `${globals.THEME_NAME}/modules`
    const dest = `${globals.THEME}/modules`
    const mode = cmsMode
    const options = {
      overwrite: true,
      src: 'temporary fix'
    }
    logger.setLogLevel(2)
    await downloadFileOrFolder({ accountId: hubconf.portals[0].portalId, src, dest, mode, options })

    utils.endTask({ taskName: `fetchModules ${globals.THEME_NAME}`, timeStart })
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}

/**
 * @summary fetch all HubSpot theme files
 * @since 0.0.1
 * @async
 * @param {AUTH_CONFIG|boolean} [customAuthConfig] - Nimbly custom Hubspot authentication
 * @returns undefined
 * @example
 * await fetchAll()
 */
async function fetchAll (customAuthConfig) {
  try {
    const timeStart = utils.startTask('fetchAll')

    const hubconf = await loadAuthConfig(customAuthConfig)
    const src = `${globals.THEME_NAME}`
    const dest = `${globals.THEME}`
    const mode = cmsMode
    const options = {
      overwrite: true,
      src: 'temporary fix'
    }
    logger.setLogLevel(2)
    await downloadFileOrFolder({ accountId: hubconf.portals[0].portalId, src, dest, mode, options })

    utils.endTask({ taskName: `fetchAll ${globals.THEME_NAME}`, timeStart })
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}

export { fetchModules, fetchAll }