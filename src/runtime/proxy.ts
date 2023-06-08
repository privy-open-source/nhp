import connect from 'connect'
import { fromNodeMiddleware } from 'h3'
import { createProxyMiddleware } from 'http-proxy-middleware'
import console from 'consola'
import config from '~/server.config'
import type { ApiServer } from '../core/'

const app = connect()

for (const server of (config as ApiServer[])) {
  if (server.targetUrl) {
    const proxy = createProxyMiddleware(server.baseUrl, {
      ...server,
      target      : server.targetUrl,
      changeOrigin: true,
      pathRewrite : typeof server.pathRewrite === 'function'
        ? server.pathRewrite
        : {
          [`^${server.baseUrl}`]: '/',
          ...server.pathRewrite,
        },
    })

    app.use(proxy as connect.NextHandleFunction)
  } else
    console.warn(`[NHP] Skip create proxy "${server.name}", missing target url`)
}

export default fromNodeMiddleware(app)
