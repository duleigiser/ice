import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply'

import wechatMiddle from '../wechat-lib/middleware'
export let router = app => {
  let router = new Router()
  router.all('/wechat-hear', wechatMiddle(config.wechat, reply))
  app.use(router.routes())
     .use(router.allowedMethods())
}
console.log('router')