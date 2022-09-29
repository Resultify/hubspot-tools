/** @module lib/css */

import fsPromises from 'fs/promises'
import postcss from 'postcss'
import cssimport from 'postcss-import'
import { globals } from '../config/globals.js'
import * as utils from '../utils/utils.js'

/**
 * @summary Compile Css
 * @since 0.0.1
 * @async
 * @param {OPTIONS} [opt] - options
 * @returns undefined
 * @example
 * await compileCss()
 */
async function compileCss (opt) {
  try {
    const cssDist = globals.CSS_DIST

    const hideStatus = opt?.options?.hideStatus

    const timeStart = utils.startTask('compileCss')
    const fileList = []

    await fsPromises.mkdir(cssDist, { recursive: true })
    const files = await utils.getFileList(`${globals.CSS_SRC}/*.css`, { objectMode: true })

    for await (const file of files) {
      const css = await fsPromises.readFile(file.path)
      const postcssResult = await postcss().use(cssimport()).process(css, {
        from: file.path,
        to: `${cssDist}/${file.name}`
      })
      await fsPromises.writeFile(`${cssDist}/${file.name}`, postcssResult.css)

      const fileStats = await fsPromises.stat(`${cssDist}/${file.name}`)
      file.size = utils.convertFileSize(fileStats.size)
      file.dist = `${cssDist}/${file.name}`
      fileList.push(file)
    }

    hideStatus || utils.endTask({ files: fileList, taskName: 'compileCss', timeStart })
  } catch (error) {
    console.error(error)
  }
}

export { compileCss }