<script>
	import {
		get,
		post
	} from '@/utils/request.js'
	export default {
		onLaunch: async function() {
			const unionid = uni.getStorageSync('unionid');
			const updateManager = wx.getUpdateManager();
			updateManager.onUpdateReady(function () {
			  wx.showModal({
			    title: '更新提示',
			    content: '新版本已经准备好，是否重启应用？',
			    success(res) {
			      if (res.confirm) {
			        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
			        updateManager.applyUpdate()
			      }
			    }
			  })
			})
			if (!unionid) {
				await this.wxLogin()
			}
			this.getPersonalInfo()
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			//获取个人信息
			getPersonalInfo() {
				get('/lessonManagement/personalInfo', {
					unionId: uni.getStorageSync('unionid')
				}).then(res => {
					this.$store.commit('setUserinfo', res)
				})
			},
			wxLogin() {
				const _this = this
				return new Promise((resovle, reject) => {
					wx.login({
						success(res) {
							if (res.code) {
								get('/weCom/jsCode2session', {
									jsCode: res.code
								}).then(res => {
									const data = JSON.parse(res)
									if (data.unionid) {
										uni.setStorageSync('openid', data.openid)
										uni.setStorageSync('unionid', data.unionid)
										resovle(data.unionid)
										console.log('成功获取unionid:', data.unionid);
									} else {
										reject('获取unionid失败')
										console.error('获取unionid失败:', data);
									}
								})
								// 	wx.request({
								// 		url: 'https://api.weixin.qq.com/sns/jscode2session',
								// 		data: {
								// 			appid: 'wx5745b3f0a911e8d8',
								// 			secret: '9a4e5d01d729f1b9951b7d37a3375da0',
								// 			js_code: res.code,
								// 			grant_type: 'authorization_code'
								// 		},
								// 		success(res) {
								// 			if (res.data.unionid) {
								// 				uni.setStorageSync('unionid', res.data.unionid)
								// 				resovle(res.data.unionid)
								// 				console.log('成功获取unionid:', res.data.unionid);
								// 			} else {
								// 				reject(res.data.errmsg)
								// 				console.error('获取unionid失败:', res.data.errmsg);
								// 			}
								// 		},
								// 		fail(err) {
								// 			reject(err)
								// 			console.error('请求失败:', err.errMsg);
								// 		}
								// 	});
								// } else {
								// 	console.log('登录失败！' + res.errMsg);
							}
						}
					});
				})

			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>