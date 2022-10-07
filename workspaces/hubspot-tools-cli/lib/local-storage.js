import { execa } from 'execa'
import { importPackageJson, importThemeJson } from '@resultify/hubspot-tools-lib/lib/utils/fs.js'

async function localstorage () {
  return {
    git: {
    },
    package: await importPackageJson(),
    theme: await importThemeJson(),
    github: {
      auth: 'sucsess'
    },
    prompts: {},
    system: {
      node: process.version,
      npm: await (await execa('npm', ['--version'])).stdout,
      git: await (await execa('git', ['--version'])).stdout
    },
    tmp: {}
  }
}

export { localstorage }
