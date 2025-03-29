<template>
  <div class="exercise-record">
    <!-- 头部 -->
    <Header  @handleClick="backHome" :headerInfo="headerInfo" :isHasClick="!pagetype"></Header>
    <!-- 内容 -->
    <div class="page-info no-scrollbar" v-if="!pageLoading">
      <!-- 基本数据 -->
      <div class="module-base">
        <!-- 信息 -->
        <div class="base-info"> 
          <div class="info-box">
            <image class="title-icon" src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/record-base-icon.png?sign=9471c86d37d63201dc9ea755e00e659e&t=1742122911" />
            <div class="box-content">
              <text class="title">{{detailInfo.title}}</text>
              <text class="date">{{detailInfo.consumptionTime}}</text>
            </div>
          </div>
          <!-- <div class="info-count"><text>{{detailInfo.distance}}</text>公里</div> -->
        </div>
        <!-- 记录图 -->
        <div class="base-map">
          <map
            :include-points="detailInfo.trajectory"
            id="track-review-map"
            class="track-preview-map"
            :enable-zoom="false"
            :enable-scroll="false"
            :polyline="polyline">
          </map>
        </div>
      </div>
      <!-- 驾驶数据 -->
      <div class="module module-driving">
        <div class="module-title">驾驶数据</div>
        <div class="driving-data">
          <div class="data-item">
            <div class="item-count" style="color: #1B9B47;">{{detailInfo.duration}}</div>
            <div class="item-name">总耗时</div>
          </div>
          <div class="data-item">
            <div class="item-count">{{detailInfo.distance}}</div>
            <div class="item-name">路程(km)</div>
          </div>
          <div class="data-item">
            <div class="item-count">{{detailInfo.avgSpeed}}</div>
            <div class="item-name">平均速度(km/h)</div>
          </div>
          <div class="data-item">
            <div class="item-count">{{detailInfo.maxSpeed}}</div>
            <div class="item-name">最高时速(km/h)</div>
          </div>
          <div class="data-item">
            <div class="item-count" style="color: #B02511;">{{detailInfo.suddenBrakeCount}}</div>
            <div class="item-name">急刹车(次数)</div>
          </div>
          <div class="data-item">
            <div class="item-count">+{{detailInfo.suddenBrakeCount || 0}}</div>
            <div class="item-name">安全指数</div>
          </div>
        </div>
      </div>
      <!-- 练习表现 -->
      <div class="module moudle-performance">
        <div class="module-title">练习表现</div>
        <div class="module-content"><Score :dataList="detailInfo.performance" :isClick="false"/></div>
      </div>
      <!-- 练习心得 -->
      <div class="module module-learning" v-if="detailInfo.insights">
        <div class="module-title">练习心得</div>
        <div class="module-content learning-content">{{detailInfo.insights}}</div>
      </div>
       <!-- 练习照片 -->
       <div class="module module-photo" v-if="detailInfo.photos">
        <div class="module-title">练习照片</div>
        <div class="module-content photo-content">
          <image :src="detailInfo.photos" mode="widthFix"></image>
        </div>
      </div>
      <!-- 返回按钮 -->
      <div class="bottom">
        <div class="bottom-btn" @click="editRecord">修改练习记录</div>
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="summarize-popup"
      :style="{height: showSummarizePopup ? `calc(100vh - ${headerTop.height + headerTop.top + 10}px)` : 0}"
    >
      <div class="popup-content" v-if="showSummarizePopup">
        <div class="close-box" @touchend.stop="closePopup"></div>
        <Summarize :reportId="id" @toSave="toSave" @toReport="toReport"/>
      </div>
    </div>
  </div>
