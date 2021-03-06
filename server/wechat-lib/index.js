import request from 'request-promise'
const base = 'https://api.weixin.qq.com/cgi-bin/'
// 'token?grant_type=client_credential&appid=APPID&secret=APPSECRET'
const api = {
  accessToken: base + 'token?grant_type=client_credential'
}

export default class Wechat {
  constructor (opts) {
    this.opts = Object.assign({}, opts)
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.fetchAccessToken()
  }

  async request (options) {
    options = Object.assign({},options, {json: true})
    try {
      const response = await request(options)
      // console.log(response)
      return response
    } catch (error) {
      console.error(error)
    }
  }
  async fetchAccessToken () {
    let data = await this.getAccessToken()
    console.log('mongo' + data)
    if(!this.isValidAccessToken(data)) {
      data = await this.UpdateAccessToken()
    }
    await this.saveAccessToken(data)
    return data
  }
  async UpdateAccessToken() {
    const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret
    const data = await this.request({url})
    const now = (new Date().getTime())
    const expiresIn = now + (data.expires_in - 20) * 100
    data.expires_in = expiresIn
    return data
  }
  isValidAccessToken(data) {
    if(!data || !data.access_token || !data.expires_in) {
      return false
    }
    const expiresIn = data.expires_in
    const now = (new Date().getTime())
    if(now < expiresIn) {
      return true
    } else {
      return false
    }

  }
}