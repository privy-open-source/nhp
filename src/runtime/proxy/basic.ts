import type connect from 'connect'
import console from 'consola'
import { type ApiServer } from '../../core'
import { createProxyMiddleware } from 'http-proxy-middleware'

export default function addBasicProxy (app: connect.Server, config: ApiServer) {
  if (config.targetUrl) {
    app.use(createProxyMiddleware(config.baseUrl, {
      ...config,
      target      : config.targetUrl,
      changeOrigin: true,
      pathRewrite : typeof config.pathRewrite === 'function'
        ? config.pathRewrite
        : {
            [`^${config.baseUrl}`]: '/',
            ...config.pathRewrite,
          },
    }) as connect.NextHandleFunction)
  } else
    console.warn(`[NHP] Skip create proxy "${config.name}", missing target url`)
}
