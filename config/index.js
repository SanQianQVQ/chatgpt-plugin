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
  defaultUsePicture: true,
  // 每个人发起的对话保留时长。超过这个时长没有进行对话，再进行对话将开启新的对话。单位：秒
  conversationPreserveTime: 600,
  UA: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
  '2captcha': '46957a5e03b7e164656ef946fa38aa70'
}
