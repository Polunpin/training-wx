// 在一个全局的 service / utility 模块中
export default {
    data: {
        cloud: null, resourceAppid: 'wx5745b3f0a911e8d8', // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
        resourceEnv: 'prod-8gyjdhvibe4ef498',
    }, async init() {
        if (this.data.cloud == null) {
            const cloud = new wx.cloud.Cloud({
                resourceAppid: this.data.resourceAppid, resourceEnv: this.data.resourceEnv, traceUser: true,
            })
            await cloud.init()
            this.data.cloud = cloud
        }
    }, async call(obj, number = 0) {
        if (this.data.cloud == null) {
            await this.init()
        }
        try {
            const result = await this.data.cloud.callContainer({
                path: obj.path, method: obj.method || 'GET', header: {
                    'X-WX-SERVICE': 'huanx-server'
                }, config: {
                    "env": this.data.resourceEnv
                }, data: obj.data,
            })

            console.log(`微信云托管调用结果${result.errMsg} | callid:${result.callID}`)
            return result.data
        } catch (e) {
            const error = e.toString()
            if (error.indexOf("Cloud API isn't enabled") !== -1 && number < 3) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(this.call(obj, number + 1))
                    }, 300)
                })
            } else {
                throw new Error(`微信云托管调用失败${error}`)
            }
        }
    }
}

