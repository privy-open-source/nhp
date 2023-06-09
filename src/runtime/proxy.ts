import connect from 'connect'
import { fromNodeMiddleware } from 'h3'
import addDynamicProxy from './proxy/dynamic'
import addBasicProxy from './proxy/basic'
import config from '~/server.config'

const app = connect()

for (const server of config) {
  if (server.proxyType === 'dynamic')
    addDynamicProxy(app, server)
  else
    addBasicProxy(app, server)
}

export default fromNodeMiddleware(app)
