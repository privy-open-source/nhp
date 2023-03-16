import connect from 'connect'
import type * as http from 'node:http'
import { fromNodeMiddleware, createEvent } from 'h3'
import { createProxyMiddleware } from 'http-proxy-middleware'
import config from '~/server.config'

const app = connect()

for (const server of config) {
  if (server.targetUrl) {
    const proxy = createProxyMiddleware(server.baseUrl, {
      target      : server.targetUrl,
      changeOrigin: true,
      pathRewrite : { [`^${server.baseUrl}`]: '/' },
      async onProxyReq (proxyReq, req, res) {
        if (typeof server.onProxyReq === 'function') {
          const event = createEvent(
            req as http.IncomingMessage,
            res as http.ServerResponse<http.IncomingMessage>,
          )

          const proxyEvent = createEvent(
            proxyReq as unknown as http.IncomingMessage,
            proxyReq as unknown as http.ServerResponse<http.IncomingMessage>,
          )

          await server.onProxyReq(proxyEvent, event)
        }
      },
      async onProxyRes (proxyRes, req, res) {
        if (typeof server.onProxyRes === 'function') {
          const event = createEvent(
            req as http.IncomingMessage,
            res as http.ServerResponse<http.IncomingMessage>,
          )

          const proxyEvent = createEvent(
            proxyRes,
            proxyRes as unknown as http.ServerResponse<http.IncomingMessage>,
          )

          await server.onProxyRes(proxyEvent, event)
        }
      },
    })

    app.use(proxy as connect.NextHandleFunction)
  }
}

export default fromNodeMiddleware(app)
