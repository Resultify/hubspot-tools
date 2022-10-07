/** @module lib/utils/fs */

import { globby } from 'globby'
import fsPromises from 'fs/promises'
// import { globals } from '../config/globals.js'
import dotenv from 'dotenv'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

async function importJson (path) {
  if (await isFileDir(path)) {
    return require(path)
  } else {
    return false
  }
}

async function importThemeJson () {
  if (await isFileDir(`${process.cwd()}/theme/theme.json`)) {
    return require(`${process.cwd()}/theme/theme.json`)
  } else {
    return false
  }
}

async function importPackageJson () {
  if (await isFileDir(`${process.cwd()}/package.json`)) {
    return require(`${process.cwd()}/package.json`)
  } else {
    return false
  }
}

async function getLocalEnv () {
  if (await isFileDir(`${process.cwd()}/.env`)) {
    return dotenv.config()
  } else {
    return false
  }
}

/**
 * @summary get file list based on glob pattern
 * @since 0.0.1
 * @async
 * @param {string} glob - glob pattern
 * @param {Object} options - options
 * @returns {Promise<Array>} node file list
 * @example
 * await getFileList()
 */
async function getFileList (glob, options) {
  try {
    const files = await globby(glob, options)
    if (files !== undefined) {
      return files
    }
  } catch (error) {
    console.error(`(getFileList ${glob} ${options} ) Error:`, error)
  }
}

/**
 * @summary check if file/dir exists
 * @since 0.0.1
 * @async
 * @param {string} path - file/dir path
 * @returns {Promise<boolean>}
 * @example
 * await isFileDir()
 */
async function isFileDir (path) {
  try {
    await fsPromises.stat(path)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    }
    console.error(error)
  }
}

/**
 * @summary Append data to file
 * @since 0.0.1
 * @async
 * @param {string} path - file/dir path
 * @param {string} data - data info
 * @returns undefined
 * @example
 * await addFileData()
 */
async function addFileData (path, data) {
  try {
    await fsPromises.appendFile(path, data)
  } catch (error) {
    console.error(error)
  }
}

export { getFileList, addFileData, isFileDir, importPackageJson, importThemeJson, importJson, getLocalEnv }
