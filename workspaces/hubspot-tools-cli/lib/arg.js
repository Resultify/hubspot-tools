import arg from 'arg'
import { customError } from '@resultify/hubspot-tools-lib/lib/utils/error.js'

function parseArgs () {
  try {
    const args = arg({
      // Types
      '--help': Boolean,
      '--version': Boolean,
      '--debug': Boolean,
      // Aliases
      '-h': '--help',
      '-v': '--version',
      '-d': '--debug'
    })
    return args
  } catch (error) {
    if (error.code === 'ARG_UNKNOWN_OPTION') {
      customError(error.message, error)
    } else {
      throw error
    }
  }
}

// More than one non-flag argument
function checkIfMoreThanOneArg (args) {
  if (args._.length > 1) {
    customError('More than one non-flag argument')
  }
}

export { parseArgs, checkIfMoreThanOneArg }
