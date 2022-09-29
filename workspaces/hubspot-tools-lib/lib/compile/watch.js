/** @module lib/watch */

import chokidar from 'chokidar'
import chalk from 'chalk'
import { compileCss } from './css.js'
import { compileScss } from './sass.js'
import { compileJs } from './js.js'
import { globals } from '../config/globals.js'

/**
 * @summary Watch task
 * @since 0.0.1
 * @async
 * @returns undefined
 * @example
 * await watchSrc()
 */
async function watchSrc () {
  try {
    chokidar.watch([`${globals.CSS_SRC}/**/*.css`, `${globals.TMP}/*.css`], { ignoreInitial: true, awaitWriteFinish: false }).on('all', (event, path) => {
      console.log(`${chalk.red(event)} ${path}`)
      compileCss({ options: { hideStatus: true } })
    })

    chokidar.watch([`${globals.JS_SRC}/**/*.js`, `${globals.TMP}/*.js`], { ignoreInitial: true, awaitWriteFinish: false }).on('all', (event, path) => {
      console.log(`${chalk.red(event)} ${path}`)
      compileJs({ options: { hideStatus: true } })
    })

    chokidar.watch(`${globals.SCSS_SRC}/**/*.scss`, { ignoreInitial: true }).on('all', (event, path) => {
      console.log(`${chalk.red(event)} ${path}`)
      compileScss({ options: { hideStatus: true } })
    })
  } catch (error) {
    console.error(error)
  }
}

export { watchSrc }
