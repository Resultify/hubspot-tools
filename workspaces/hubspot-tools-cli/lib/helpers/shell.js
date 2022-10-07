import { execa } from 'execa'
import chalk from 'chalk'

function customExecError (msg, error) {
  const internalMsg = error.stderr ? error.stderr : error.stdout
  console.error(`${chalk.bold.red('Error:')} ${internalMsg}`)
  if (msg) {
    console.error(`${msg}\n`)
  }
  if (error && process.env.RH_MODE === 'debug') {
    console.error(error)
  }
  process.exit(1)
}

async function checkIfSsh () {
  try {
    await execa('ssh-add', ['-L'])
  } catch (error) {
    if (error.stdout === 'The agent has no identities.') {
      console.log(customExecError('Add key to ssh-agent and run the command again', error))
    } else {
      console.log(customExecError('SSH error', error))
    }
  }
}

async function checkIfBinExists (bin) {
  try {
    await execa('which', [bin])
  } catch (error) {
    console.log(customExecError(`This script requires ${chalk.yellow(bin)} to be instaled`, error))
  }
}

export { checkIfSsh, checkIfBinExists }
