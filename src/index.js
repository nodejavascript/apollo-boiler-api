import 'dotenv/config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import helmet from 'helmet'
import cors from 'cors'
import http from 'http'
import internalIp from 'internal-ip'
import beep from 'beepbeep'
import path from 'path'

import routes from './routes'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import schemaDirectives from './directives'
import { launchMongo, connectToRedis, clearRedisKeys, launchMqtt, logContext } from './lib'

const { json } = express

const { NODE_ENV, APP_PORT, REDIS_CACHE_PREFIX_APIKEY } = process.env

const isLocal = NODE_ENV === 'local'

export const startGraphQLServer = async () => {
  console.clear()

  try {
    const app = express()

    const [ip] = await Promise.all([
      internalIp.v4(),
      launchMongo(),
      connectToRedis()
    ])

    await clearRedisKeys([REDIS_CACHE_PREFIX_APIKEY])

    app.set('view engine', 'pug')
    app.set('views', path.join(__dirname, '/views'))
    app.use(express.static(path.join(__dirname, '/public')))

    const origin = []
    isLocal && origin.push('http://localhost:3000')
    isLocal && origin.push(`http://${ip}:${APP_PORT}`)

    app.use(cors({
      origin,
      credentials: true
    }))

    const contentSecurityPolicy = isLocal ? false : undefined
    app.use(helmet({ contentSecurityPolicy }))

    app.disable('x-powered-by')

    app.use(async (req, res, next) => {
      next()
    })

    app.get('/favicon.ico', (req, res) => res.sendStatus(204))
    app.use('/ping', routes.ping)
    app.use('/', routes.root)

    app.use(json({ limit: '5mb' }))

    !isLocal && app.get('*', async (req, res, next) => {
      const err = new Error('404')
      err.status = 404
      res.sendStatus(404)
    })

    const playground = isLocal ? { settings: { 'request.credentials': 'include' } } : false
    const introspection = isLocal
    const debug = isLocal

    const formatResponse = (response, { context }) => {
      if (context && context.res && response.data) response.data.meta = context.res.meta
      return response
    }

    const context = async ({ req, res }) => {
      // these are incoming requests where you throw error BEFORE apollo query / mutation / subscription are executed

      await logContext({ description: 'context called on ApolloServer' })

      return { req, res }
    }

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      playground,
      introspection,
      debug,
      formatResponse,
      context
    })

    server.applyMiddleware({ app, cors: false })

    const httpServer = http.createServer(app)
    server.installSubscriptionHandlers(httpServer)

    await Promise.all([
      httpServer.listen({ port: APP_PORT }),
      launchMqtt(),
      logContext({ description: `API started on ${ip}` })
    ])

    // server.graphqlPath, server.subscriptionsPath are equal but they can be different, this is why they are logged for each
    isLocal && console.log(`SERVER: http://${ip}:${APP_PORT}${server.graphqlPath}`)
    isLocal && console.log(`SUBSCRIPTIONS: ws://${ip}:${APP_PORT}${server.subscriptionsPath}`)
    isLocal && console.log(`SSR: http://${ip}:${APP_PORT}`)
    isLocal && console.log(`LOCAL: http://localhost:${APP_PORT}`)
    isLocal && beep(1)
  } catch (err) {
    console.error('halt and catch fire', err)
  }
}
