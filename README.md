# yunzai-chatgpt
云崽qq机器人的chatgpt插件
## 不稳定分支注意
本分支用于测试自动登录功能，为解决OpenAI开启Cloudflare防护功能的问题，使用puppeteer操作表单自动登录。不需要填写token，只需在`config/index.js`下配置用户名密码即可。

当然，如果填了token会优先使用token，但由于Cloudflare的限制，必须也填写CF_CLEARANCE，然而该值30分钟就会过期。参见https://github.com/transitive-bullshit/chatgpt-api

此外，需要机器人登录和发送请求所在ip相同，目前支持设置登录使用proxy，同样在config中配置。但发送请求目前由于库的限制不支持代理。为了保证ip一致，可能需要开启透明代理，如clash premium的tun模式。待chatgpt-api库更新支持proxy后，此问题将解决。

Q：可以都不使用代理吗？这样就保证IP地址一致了。\
A：在国内可能无法登录OpenAI，所以第一关登录就过不去。当然如果你的服务器部署在境外能够登录OpenAI的地区，可以尝试不使用代理。

## 版本要求
Node.js >= 18
## 安装
进入yunzai根目录
1. 安装依赖
```
pnpm add -w chatgpt undici showdown mathjax-node puppeteer-extra puppeteer-extra-plugin-stealth
```
> chatgpt从2.0开始支持Conversation，因此要求依赖chatgpt版本要大于2.0.0，如果使用了低版本导致报错可使用`pnpm update`更新一下。
>
> 注意目前加入Cloudflare防护后，需要升级到2.1.0以上。
2. 克隆项目
```
git clone https://github.com/ikechan8370/chatgpt-plugin.git ./plugins/chatgpt-plugin
```
3. 修改配置
编辑`plugins/chatgpt/config/index.js`文件主要修改其中的`username`和`password`配置，修改为你的openai账号和密码。或者配置token，token获取参见后文，token目前的限制参见前文。

## 使用

### 基本使用
@机器人 发送聊内容即可
![img.png](resources/img/example1.png)
发挥你的想象力吧！

### 获取帮助
发送#chatgpt帮助

## 关于openai token获取
1. 注册openai账号
进入https://chat.openai.com/ ，选择signup注册。目前openai不对包括俄罗斯、乌克兰、伊朗、中国等国家和地区提供服务，所以自行寻找办法使用其他国家和地区的ip登录。此外，注册可能需要验证所在国家和地区的手机号码，如果没有国外手机号可以试试解码网站，收费的推荐https://sms-activate.org/。
2. 获取token
注册并登录后进入https://chat.openai.com/chat ，打开浏览器检查界面（按F12），找到图中所示的token值完整复制即可。
![image](https://user-images.githubusercontent.com/21212372/205806905-a4bd2c47-0114-4815-85e4-ba63a10cf1b5.png)

其他问题可以参考使用的api库https://github.com/transitive-bullshit/chatgpt-api


## 其他

该api响应速度可能由于模型本身及网络原因不会太快，请勿频繁重发。后续准备加入限速等功能。因网络问题和模型响应速度问题可能出现500、503、404等各种异常状态码，此时等待官方恢复即可。实测复杂的中文对话更容易触发503错误（超时）。如出现429则意味着超出了免费账户调用频率，只能暂时停用，放置一段时间再继续使用。

openai目前开放chatgpt模型的免费试用，在此期间本项目应该都可用，后续如果openai调整其收费策略，到时候视情况进行调整。

如果在linux系统上发现emoj无法正常显示，可以搜索安装支持emoj的字体，如Ubuntu可以使用`sudo apt install fonts-noto-color-emoji`

## 感谢
* https://github.com/transitive-bullshit/chatgpt-api
* https://chat.openai.com/

![Alt](https://repobeats.axiom.co/api/embed/076d597ede41432208435f233d18cb20052fb90a.svg "Repobeats analytics image")
