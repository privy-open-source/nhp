#!/usr/bin/env node
/* eslint-disable unicorn/prefer-top-level-await */
import meow from 'meow'
import fse from 'fs-extra'
import console from 'consola'
import {
  dirname,
  resolve,
  relative,
} from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ApiServer } from '../core'
import { loadConfig } from 'unconfig'
import { generate } from './swagger/generate'
import { contextScope } from './swagger/context'
import TextWriter from './swagger/writer'
import { isRelative } from 'ufo'
import {
  lintFile,
  loadSchema,
  saveFile,
} from './swagger/file'

const DIRNAME = dirname(fileURLToPath(import.meta.url))
const cli     = meow(`
  Usage
    $ nhp init      - Generate new server config
    $ nhp schema    - Generate schema file
    $ nhp version   - Show version
    $ nhp help      - Show help
`, {
  importMeta: import.meta,
  flags     : {},
})

async function main () {
  const { config } = await loadConfig<ApiServer[]>({
    sources: [
      {
        files     : 'server.config',
        extensions: ['ts', 'js'],
      },
    ],
    defaults: [],
  })

  switch (cli.input[0]) {
    /**
     * Generate server.config
     */
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

    /**
     * Generate schema
     */
    case 'schema': {
      for (const server of Object.values(config)) {
        if (server.schemaUrl) {
          try {
            const schema = await loadSchema(server.schemaUrl)

            if (schema) {
              await contextScope.run({
                schema,
                config: server,
                writer: new TextWriter(),
              }, async () => {
                const result   = await generate()
                const dir      = server.schemaDest ?? './api'
                const filename = isRelative(dir)
                  ? resolve(process.cwd(), dir, `${server.name}.ts`)
                  : resolve(dir, `${server.name}.ts`)

                await saveFile(filename, result)
                await lintFile(filename)

                console.success('Schema generated successfully:', relative(process.cwd(), filename))
              })
            }
          } catch (error) {
            console.error(error)
          }
        }
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
