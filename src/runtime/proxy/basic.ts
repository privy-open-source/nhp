import type connect from 'connect'
import console from 'consola'
import { type ApiServer } from '../../core'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { joinURL } from 'ufo'
import { useRuntimeConfig } from '#imports'

export default function addBasicProxy (app: connect.Server, proxy: ApiServer) {
  if (proxy.targetUrl) {
    const config  = useRuntimeConfig()
    const baseUrl = joinURL(config.app.baseURL, proxy.baseUrl)

    app.use(createProxyMiddleware(baseUrl, {
      ...proxy,
      target      : proxy.targetUrl,
      changeOrigin: true,
      pathRewrite : typeof proxy.pathRewrite === 'function'
        ? proxy.pathRewrite
        : {
            [`^${baseUrl}`]: '/',
            ...proxy.pathRewrite,
          },
    }) as connect.NextHandleFunction)
  } else
    console.warn(`[NHP] Skip create proxy "${proxy.name}", missing target url`)
}
