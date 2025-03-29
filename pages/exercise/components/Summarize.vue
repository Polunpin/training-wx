<template>
  <div class="summarize-wrap no-scrollbar">
    <!-- 标题 -->
    <div class="title-img">
      <image
        src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/summarize-title.png?sign=6765fcba62d3efeb4dc63d1d76704b46&t=1742308915"
        mode="scaleToFill"
      />
    </div>
    <!-- 练习表现 -->
    <div class="module">
      <div class="module-title">练习表现</div>
      <div class="module-content">
        <Score :dataList="performance" @handleStar="handleStar"/>
      </div> 
    </div>
    <!-- 复盘心得 -->
    <div class="module">
      <div class="module-title">复盘心得</div>
      <div class="module-content">
        <textarea class="textarea" v-model="insights"></textarea>
      </div>
    </div>
    <!-- 练习照片 -->
    <div class="module" >
      <div class="module-title">练习照片</div>
      <div class="module-content">
        <div class="upload-icon" @click="upLoadImg" v-if="!imgSrc">
          <image
            src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/upload-icon.png?sign=023d9cbc0ce80f6b756e6e7fb2b8e6ec&t=1742362256"
            mode="scaleToFill"
          />
        </div>
        <div class="upload-img" @click="upLoadImg" v-else>
          <image
            :src="imgSrc"
            mode="widthFix"
          />
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="btn-wrap">
      <div class="btn save-btn" @click="toSave">保存</div>
      <div class="btn save-see-btn" @click="toReport">保存并查看练习报告</div>
    </div>

  </div>
</template>
<script>
import Score from './Score.vue'
import {mapGetters} from "vuex";
export default {
  components: {
    Score
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  props: {
    reportId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      imgSrc: '',
      insights: '',
      performance: []
    }
  },
  mounted() {
    this.getDetialInfo()
  },
  methods: {
    // 获取详情接口
    async getDetialInfo() {
      const res = await this.$cloudService.call({
        path: '/comprehensive/getPracticeRecord',
        data: {
          id: this.reportId
        }
      })
      if (!res.data) return
      const {photos, insights, performance} = res.data
      this.imgSrc = photos
      this.insights = insights
      this.performance = performance
    },
    // 获取链接
    getUrl (fileID) {
      wx.cloud.getTempFileURL({
      fileList: [fileID], // 这里替换为你的文件 cloudPath
      success: res => {
        // fileList 是一个有相同 ID 的文件链接的数组
        this.imgSrc = res.fileList[0].tempFileURL
        // this.setData({
        //   imageSrc: tempFileURL
        // })
      },
      fail: err => {
        console.error(err)
      }
    })
    },
    // 上传接口
    async upLoadApi (file, path, onCall = () => {}) {
      await wx.cloud.init()
      return new Promise((resolve, reject) => {
        const task = wx.cloud.uploadFile({
          cloudPath: path,
          filePath: file,
          config: {
            env: 'prod-8gyjdhvibe4ef498' // 需要替换成自己的微信云托管环境ID
          },
          success: res => resolve(res.fileID),
          fail: e => {
            console.log(e)
            const info = e.toString()
            if (info.indexOf('abort') != -1) {
              reject(new Error('【文件上传失败】中断上传'))
            } else {
              reject(new Error('【文件上传失败】网络或其他错误'))
            }
          }
        })
        task.onProgressUpdate((res) => {
          if (onCall(res) == false) {
            task.abort()
          }
        })
      })
    },
    upLoadImg () {
      uni.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 从相册选择
        success: async (res) => {
           uni.showLoading({
            title: '图片上传中',
            mask: true
          })
          try {
            const result = await this.upLoadApi(res.tempFilePaths[0], `image/upload/upload-${Date.now()}.jpg`, (res) => {})
            await this.getUrl(result)
            uni.hideLoading()
            uni.showToast({
              icon: 'success',
              title: '图片上传成功'
            })
          } catch {
            uni.hideLoading()
            uni.showToast({
              icon: 'none',
              title: '网络错误，请检查网络',
              mask: true,
              duration: 2000
            })
          }
        }
      })
    },
    handleStar(list) {
      this.performance = list
      console.log(list)
    },
    async saveReport (callback) {
      let allRatesNonZero = this.performance ? this.performance.every(item => item.rate !== 0) : false;
      if (!allRatesNonZero) {
        uni.showToast({
          title: '请填写练习表现',
          icon: 'none',
          mask: true
        })
        return
      }
      if (!this.imgSrc) {
        uni.showToast({
          title: '请上传图片',
          icon: 'none',
          mask: true
        })
        return
      }
      
      const json = {
        id: this.reportId,
        photos: this.imgSrc,
        insights: this.insights,
        performance: JSON.stringify(this.performance)
      }
      console.log(json)
      const res = await this.$cloudService.call({
        path: '/practiceRecord/savePracticeRecord',
        method: 'POST',
        data: json
      })
      if (res.data) {
        callback()
      }
    },
    toSave () {
      this.saveReport(() => {
        this.$emit('toSave')
      })
    },
    toReport () {
      this.saveReport(() => {
        this.$emit('toReport')
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.summarize-wrap {
  height: 100%;
  overflow: auto;
  padding: 80rpx 24rpx;
  box-sizing: border-box;
  .title-img {
    width: 552rpx;
    height: 60rpx;
    margin: 0 auto 50rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .module {
    padding: 32rpx 0;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: -50%;
      display: block;
      height: 2rpx;
      width: 200%;
      background: rgba(247, 247, 247, 1);
      transform: scale(0.5);
    }
    &:last-child{
      &::after {
        display: none;
      }
    }
    .module-title {
      font-size: 40rpx;
      line-height: 40rpx;
      margin-bottom: 20rpx;
    }
    .module-content {
      padding: 0 22rpx;
      .textarea {
        padding: 24rpx;
        width: 100%;
        height: 312rpx;
        box-sizing: border-box;
        background: #F7F7F7;
        border-radius: 16rpx;
        font-size: 28rpx;
      }
      .upload-icon {
        width: 100%;
        box-sizing: border-box;
        height: 162rpx;
        border-radius: 16rpx;
        background: rgba(203, 226, 232, 0.13);
        display: flex;
        justify-content: center;
        align-items: center;
        image {
          width: 104rpx;
          height: 104rpx;
        }
      }
      .upload-img {
        width: 400rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .btn-wrap {
    padding: 56rpx 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      display: flex;
      justify-content: center;
      border-radius: 48rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #fff;
      padding: 16rpx 0;
    }
    .save-btn {
      background:  rgba(15, 65, 149, 0.74);
      width: 256rpx;
    }
    .save-see-btn {
      width: 350rpx;
      background:  #14AE5C;
      margin-left: 40rpx;
    }
  }
}
</style>