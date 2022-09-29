/** @module hubspot/watch */

import watch from '@hubspot/cli-lib/lib/watch.js'
import fileMapper from '@hubspot/cli-lib/api/fileMapper.js'
import { globals } from '../config/globals.js'
import { loadAuthConfig } from './auth.js'

let cmsMode = 'publish'
if (process.env.MODE === 'draft') {
  cmsMode = 'draft'
}

/**
 * @summary watch and upload all HubSpot theme files
 * @since 0.0.1
 * @async
 * @param {AUTH_CONFIG|boolean} customAuthConfig - Nimbly custom Hubspot authentication
 * @returns undefined
 * @example
 * await watchHubspotTheme()
 */
async function watchHubspotTheme (customAuthConfig) {
  try {
    const hubconf = await loadAuthConfig(customAuthConfig)
    const portalId = hubconf.portals[0].portalId
    try {
      const dirContents = await fileMapper.getDirectoryContentsByPath(portalId, '/')
      for (const iterator of dirContents.children) {
        if (iterator === globals.THEME_NAME) {
          const themeDirContents = await fileMapper.getDirectoryContentsByPath(portalId, iterator)
          for (const iterator of themeDirContents.children) {
            if (iterator === 'assets') {
              await fileMapper.deleteFile(portalId, `${globals.THEME_NAME}/assets`)
            }
          }
        }
      }
    } catch (error) {
      throw new Error(error)
    }
    const watcher = await watch.watch(portalId, globals.THEME, globals.THEME_NAME, {
      mode: cmsMode,
      remove: true,
      disableInitial: false,
      notify: false
    })
    watcher
      .on('add', path => console.log(`File ${path} has been added`))
      .on('change', path => console.log(`File ${path} has been changed`))
      .on('unlink', path => console.log(`File ${path} has been removed`))
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}

export { watchHubspotTheme }