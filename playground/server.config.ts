import { getCookie, setHeader } from 'h3'
import { defineServer, defineEventInterceptor } from '../src/core'

export default defineServer([
  {
    name     : 'document',
    baseUrl  : '/api/document',
    targetUrl: process.env.COBA_BASEURL,
    schemaUrl: './sample.json',
    swagger  : {
      formatURL (url) {
        return url.replace('/external', '')
      },
    },
  },
  {
    name      : 'bin',
    baseUrl   : '/api/bin',
    targetUrl : 'https://httpbin.org',
    onProxyReq: defineEventInterceptor((proxyEvent, event) => {
      const token = getCookie(event, 'session/token')

      if (token)
        setHeader(proxyEvent, 'Authorization', `Bearer ${token}`)
    }),
  },
  {
    name          : 'force-download',
    baseUrl       : '/force/download',
    proxyType     : 'dynamic',
    allowFrom     : ['dummyjson.com', 'httpbin.org'],
    downloadExt   : '.pdf',
    downloadHeader: true,
  },
])
