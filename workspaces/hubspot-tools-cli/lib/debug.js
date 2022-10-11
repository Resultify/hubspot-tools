import chalk from 'chalk'
import { getLocalEnv } from '@resultify/hubspot-tools-lib/lib/utils/fs.js'

/**
 * @summary Show debug info with --debug flag
 * @async
 * @param {Object} [data] - cli data (localstorage)
 * @param {Object} [args] - cli args
 * @returns undefined
 */
async function showDebugInfo (data, args) {
  console.log(`\n${chalk.magenta('●─────')} General debug info [START]`)
  console.log(`${chalk.blue('Local .env')}`)
  await getLocalEnv() && console.log(await getLocalEnv())
  console.log(`${chalk.blue('Data')}`)
  data && console.log(data)
  console.log(`${chalk.blue('Arguments')}`)
  args && console.log(args)
  console.log(`${chalk.magenta('─────●')} General debug info [END]\n`)
}

export { showDebugInfo }
