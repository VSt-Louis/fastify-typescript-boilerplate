import * as Fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import { connect } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const env = process.env.NODE_ENV
const port = process.env.PORT || 5000
const host = process.env.HOST || '0.0.0.0'
const dbUrl = env === 'prod' ? process.env.DB_URL : process.env.DB_URL_DEV
if (!dbUrl) throw new Error('process.env.DB_URL was not found')

const fastify: Fastify.FastifyInstance = Fastify.fastify({
  logger: true,
})

// Api versions (as subservers)
import v1 from './Versions/v1/server'

const start = async () => {
  // connect mongoose
  await connect(dbUrl, {}).then(m => {
    console.log(
      `Connected to db: ${m.connections.map(c => `${c.name} at ${c.host}`)}`
    )
  })

  // register the cors plugin
  await fastify.register(fastifyCors, {
    origin: '*',
  })

  // register api versions with their respective prefix
  await fastify.register(v1, { prefix: 'v1' })

  fastify.listen(port, host)
}
start()
