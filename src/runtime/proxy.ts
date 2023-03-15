import connect from 'connect'
import { fromNodeMiddleware } from 'h3'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { type ApiServer } from '..'
import config from '~/server.config'

const app = connect()

for (const server of config as ApiServer[]) {
  if (server.targetUrl) {
    const proxy = createProxyMiddleware(server.baseUrl, {
      target      : server.targetUrl,
      changeOrigin: true,
      pathRewrite : { [`^${server.baseUrl}`]: '/' },
    })

    app.use(proxy as connect.NextHandleFunction)
  }
}

export default fromNodeMiddleware(app)
