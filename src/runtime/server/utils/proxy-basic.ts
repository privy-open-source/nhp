import type { ApiServer } from '../../../core'
import { defineEventHandler, defineLazyEventHandler } from 'h3'
import { createProxyServer, type ProxyServerOptions as Options } from 'httpxy'
import { defu } from 'defu'
import { createPathRewriter } from './path-rewriter'
import { installHook } from './hooks'

export function createProxyBasic (config: ApiServer) {
  return defineLazyEventHandler(async () => {
    const proxy    = createProxyServer()
    const rewriter = createPathRewriter(config.pathRewrite)

    installHook(proxy, config)

    return defineEventHandler(async (event) => {
      if (rewriter) {
        const path = await rewriter(event.node.req.url ?? '/', event.node.req)

        if (typeof path === 'string')
          event.node.req.url = path
      }

      await proxy.web(event.node.req, event.node.res, defu<Options, [Options]>({
        target      : config.targetUrl,
        changeOrigin: true,
      }, config))
    })
  })
}