</template>
<script>
import Score from './components/Score.vue'
import Header from '@/components/header'
import Summarize from './components/Summarize.vue'
export default {
  components: {
    Score,
    Header,
    Summarize
  },
  data() {
    return {
      pagetype: '',
      id: 0,
      showSummarizePopup: false,
      // latitude: 22.683619,
      // longitude: 110.201161,
      headerInfo: {},
      detailInfo: null,
      pageLoading: true,
      polyline: [],
      mapContext: null,
      startIcon: 'https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/start-pin.png?sign=2a491eadfa6a7ef63f7e70ce502043f2&t=1743056043',
      endIcon: 'https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/end-pin.png?sign=2a491eadfa6a7ef63f7e70ce502043f2&t=1743056043',
    }
  },
  async onLoad(option) {
    this.id = option.id || 0
    this.pagetype = option.type || ''
    this.headerInfo = {
      title: '练习报告',
      img: this.pagetype === '' ? 'https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/common/close-btn.png?sign=b5792d84ce731aefcc95f0a4a5e70f28&t=1742119904' : ''
    }
    this.mapContext = await wx.createMapContext("track-review-map");
    this.getDetail()
  },
  methods: {
    closePopup () {
      this.showSummarizePopup = false
    },
    editRecord () {
      this.showSummarizePopup = true
    },
    async getDetail () {
      const res = await this.$cloudService.call({
        path: '/comprehensive/getPracticeRecord',
        data: {
          id: this.id
        }
      })
      this.pageLoading = false
      if (res.data) {
        this.polyline = [{
          points:  res.data.trajectory || [],
          borderColor: '#ffffff',
          borderWidth: 1,
          level: "abovelabels",
          dottedLine: false,
          color: '#16dd90',
          width: 7,
          arrowLine: false,
        }]
        if (res.data.trajectory && res.data.trajectory.length && res.data.trajectory.length > 1) {
          this.mapContext.addMarkers({
            markers: [
              {
                height: 26,
                iconPath: this.startIcon,
                id: 300,
                width: 26,
                latitude: res.data.trajectory[0].latitude,
                longitude: res.data.trajectory[0].longitude,
              },
              {
                height: 26,
                iconPath: this.endIcon,
                id: 301,
                width: 26,
                latitude: res.data.trajectory[res.data.trajectory.length -1].latitude,
                longitude: res.data.trajectory[res.data.trajectory.length -1].longitude,
              }
            ]
          })
        }
        this.detailInfo = res.data
      }
    
    },
    toSave () {
      this.closePopup()
      this.getDetail()
    },
    toReport () {
      this.closePopup()
      this.getDetail()
    },
    backHome () {
      uni.reLaunch({ url: '/pages/index/index' })
    }
  },
  mounted() {
  }
}
</script>
<style lang="scss" scoped>
.exercise-record {
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .page-info {
    flex: 1;
    overflow: auto;
    .module-base {
      .base-info {
        padding: 32rpx 26rpx;
        .info-box {
          display: flex;
          // justify-content: space-between;
          align-items: center;
          .title-icon {
            width: 70rpx;
            height: 70rpx;
            margin-right: 4rpx;
          }
          .box-content {
            display: flex;
            flex-direction: column;
            .title {
              font-size: 36rpx;
              font-weight: bold;
              color: #000;
            }
            .date {
              font-size: 24rpx;
              color: rgba(108, 108, 109, 1);
            }
          }
          
        }
        .info-count {
          font-size: 56rpx;
          line-height: 56rpx;
          margin-top: 16rpx;
          text {
            font-size: 120rpx;
            font-weight: 600;
            line-height: 120rpx;
          }
        }
      }
      .base-map {
        width: 100%;
        height: 450rpx;
        background: #eee;
        border-radius: 0 0 24rpx 24rpx;
        .track-preview-map {
          width: 100%;
          height: 100%;
        }
      }
    }
    .module {
      padding-bottom: 32rpx;
      position: relative;
      margin: 32rpx 32rpx 0;
      .module-title{
        font-size: 32rpx;
        margin-bottom: 32rpx;
      }
      .module-content {
        padding: 0 20rpx;
      }
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
      &.module-driving {
       .driving-data{
        display: flex;
        flex-wrap: wrap;
        padding: 0 16rpx;
        margin-top: -40rpx;
        .data-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 50%;
          margin-top: 40rpx;
          .item-count {
            font-size: 64rpx;
            font-weight: bold;
            .unit {
              font-size: 28rpx;
            }
          }
          .item-name {
            font-size: 32rpx;
            color: rgba(111, 111, 111, 1)
          }
        }
       }
      }
      &.module-learning {
        margin-left: 0;
        margin-right: 0;
        padding: 0 32rpx 32rpx;
        .learning-content {
          font-size: 28rpx;
          color: rgba(29, 30, 34, 1)
        }
      }
      &.module-photo{
        margin-left: 0;
        margin-right: 0;
        padding: 0 32rpx 32rpx;
        .photo-content {
          width: 400rpx;
          image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .bottom {
      box-sizing: border-box;
      width: 100%;
      padding-left: 32rpx;
      padding-right: 32rpx;
      padding-top: 16rpx;
      padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
      padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
      .bottom-btn {
        width: 100%;
        box-sizing: border-box;
        padding: 16rpx;
        background: rgba(15, 65, 149, 0.74);
        border-radius: 48rpx;
        font-size: 32rpx;
        color: #fff;
        font-weight: 600;
        text-align: center;
      }
    }
  }
}
.summarize-popup {
  position: fixed;
  z-index: 200;
  width: 100%;
  bottom: 0;
  left: 0;
  border-radius: 32rpx 32rpx 0rpx 0rpx;
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
        background: rgba(3,16,42,0.16);
        border-radius: 8rpx;
      }
    }
  }
  
}
</style>