<template>
  <div class="running-wrap">
    <!-- Header -->
    <Header :headerInfo="{img: 1}"/>
    <map id="running-map"
         :polyline="polyline"
         :scale="18"
         class="map"
         enable-3D
         enable-rotate
         enable-zoom
         show-compass
         show-location
         :style="{height: `calc(100vh - ${headerTop.top + headerTop.height + 5}px)`}"
         :latitude="currentLocation.latitude"
         :longitude="currentLocation.longitude"
    />
    <!-- 进行中信息 -->
    <div class="running-info">
      <div class="info-content">
        <div class="content-item">
          <span class="item-count">{{ distance }}</span>
          <span class="item-name">总距离(Km)</span>
        </div>
        <div class="content-item">
          <span class="item-count">{{ duration }}</span>
          <span class="item-name">总时间(min)</span>
        </div>
        <div class="content-item">
          <span class="item-count">{{ speed }}</span>
          <span class="item-name">当前速度(km/h)</span>
        </div>
      </div>
      <div class="info-btn">
        <!-- <div class="btn btn-pause" @click="handleStart">开始</div> -->
        <div class="btn btn-pause" v-if="status === 'start'" @click="handlePause">
          <image
              src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/icon-pause.png?sign=032b9f87db928060cc4772191f7c0730&t=1742305672"
              mode="scaleToFill"
          />
          暂停
        </div>
        <div class="btn btn-resume" v-if="status === 'paused'" @click="handleResume">
          <image
              src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/icon-continue.png?sign=032b9f87db928060cc4772191f7c0730&t=1742305672"
              mode="scaleToFill"
          />
          继续
        </div>
        <div class="btn btn-stop" @longpress="handleStop">
          <image
              src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/icon-stop.png?sign=032b9f87db928060cc4772191f7c0730&t=1742305672"
              mode="scaleToFill"
          />
          长按结束
        </div>
      </div>
      <!-- 提示 -->
      <div class="tips">请在保证安全的情况下操作</div>
    </div>
    <!-- 定位 -->
    <div class="right-icon">
      <div class="icon-btn icon-loaction" @click="resetLocation">
        <image
            class="btn-img"
            src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/icon-loaction.png?sign=faf4323514a014a860baaf6f0cffe33b&t=1742391174"
            mode="scaleToFill"
        />
      </div>
    </div>
    <!-- 倒计时 -->
    <div class="count-down" v-if="countDown>0">
      <text>{{ countDown }}</text>
    </div>
    <!-- 信息 -->
    <div class="summarize-popup"
         :style="{height: showSummarizePopup ? `calc(100vh - ${headerTop.height + headerTop.top + 10}px)` : 0}"
    >
      <div class="popup-content" v-if="showSummarizePopup">
        <div class="close-box" @touchend.stop="closePopup"></div>
        <Summarize :reportId="reportId" @toSave="toSave" @toReport="toReport"/>
      </div>
    </div>
  </div>
</template>
<script>
import {RunningService} from './js/RunningService'
import {eventBus} from "./js/EventBus";
import {TrackUtil} from "./js/TrackUtil";
import Summarize from '../components/Summarize.vue'
import Header from '@/components/header.vue'
import {mapGetters} from "vuex"

