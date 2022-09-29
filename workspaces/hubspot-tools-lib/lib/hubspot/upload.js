/** @module hubspot/upload */

import uploadFolder from '@hubspot/cli-lib/lib/uploadFolder.js'
import fileMapper from '@hubspot/cli-lib/api/fileMapper.js'
import logger from '@hubspot/cli-lib/logger.js'
import { globals } from '../config/globals.js'
import * as utils from '../utils/utils.js'
import { loadAuthConfig } from './auth.js'

let cmsMode = 'publish'
if (process.env.MODE === 'draft') {
  cmsMode = 'draft'
}

/**
 * @summary upload all HubSpot theme files
 * @since 0.0.1
 * @async
 * @param {AUTH_CONFIG|boolean} customAuthConfig - Nimbly custom Hubspot authentication
 * @returns undefined
 * @example
 * await uploadTheme()
 */
async function uploadTheme (customAuthConfig) {
  try {
    const timeStart = utils.startTask('uploadTheme')
    const hubconf = await loadAuthConfig(customAuthConfig)
    const portalId = hubconf.portals[0].portalId
    console.log(`Uploading theme ${globals.THEME_NAME}`)
    try {
      const dirContents = await fileMapper.getDirectoryContentsByPath(portalId, '/')
      for (const iterator of dirContents.children) {
        if (iterator === globals.THEME_NAME) {
          const themeDirContents = await fileMapper.getDirectoryContentsByPath(portalId, iterator)
          for (const iterator of themeDirContents.children) {
            if (iterator === 'assets') {
              await fileMapper.deleteFile(portalId, `${globals.THEME_NAME}/assets`)
            }
            if (iterator === 'css') {
              await fileMapper.deleteFile(portalId, `${globals.THEME_NAME}/css`)
            }
          }
        }
      }
    } catch (error) {
      throw new Error(error)
    }
    logger.setLogLevel(2)
    await uploadFolder.uploadFolder(portalId, globals.THEME, globals.THEME_NAME, {
      mode: cmsMode
    })

    utils.endTask({ taskName: `uploadTheme ${globals.THEME_NAME}`, timeStart })
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}

export { uploadTheme }
