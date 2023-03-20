import connect from 'connect'
import { fromNodeMiddleware } from 'h3'
import { createProxyMiddleware } from 'http-proxy-middleware'
import config from '~/server.config'

const app = connect()

for (const server of config) {
  if (server.targetUrl) {
    const proxy = createProxyMiddleware(server.baseUrl, {
      ...server,
      target      : server.targetUrl,
      changeOrigin: true,
      pathRewrite : { [`^${server.baseUrl}`]: '/', ...server.pathRewrite },
    })

    app.use(proxy as connect.NextHandleFunction)
  }
}

export default fromNodeMiddleware(app)
