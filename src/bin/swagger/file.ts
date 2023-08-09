import { type OpenAPIV2 } from 'openapi-types'
import fse from 'fs-extra'
import { isRelative } from 'ufo'
import { resolve } from 'node:path'
import { ofetch } from 'ofetch'
import { ESLint } from 'eslint'

export async function loadSchema (url: string): Promise<OpenAPIV2.Document | undefined> {
  return isRelative(url)
    ? await fse.readJSON(resolve(process.cwd(), url))
    : await ofetch(url)
}

export async function saveFile (file: string, text: string): Promise<void> {
  await fse.ensureFile(file)
  await fse.writeFile(file, text)
}

export async function lintFile (file: string) {
  const linter = new ESLint({ fix: true })
  const result = await linter.lintFiles(file)

  await ESLint.outputFixes(result)
}
