import { type OpenAPIV2 } from 'openapi-types'
import { type ApiServer } from '../../core'
import type TextWriter from './writer'

function createScope<T> () {
  let context: T

  function use (): T {
    return context
  }

  async function run (ctx: T, handler: () => void | Promise<void>) {
    context = ctx

    await handler()
  }

  return {
    use,
    run,
  }
}

export const contextScope = createScope<{
  writer: TextWriter,
  config: ApiServer,
  schema: OpenAPIV2.Document,
}>()

export function unWrap<T, K extends keyof T> (useCtxFn: () => T, key: K): () => T[K] {
  return () => useCtxFn()[key]
}

export const useContext = contextScope.use

export const useConfig = unWrap(useContext, 'config')

export const useWriter = unWrap(useContext, 'writer')

export const useSchema = unWrap(useContext, 'schema')

export const MODEL_MARK = 15
