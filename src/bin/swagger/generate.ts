import { type OpenAPIV2 } from 'openapi-types'
import { writeMethod } from './methods'
import { writeModel } from './model'
import {
  useConfig,
  useSchema,
  useWriter,
} from './context'

export async function generate () {
  const writer = useWriter()
  const schema = useSchema()
  const config = useConfig()

  writer.write('/* eslint-disable @typescript-eslint/no-empty-interface */')
  writer.write('/**')
  writer.write(' * ⚠️ DONT EDIT THIS FILE ⚠️')
  writer.write(' * This generated by @privyid/nhp')
  writer.write(' * If you want customize something, create new file with extension `.custom.ts`')
  writer.write(' */')
  writer.write('import {')
  writer.tab(1)
  writer.write('createLazyton,')
  writer.write('type ApiResponse,')
  writer.write('type AxiosRequestConfig,')
  writer.tab(-1)
  writer.write("} from '@privyid/nuapi/core'")
  writer.write("import type { Merge } from 'type-fest'")
  writer.line()
  writer.write(`export const useApi = createLazyton({ prefixURL: '${config.baseUrl ?? '/'}' })`)

  if (schema.definitions) {
    for (const [name, model] of Object.entries(schema.definitions))
      writeModel(name, model)
  }

  if (schema.paths) {
    for (const [url, methods] of Object.entries(schema.paths)) {
      for (const [method, operation] of Object.entries(methods))
        writeMethod(url, method, operation as OpenAPIV2.OperationObject)
    }
  }

  return writer.toString()
}
