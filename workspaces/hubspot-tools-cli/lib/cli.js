import { checkNode } from '@resultify/hubspot-tools-lib/lib/check.js'
import { parseArgs, checkIfMoreThanOneArg } from './arg.js'
import { localstorage } from './local-storage.js'
import { showInfo as info } from './cmd/info.js'
import { showDebugInfo } from './debug.js'
import { gitInfo } from '@resultify/hubspot-tools-lib/lib/git.js'
import { checkIfSsh, checkIfBinExists } from '@resultify/hubspot-tools-lib/lib/shell.js'

await checkIfSsh()
await checkIfBinExists('git')
await checkIfBinExists('node')
await checkIfBinExists('npm')
checkNode()

// cli data localstorage
let data = await localstorage()

// parse args
const args = parseArgs()
checkIfMoreThanOneArg(args)
const nonFlagArg = args._

/**
 * @summary init cli
 * @async
 * @returns undefined
 */
async function init () {
  data = { ...data, ...await gitInfo(data) }
  if (args['--debug']) {
    process.env.RH_MODE = 'debug'
    await showDebugInfo(data, args)
  }
  if (nonFlagArg[0] === 'info') {
    await info(data)
  }
}

export { init }
