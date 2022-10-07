import chalk from 'chalk'

async function showInfo (data) {
  console.log(`\n${chalk.blue('Info')}`)
  console.log(data)
  process.exit(0)
}

export { showInfo }
