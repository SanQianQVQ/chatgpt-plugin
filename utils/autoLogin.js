import lodash from 'lodash'
import cfg from '../../../lib/config/config.js'
import { Config } from '../config/index.js'
// import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import delay from 'delay'

let puppeteer = {}

class Puppeteer {
  constructor () {
    let args = [
      '--disable-gpu',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox'
      // '--shm-size=1gb'
    ]
    if (Config.proxy) {
      args.push(`--proxy-server=${Config.proxy}`)
    }
    this.browser = false
    this.lock = false
    this.config = {
      headless: false,
      args
    }

    if (cfg.bot?.chromium_path) {
      /** chromium其他路径 */
      this.config.executablePath = cfg.bot.chromium_path
    }

    this.html = {}
  }

  async initPupp () {
    if (!lodash.isEmpty(puppeteer)) return puppeteer
    puppeteer = (await import('puppeteer-extra')).default
    // const RecaptchaPlugin = (await import('puppeteer-extra-plugin-recaptcha')).default
    const pluginStealth = StealthPlugin()
    // const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default
    puppeteer.use(pluginStealth)
    if (Config['2captcha']) {
      puppeteer.use(
        RecaptchaPlugin({
          provider: {
            id: '2captcha',
            token: Config['2captcha'] // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
          },
          visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
        })
      )
    }

    return puppeteer
  }

  /**
     * 初始化chromium
     */
  async browserInit () {
    await this.initPupp()
    if (this.browser) return this.browser
    if (this.lock) return false
    this.lock = true

    logger.mark('puppeteer Chromium 启动中...')

    /** 初始化puppeteer */
    this.browser = await puppeteer.launch(this.config).catch((err) => {
      logger.error(err.toString())
      if (String(err).includes('correct Chromium')) {
        logger.error('没有正确安装Chromium，可以尝试执行安装命令：node ./node_modules/puppeteer/install.js')
      }
    })

    this.lock = false

    if (!this.browser) {
      logger.error('puppeteer Chromium 启动失败')
      return false
    }

    logger.mark('puppeteer Chromium 启动成功')

    /** 监听Chromium实例是否断开 */
    this.browser.on('disconnected', (e) => {
      logger.error('Chromium实例关闭或崩溃！')
      this.browser = false
    })

    return this.browser
  }
}

class ChatGPTPuppeteer extends Puppeteer {
  async login (token = '', cfClearance = '') {
    await this.browserInit()
    try {
      const page = await this.browser.newPage()
      // await page.setViewport({
      //   width: 1920 + Math.floor(Math.random() * 100),
      //   height: 3000 + Math.floor(Math.random() * 100),
      //   deviceScaleFactor: 1,
      //   hasTouch: false,
      //   isLandscape: false,
      //   isMobile: false
      // })
      // await page.setJavaScriptEnabled(true)
      // await page.setDefaultNavigationTimeout(0)
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en'
      })
      let preCookies = await redis.get('CHATGPT:COOKIES')
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36')

      if (preCookies) {
        preCookies = JSON.parse(preCookies)
        for (let i = 0; i < preCookies.length; i++) {
          await page.setCookie(preCookies[i])
        }
        await page.goto('https://chat.openai.com/chat')
        await page.waitForXPath('//*[text()="ChatGPT"]')
      } else {
        await page.goto('https://chat.openai.com/auth/login')
        try {
          await page.waitForXPath('//*[text()="Welcome to ChatGPT"]', { timeout: 10000 })
        } catch (e) {
          logger.info('可能遇到验证码')
          // throw e
          let recaptchas = await page.findRecaptchas()
          while (recaptchas && recaptchas.captchas?.length > 0) {
            logger.info('遇到hCaptcha验证码')
            if (Config['2captcha']) {
              logger.info('配置了验证码方案，尝试解决验证码')
              await page.solveRecaptchas()
              await page.waitForNavigation()
              recaptchas = await page.findRecaptchas()
              logger.info('解决了验证码')
            } else {
              throw e
            }
          }
          try {
            const checkbox = await page.waitForXPath('//div[@class="ctp-checkbox-container"]', { timeout: 5000 })
            logger.info('找到了checkbox')
            await checkbox.click()
            await page.evaluate(() => {
              document.querySelector('#cf-stage > div.ctp-checkbox-container > label > input[type=checkbox]'.click())
            })
            logger.info('模拟点击checkbox')
          } catch (e) {
            // 没遇到点击验证
            await page.waitForXPath('//*[text()="Welcome to ChatGPT"]')
          }
        }
        await page.waitForNavigation()
        const loginBtn = await page.waitForXPath('//button[contains(text(),"Log in")]')
        logger.info('找到了Log in按钮')
        await loginBtn.evaluate(btn => btn.click())
        // await page.evaluate(() => {
        //   document.querySelector('#__next > div > div > div.flex.flex-row.gap-3 > button:nth-child(1)').click()
        // })
        await page.waitForNavigation()
        // await loginBtn.click()
        logger.info('模拟点击Log in按钮')
        const usernameInput = await page.waitForXPath('//input[@id="username"]')
        await usernameInput.type(Config.username)
        logger.info('输入用户名')
        // let continueBtn = await page.waitForXPath('//button[@type=submit]')
        // await continueBtn.click()
        await page.evaluate(() => {
          document.querySelector('body > main > section > div > div > div > form > div.cb519a6e5 > button').click()
        })
        logger.info('模拟点击Continue按钮')
        await page.waitForNavigation()
        const passwordInput = await page.waitForXPath('//input[@id="password"]')
        await passwordInput.type(Config.password)
        logger.info('输入密码')
        // continueBtn = await page.waitForXPath('//button[@type=submit]')
        // await continueBtn.click()
        await page.evaluate(() => {
          document.querySelector('body > main > section > div > div > div > form > div.cb519a6e5 > button').click()
        })
        logger.info('模拟点击Continue按钮')
        await page.waitForNavigation()
        logger.info('登录成功，开始查询cookie')
      }
      let cookies = await page.cookies()
      await redis.set('CHATGPT:COOKIES', JSON.stringify(cookies))
      await this.browser.close()
      return handleCookie(cookies)
    } catch (e) {
      logger.error(e)
      this.browser.close()
      throw e
    }
  }
}

export function handleCookie (cookies) {
  let cookieArr = {}
  cookies.forEach(c => {
    cookieArr[c.name] = c.value
  })
  return cookieArr
}

export default new ChatGPTPuppeteer()
