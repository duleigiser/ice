import Koa from 'koa'
import R from 'ramda'
import { resolve } from 'path'
import {
  Nuxt,
  Builder
} from 'nuxt'

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

const r = path => resolve(__dirname, path)
const config = require('../nuxt.config.js')
config.dev = !(process.env === 'production')
const MIDDLEWARE = ['database', 'router']

class Server {
  constructor() {
    this.app = new Koa()
    this.useMiddleWares(this.app)(MIDDLEWARE)
  }
  useMiddleWares(app) {
    return R.map(R.compose(
      R.map(i => i(app)),
      require,
      i => `${r('./middlewares')}/${i}`
      )
    )
  }
  async start() {
    const nuxt = await new Nuxt(config)

    if (config.dev) {
      const builder = new Builder(nuxt)
      await builder.build()
    }

    this.app.use(ctx => {
      ctx.status = 200
      ctx.respond = false // Mark request as handled for Koa
      ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
      nuxt.render(ctx.req, ctx.res)
    })

    this.app.listen(port, host)
    console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
  }
}

const app = new Server()
app.start()


