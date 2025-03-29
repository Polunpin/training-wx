<script>
	import {RunningService} from './pages/exercise/running/js/RunningService'
	export default {
		onLaunch: async function(options) {
			RunningService.shared.reset()
			RunningService.shared.timerStop()
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
			wx.getStorage({
				key: 'hasLaunched',
				success: function(res){
					// 如果获取到标记，说明不是首次访问
					// 检查是否有分享路径
					if (options.path) {
						// 如果有分享路径，直接跳转到分享的页面
						wx.redirectTo({
							url: '/' + options.path
						})
					} else {
						// 如果没有分享路径，跳转到主页
						wx.redirectTo({
							url: '/pages/index/index'
						})
					}
				},
				fail: function(){
					// 如果没有获取到标记，说明是首次访问，跳转到提示页
					wx.redirectTo({
						url: '/pages/index/guide'
					})
					// 在本地存储中设置标记，表示已经访问过
					wx.setStorage({
						key: 'hasLaunched',
						data: 'true'
					})
				}
			})

			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},

		methods: {
		}
	}
</script>

<style>
	/*每个页面公共css */
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>