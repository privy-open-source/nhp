import {
  createError,
  defineEventHandler,
  defineLazyEventHandler,
  getQuery as getRequestQuery,
} from 'h3'
import { getQuery } from 'ufo'
import { createProxyServer, type ProxyServerOptions as Options } from 'httpxy'
import { defu } from 'defu'
import { installHook, type HooksOptions } from './hooks'
import { URL } from 'node:url'
import type { ApiServer } from '../../../core'

function withDownloadHeader (onProxyRes: ApiServer['onProxyRes'], downloadExt?: string): ApiServer['onProxyRes'] {
  return (proxyRes, req, res) => {
    const query = getQuery(req.url ?? '')

    if (query.download !== 'false') {
      const name     = query.name as string ?? 'download'
      const type     = query.type as string ?? 'attachment'
      const filename = downloadExt && !name.endsWith(downloadExt)
        ? `${name}${downloadExt}`
        : name

      proxyRes.headers['content-disposition'] = `${type}; filename="${encodeURIComponent(filename)}"`
    }

    if (typeof onProxyRes === 'function')
      onProxyRes(proxyRes, req, res)
  }
}

function parseWhitelist (whitelist: string | string[] | undefined) {
  return Array.isArray(whitelist)
    ? whitelist
    : (whitelist ?? '').split(';')
}

function parseURL (url: unknown): URL | undefined {
  try {
    if (typeof url === 'string')
      return new URL(url)
  } catch {}
}

export function createProxyDynamic (config: ApiServer) {
  return defineLazyEventHandler(() => {
    const proxy      = createProxyServer()
    const whitelist  = parseWhitelist(config.allowFrom)
    const onProxyRes = config.downloadHeader
      ? withDownloadHeader(config.onProxyRes, config.downloadExt)
      : config.onProxyRes

    installHook(proxy, defu<HooksOptions, [HooksOptions]>({ onProxyRes }, config))

    return defineEventHandler(async (event) => {
      const query = getRequestQuery(event)
      const url   = parseURL(query.url)

      if (!url) {
        throw createError({
          statusCode   : 404,
          statusMessage: 'Page not found',
          data         : {
            code   : 404,
            errors : [],
            message: 'Page not Found',
          },
        })
      }

      if (!url.host || !whitelist.includes(url.host)) {
        throw createError({
          statusCode   : 403,
          statusMessage: 'Forbidden',
          data         : {
            code   : 403,
            errors : [],
            message: 'Forbidden',
          },
        })
      }

      await proxy.web(event.node.req, event.node.res, defu<Options, [Options]>({
        target      : url,
        changeOrigin: true,
        ignorePath  : true,
      }, config))
    })
  })
}
