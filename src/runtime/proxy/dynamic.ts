import type connect from 'connect'
import type { ApiServer } from '../../core'
import type { IncomingMessage } from 'node:http'
import { getQuery, parseURL } from 'ufo'
import { createProxyMiddleware } from 'http-proxy-middleware'

function validURL (url: string) {
  const pattern = new RegExp('^(https?:\\/\\/)' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator

  return !!pattern.test(url)
}

export default function addDynamicProxy (app: connect.Server, config: ApiServer) {
  app.use(config.baseUrl, (req, res, next) => {
    const query = getQuery(req.url as string)

    if (!query.url || !validURL(query.url as string)) {
      res.writeHead(404)
      res.end(JSON.stringify({
        code   : 404,
        errors : [],
        message: 'Page not Found',
      }))

      return
    }

    const url       = parseURL(query.url as string)
    const whitelist = Array.isArray(config.allowFrom)
      ? config.allowFrom
      : (config.allowFrom ?? '').split(';')

    if (!url.host || !whitelist.includes(url.host)) {
      res.writeHead(403)
      res.end(JSON.stringify({
        code   : 403,
        errors : [],
        message: 'Page not allowed',
      }))

      return
    }

    next()
  })

  app.use(createProxyMiddleware(config.baseUrl, {
    ...config,
    target      : config.targetUrl ?? 'http://proxy.com',
    changeOrigin: true,
    router (request) {
      const query = getQuery((request as IncomingMessage).url ?? '')
      const url   = new URL(query.url as string)

      return url.origin
    },
    pathRewrite (_path, request) {
      const query = getQuery((request as IncomingMessage).url ?? '')
      const url   = new URL(query.url as string)

      return `${url.pathname}${url.search}`
    },
    onProxyRes (proxyResponse, request, response) {
      if (config.downloadHeader) {
        const query = getQuery((request as IncomingMessage).url ?? '')

        if (query.download !== 'false') {
          const name     = query.name?.toString() ?? 'download'
          const type     = query.type?.toString() ?? 'attachment'
          const filename = config.downloadExt && !name.endsWith(config.downloadExt)
            ? `${name}${config.downloadExt}`
            : name

          proxyResponse.headers['content-disposition'] = `${type}; filename="${encodeURIComponent(filename)}"`
        }
      }

      if (config.onProxyRes)
        config.onProxyRes(proxyResponse, request, response)
    },
  }) as connect.NextHandleFunction)
}
