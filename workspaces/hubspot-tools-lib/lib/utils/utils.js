/** @module lib/utils/utils */

import chalk from 'chalk'

/**
 * @summary convert file size B -> kB/MB
 * @since 0.0.1
 * @param {number} size - env variables
 * @returns {string} file size B/kB/MB
 * @example
 * convertFileSize(size)
 */
function convertFileSize (size) {
  if (size < 1000) {
    return `${parseFloat(size.toFixed(2))} B`
  } else if (size >= 1000) {
    return `${parseFloat((size / 1000).toFixed(2))} kB`
  } else if (size >= 1000000) {
    return `${parseFloat((size / 1000000).toFixed(2))} MB`
  }
}

/**
 * @summary parse file info
 * @since 0.0.1
 * @private
 * @param {Array<FILE_INFO>} files
 * @returns {string} all file info
 */
function filesStats (files) {
  let infoBlock = ''
  const lastItem = files.length - 1
  files.forEach((file, index) => {
    if (file.size) {
      infoBlock = infoBlock + `${chalk.green(file.dist)} ${chalk.yellow(`- ${file.size}`)}`
    } else {
      infoBlock = infoBlock + `${chalk.green(file.dist)}`
    }
    if (index !== lastItem) {
      infoBlock = infoBlock + '\n'
    }
  })
  return infoBlock
}

/**
 * @summary Start task message
 * @description Show in console start task message with timestamp
 * @since 0.0.1
 * @param {string} taskName - task name
 * @returns {number} timestamp
 * @example
 * const timeStart = utils.startTask('Compile CSS')
 */
function startTask (taskName) {
  const timeStart = Date.now()
  console.log(
    `${chalk.dim(`[${new Date(timeStart).toLocaleTimeString()}]`)} ${chalk.blue(taskName)} ${chalk.dim('start')}`
  )
  return timeStart
}

/**
 * @summary end task/tasks options
 * @typedef EndTask
 * @type {object}
 * @property {Array<FILE_INFO>} [files] - file list
 * @property {string} taskName
 * @property {number} timeStart
 */

/**
 * @summary End task console message
 * @description End task console message with date, title, time and filelist if present
 * @since 0.0.1
 * @param {EndTask} options - EndTask options
 * @returns undefined
 * @example
 * utils.endTask({taskName: 'Compile CSS', timeStart: 1663932841247 })
 */
function endTask (options) {
  const timeEnd = Date.now()
  const timeDiff = (timeEnd - options.timeStart) / 1000
  const msg = `${chalk.dim(`${chalk.magenta('─────●')} [${new Date(timeEnd).toLocaleTimeString()}]`)} ${chalk.blue(options.taskName)}`
  if (options.files) {
    console.log(
      `${filesStats(options.files)}\n${msg} ${chalk.gray('finished after')} ${chalk.yellow(`${timeDiff}s`)}\n`
    )
  } else {
    console.log(
      `${msg} ${chalk.gray('finished after')} ${chalk.yellow(`${timeDiff}s`)}\n`
    )
  }
}

/**
 * @summary Start task group message
 * @description Show in console start task group message with timestamp
 * @since 0.0.1
 * @param {string} taskName - Task name
 * @returns {number} timestart timestamp
 * @example
 * const timeStart = utils.startTaskGroup('Build task')
 */
function startTaskGroup (taskName) {
  const timeStart = Date.now()
  const msg = `[${chalk.yellow(new Date(timeStart).toLocaleTimeString())}] ${chalk.bold(taskName)}`
  console.log(`══════════════\n${msg}\n`)
  return timeStart
}

/**
 * @summary End group of tasks info
 * @description End group of tasks console message with date, title and time
 * @since 0.0.1
 * @param {EndTask} options - End task options
 * @returns undefined
 * @example
 * utils.endTaskGroup({ taskName: 'Build task', timeStart: 1663932841247 })
 */
function endTaskGroup (options) {
  const timeEnd = Date.now()
  const timeDiff = (timeEnd - options.timeStart) / 1000

  const msg = `[${chalk.yellow(new Date(timeEnd).toLocaleTimeString())}] ${chalk.bold(options.taskName)}`

  console.log(`\n${chalk.green('●')} DONE\n${msg} ${chalk.grey('finished after')} ${chalk.bold.yellow.underline(`${timeDiff}s`)}\n═══════════════`)
}

export { startTask, endTask, startTaskGroup, endTaskGroup, convertFileSize }
