// import { checkNode } from '@resultify/hubspot-tools-lib/lib/check.js'
import { parseArgs, checkIfMoreThanOneArg } from './arg.js'
import { localstorage } from './local-storage.js'
import { showInfo as info } from './cmd/info.js'
import { showDebugInfo } from './debug.js'
import { gitInfo } from './helpers/git.js'
import { checkIfSsh, checkIfBinExists } from './helpers/shell.js'

await checkIfSsh()
await checkIfBinExists('git')
await checkIfBinExists('node')
await checkIfBinExists('npm')
// checkNodeVersion()
let data = await localstorage()

const args = parseArgs()
checkIfMoreThanOneArg(args)
const nonFlagArg = args._

async function init () {
  if (args['--debug']) {
    process.env.RH_MODE = 'debug'
    await showDebugInfo(data, args)
  }
  if (nonFlagArg[0] === 'info') {
    await info(data)
  }

  // save git data
  data = { ...data, ...await gitInfo(data) }
}

export { init }
