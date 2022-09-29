/** @module hubspot/load */

import config from '@hubspot/cli-lib/lib/config.js'
import { getAccessToken } from '@hubspot/cli-lib/personalAccessKey.js'
import prompts from 'prompts'
import chalk from 'chalk'
import dotenv from 'dotenv'
import ora from 'ora';

/**
 * @summary portal name
 * @typedef PortalName
 * @type {Object}
 * @property {string} title
 * @property {string} value
 */

/**
 * @summary Get project local environment variables
 * @type {Object}
 */
const localEnv = dotenv.config()

/**
 * @summary get portal names from project local environment variables
 * @async
 * @private
 * @param {Object} localEnv - local env variables
 * @returns {Promise<Array>} portal name|names
 */
async function getPortalsName (localEnv) {
  /**
   * @type {Array<PortalName>}
   */
  const portalNames = []
  for (const env in localEnv.parsed) {
    if (env.toLowerCase().includes('hub_')) {
      portalNames.push({
        title: env.replace('hub_', ''),
        value: env.replace('hub_', '')
      })
    }
  }
  console.log('🚀 ~ file: auth.js ~ line 44 ~ getPortalsName ~ portalNames', portalNames)
  return portalNames
}

/**
 * @summary save portalNames
 * @type {Array<PortalName>}
 */
const portalNames = await getPortalsName(localEnv)

/**
 * @summary get auth data returned from Hubspot only based on HUBSPOT_PERSONAL_ACCESS_KEY
 * @async
 * @private
 * @param {string} accessKey - HUBSPOT_PERSONAL_ACCESS_KEY
 * @returns {Promise<Object>} auth data
 */
async function getAuthData (accessKey) {
  const spinner = ora('Authentication').start();
  try {
    const authData = await getAccessToken(accessKey)
    spinner.succeed()
    return authData
  } catch (error) {
    spinner.fail()
    console.error(`${chalk.red.bold('[Error]')}`)
    console.error(error)
    process.exit(1)
  }
}

/**
 * @summary get portalId from authData Object
 * @private
 * @param {Object} authData - auth data
 * @returns {string} portalId
 */
function getPortalId (authData) {
  return authData.portalId
}

/**
 * @summary generate Hubspot auth config based on PERSONAL_ACCESS_KEY and chosen portal name
 * @async
 * @private
 * @param {string} portalName - portal name
 * @param {Object} localEnv - env variables with PERSONAL_ACCESS_KEY
 * @returns {Promise<AUTH_CONFIG>} Hubspot portal auth config
 */
async function generateAccessConfig (portalName, localEnv) {
  try {
    for (const env in localEnv.parsed) {
      if (env === portalName) {
        return {
          portals: [
            {
              authType: 'personalaccesskey',
              portalId: getPortalId(await getAuthData(localEnv.parsed[env])),
              personalAccessKey: localEnv.parsed[env],
              env: 'prod'
            }
          ]
        }
      }
    }

  } catch(err) {
    console.error(err)
  }


}

/**
 * @summary prompt to select Portal if more than one with confirmation
 * @type {Array}
 */
const selectPortal = [
  {
    type: 'select',
    name: 'value',
    message: 'HubSpot account:',
    choices: portalNames,
    initial: 0
  },
  {
    type: 'confirm',
    name: 'firstConfirm',
    message: (prev, values) => `Continue with ${chalk.cyan.bold(prev)}?`,
    initial: true
  },
  {
    type: prev => prev === false ? 'select' : null,
    name: 'value',
    message: 'HubSpot account:',
    choices: portalNames,
    initial: 0
  },
  {
    type: (_, values) => values.firstConfirm === false ? 'confirm' : null,
    name: 'secondConfirm',
    message: (prev, values) => `Continue with ${chalk.cyan.bold(prev)}?`,
    initial: true
  }
]

/**
 * @summary prompt to confirm Portal if one portal
 * @type {Array}
 */
const confirmPortal = [
  {
    type: 'confirm',
    name: 'secondConfirm',
    message: `Continue with ${chalk.cyan.bold(portalNames[0].value)} HubSpot portal?`,
    initial: true
  }
]

// process.exit(0) if no confirmation for portal name
// https://github.com/terkelg/prompts#optionsonsubmit
const onSubmit = async (prompt, answer) => {
  if (prompt.name === 'secondConfirm' && answer === false) {
    process.exit(0)
  }
}
// process.exit(0) when the user cancels/exits the prompt
// https://github.com/terkelg/prompts#optionsoncancel
const onCancel = async () => {
  process.exit(0)
}

/**
 * @summary show prompt with portals and return the selected portal name
 * @async
 * @private
 * @returns {Promise<string>} portal name
 */
async function choosePortal () {
  if (portalNames.length > 1) {
    const portal = await prompts(selectPortal, { onSubmit, onCancel })
    return portal.value
  } else {
    await prompts(confirmPortal, { onSubmit, onCancel })
    return portalNames[0].value
  }
}

/**
 * @summary Nimbly custom Hubspot authentication
 * @description Hubspot CMS auth based on Nimbly custom local .env file with multiple Hub platforms to choose
 * @async
 * @returns {Promise<AUTH_CONFIG|boolean>} Hubspot auth config
 * @example
 * .env ->
 * hub_patformName=personalaccesskey
 * hub_patformName2=personalaccesskey2
 */
async function getCustomAuthConfig () {
  if (localEnv.parsed.HUBSPOT_PERSONAL_ACCESS_KEY || Object.keys(localEnv.parsed)[0].toLowerCase().includes('HUBSPOT')) {
    return false
  } else {
    const hubConfig = await generateAccessConfig(await choosePortal(), localEnv)
    return hubConfig
  }
}

/**
 * @summary Load and validate Hubspot config
 * @async
 * @prop {AUTH_CONFIG|boolean} customAuthConfig - Nimbly custom Hubspot authentication
 * @returns {Promise<Object>} Hubspot loaded config
*/
async function loadAuthConfig (customAuthConfig) {
  // load HUBSPOT config based on HUBSPOT_PORTAL_ID and HUBSPOT_PERSONAL_ACCESS_KEY env variables
  if (!customAuthConfig) {
    const hubConfig = await config.getAndLoadConfigIfNeeded({ silenceErrors: false, useEnv: true })
    await config.validateConfig()
    await getAuthData(localEnv.parsed.HUBSPOT_PERSONAL_ACCESS_KEY)
    return hubConfig

  // load HUBSPOT config based on Nimbly custom env variables
  } else {
    /**
     * fake env variables to run fake loadConfig() function
     * to set environmentVariableConfigLoaded=true in HubSpot cli-lib
     * @hubspot/cli-lib/lib/config.js
     */
    process.env.HUBSPOT_PORTAL_ID = '111'
    process.env.HUBSPOT_PERSONAL_ACCESS_KEY = '222'
    await config.loadConfig(null, { useEnv: true })

    // load real config
    const hubConfig = await config.setConfig(customAuthConfig)
    await config.validateConfig()
    return hubConfig
  }
}

export { loadAuthConfig, getCustomAuthConfig }
