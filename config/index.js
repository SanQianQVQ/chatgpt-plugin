const SESSION_TOKEN = ''
const CF_CLEARANCE = ''
const PROXY = ''
export const Config = {
  token: SESSION_TOKEN,
  cfClearance: CF_CLEARANCE,
  proxy: PROXY,
  username: '',
  password: '',
  // 改为true后，全局默认以图片形式回复，并自动发出Continue命令补全回答
  defaultUsePicture: false,
  // 每个人发起的对话保留时长。超过这个时长没有进行对话，再进行对话将开启新的对话。单位：秒
  conversationPreserveTime: 600,
}
