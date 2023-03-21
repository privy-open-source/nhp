#!/usr/bin/env node
/* eslint-disable unicorn/prefer-top-level-await */
import meow from 'meow'
import fse from 'fs-extra'
import console from 'consola'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIRNAME = dirname(fileURLToPath(import.meta.url))
const cli     = meow(`
  Usage
    $ nhp init      - Generate new server config
    $ nhp version   - Show version
    $ nhp help      - Show help
`, {
  importMeta: import.meta,
  flags     : {},
})

async function main () {
  switch (cli.input[0]) {
    case 'init': {
      const examplePath = resolve(DIRNAME, '../../template/server.config.ts')
      const configPath  = resolve(process.cwd(), './server.config.ts')

      if (await fse.exists(configPath))
        console.warn('server.config.ts already exist')
      else {
        await fse.copyFile(examplePath, configPath)

        console.success('Generate new server.config.ts')
      }

      break
    }

    case 'version': {
      cli.showVersion()

      break
    }

    default: {
      cli.showHelp()

      break
    }
  }
}

void main()