export default {
  components: {
    Summarize,
    Header
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  data() {
    return {
      practiceId: 0,
      reportId: 0,
      showSummarizePopup: false,
      status: RunningService.shared.status,
      currentLocation: {
        latitude: 22.683619,
        longitude: 110.201161,
      },
      size: 120,
      polyline: [],
      // sheetHeight: 0,
      // fontSize: 20,
      distance: '0.0',
      // accuracy: '--',
      // calorie: '0',
      speed: '0.0',
      avgSpeed: '0\'00',
      duration: '0:00',
      countDown: 3
      // minSize: 0.45,
      // maxSize: 1
    }
  },
  onShow() {
    this.setCountDown()
  },
  onReady() {
    // this.createSelectorQuery()
    //   .select(".sheet")
    //   .node()
    //   .exec(res => {
    //     const sheetContext = res[0].node
    //     sheetContext.scrollTo({
    //         size: 1,
    //         animated: true,
    //         duration: 0,
    //         easingFunction: 'ease'
    //     })
    //   })
  },
  async onLoad(options) {
    if (!this.userinfo) {
      await this.$store.dispatch('initUserinfo')
    }
    this.practiceId = options.id
    if (RunningService.shared.location) {
      this.currentLocation = RunningService.shared.location
      RunningService.shared.mapContent.moveToLocation(RunningService.shared.location)
    }

    console.log(options)
    eventBus.on('status', (data) => {
      if (data === undefined) {
        return
      }
      console.log('status 状态变化')
      this.status = data
    })

    eventBus.on('location', (data) => {
      if (data === undefined) {
        return
      }
      console.log('location 状态变化')
      this.currentLocation = data
    })
    eventBus.on('points', (data) => {
      if (data === undefined) {
        return
      }
      console.log('points 状态变化')
      const polyline = {
        points: data || [],
        borderColor: '#ffffff',
        borderWidth: 1,
        level: "abovelabels",
        dottedLine: false,
        color: '#16dd90',
        width: 7,
        arrowLine: false,
      }
      this.polyline = [polyline]
    })
    eventBus.on('distance', (data) => {
      console.log('distance 状态变化', data)
      this.distance = TrackUtil.metersToKilometers(data)
    })

    eventBus.on('duration', (data) => {
      if (data === undefined) {
        return
      }
      console.log('duration 状态变化')
      // 计算配速
      const speed = TrackUtil.calculatePaceFromSpeed(RunningService.shared.speed)
      const avgSpeed = TrackUtil.calculateAveragePace(RunningService.shared.distance, data)
      this.speed = speed
      this.avgSpeed = avgSpeed
      this.duration = TrackUtil.formatSeconds(data)
    })
  },
  mounted() {
  },
  methods: {
    // 倒计时
    setCountDown() {
      let countDown = this.countDown;
      if (countDown <= 0) {
        RunningService.shared.confrimStart()
        return;
      }
      setTimeout(() => {
        this.countDown--
        this.setCountDown();
      }, 1000);
    },
    // handleStart() {
    //   RunningService.shared.start()
    // },
    handlePause() {
      RunningService.shared.pause()
    },
    handleStop() {
      RunningService.shared.stop({
        userId: this.userinfo.id,
        practiceId: this.practiceId,
      }, (id) => {
        this.reportId = id
        this.showSummarizePopup = true
      })
    },
    handleResume() {
      RunningService.shared.resume()
    },
    resetLocation() {
      RunningService.shared.resetMap()
    },
    closePopup() {
      uni.reLaunch({url: '/pages/index/index'})
    },
    toSave() {
      uni.reLaunch({url: '/pages/index/index'})
    },
    toReport() {
      uni.redirectTo({url: `/pages/exercise/report?id=${this.reportId}`})
    }
  }
}
</script>
<style lang="scss" scoped>
.running-wrap {
  .map {
    width: 100vw;
  }

  .right-icon {
    position: fixed;
    right: 34rpx;
    bottom: 650rpx;
    z-index: 10;

    .icon-btn {
      padding: 16rpx 16rpx 8rpx 16rpx;
      background: #fff;
      border-radius: 20rpx;
      box-shadow: 0 2px 48px 0 rgba(0, 0, 0, 0.08);

      .btn-img {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }

  .running-info {
    z-index: 100;
    position: absolute;
    bottom: 160rpx;
    width: calc(100% - 60rpx);
    margin: 0 30rpx;
    background: #fff;
    border-radius: 24rpx;
    padding: 48rpx 32rpx;
    box-sizing: border-box;
    box-shadow: 0 4px 12px 0;

    .info-content {
      display: flex;

      .content-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;

        .item-count {
          font-family: system-ui;
          font-size: 58rpx;
          font-weight: 600;
          line-height: 60rpx;
        }

        .item-name {
          font-size: 26rpx;
          color: #6C6C6D;
          margin-top: 16rpx;
        }
      }
    }

    .info-btn {
      display: flex;
      justify-content: center;
      align-items: center;

      .btn {
        flex: 1;
        padding: 20rpx 0;
        background: #9FA2A8;
        border-radius: 80rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: #fff;
        font-weight: 500;
        font-size: 36rpx;
        margin-top: 48rpx;

        &:not(:first-child) {
          margin-left: 26rpx;
        }

        image {
          margin-right: 10rpx;
        }
      }

      .btn-pause {
        background: #F8DD00;

        image {
          width: 48rpx;
          height: 48rpx;
        }
      }

      .btn-resume {
        background: #1B9B47;

        image {
          width: 32rpx;
          height: 36rpx;
        }
      }

      .btn-stop {
        background: #FF3030;

        image {
          width: 48rpx;
          height: 48rpx;
        }
      }
    }

    .tips {
      font-size: 20rpx;
      color: rgba(0, 0, 0, 0.38);
      text-align: right;
      padding-right: 30rpx;
      margin-top: 10rpx;
    }
  }

  .count-down {
    position: absolute;
    z-index: 102;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: green;

    text {
      font-size: 260rpx;
      line-height: 260rpx;
      color: #fff;
      animation: scale 1s infinite;
    }
  }

  @keyframes scale {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(0);
    }
  }
}

.summarize-popup {
  position: fixed;
  z-index: 200;
  width: 100%;
  bottom: 0;
  left: 0;
  border-radius: 32rpx 32rpx 0 0;
  overflow: hidden;
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.2);
  transition: all 0.3s;

  .popup-content {
    height: 100%;
    position: relative;

    .close-box {
      width: 100%;
      height: 40rpx;;

      &::after {
        content: '';
        position: absolute;
        top: 16rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 64rpx;
        height: 8rpx;
        background: rgba(3, 16, 42, 0.16);
        border-radius: 8rpx;
      }
    }
  }

}
</style>