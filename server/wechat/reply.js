const tip = '我的卡丽熙，欢迎来到河间地\n<a>dfadfaf</a>'
export default async(ctx, next) => {
  // console.log(ctx)
  const message = ctx.weixin
  // console.log(ctx.message);
  // ctx.body = tip

  if(message.MsgType === 'text') {
    ctx.body = message.Content
  } else if (message.MsgType === 'image') {
    ctx.body=''
  }
}