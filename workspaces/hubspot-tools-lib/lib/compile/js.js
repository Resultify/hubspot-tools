/** @module lib/rollup */

import fsPromises from 'fs/promises'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import sizes from 'rollup-plugin-sizes'
import { globals } from '../config/globals.js'
import * as utils from '../utils/utils.js'

/**
 * @summary Compile Js task
 * @since 0.0.1
 * @async
 * @param {OPTIONS} [opt] - task options
 * @returns undefined
 * @example
 * await compileJs()
 */
async function compileJs (opt) {
  try {
    const hideStatus = opt?.options?.hideStatus

    const timeStart = utils.startTask('compileJs')
    const fileList = []

    let replaceVal = {
      preventAssignment: false,
      'process.env.NODE_ENV': process.env.NODE_ENV
    }
    replaceVal = { ...replaceVal, ...opt.config.js.replace }

    await fsPromises.mkdir(globals.JS_DIST, { recursive: true })
    const files = await utils.getFileList(`${globals.JS_SRC}/*.js`, { objectMode: true })

    for await (const file of files) {
      const inputOptions = {
        input: file.path,
        external: [],
        plugins: [
          nodeResolve(),
          replace(replaceVal)
        ]
      }
      hideStatus || inputOptions.plugins.push(sizes())
      inputOptions.external = [...inputOptions.external, ...opt.config.js.external]

      const outputOptions = {
        file: `${globals.JS_DIST}/${file.name}`,
        format: 'iife',
        globals: {}
      }
      outputOptions.globals = { ...outputOptions.globals, ...opt.config.js.globals }
      const bundle = await rollup(inputOptions)
      // @ts-ignore
      await bundle.write(outputOptions)

      const fileStats = await fsPromises.stat(`${globals.JS_DIST}/${file.name}`)

      file.size = utils.convertFileSize(fileStats.size)
      file.dist = `${globals.JS_DIST}/${file.name}`
      fileList.push(file)
    }

    hideStatus || utils.endTask({ files: fileList, taskName: 'compileJs', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { compileJs }
