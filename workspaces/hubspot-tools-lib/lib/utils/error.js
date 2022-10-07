import chalk from 'chalk'

function customError (msg, error) {
  console.error(`${chalk.red('Error:')} ${msg}\n`)
  if (error && process.env.RH_MODE === 'debug') {
    console.error(error)
  }
  process.exit(1)
}

export { customError }
