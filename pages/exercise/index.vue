<template>
  <div class="exercise-index no-scrollbar">
    <div class="index-box" v-for="(item, index) in exerciseList" :key="index" @click="openPopup(item)">
      <div class="box-item">
        <image
            class="item-img"
            :src="item.imageUrl"
            mode="scaleToFill"
        />
        <div class="item-info">
          <div class="info-title">{{ item.title }}</div>
          <div class="info-content">
            <span class="content-time">已练习：{{ item.duration }}小时</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="start-popup" :style="{height: showPopup ? `calc(100vh - 10px)` : 0}">
      <div class="popup-content" v-if="showPopup">
        <div class="close-box" @touchend.stop="closePopup"></div>
        <Start :notes="notes" :target="target" @handleStart="toStart"/>
      </div>
    </div>
  </div>
</template>
<script>
import Start from './components/Start.vue'
import {RunningService} from './running/js/RunningService'
import {mapGetters} from "vuex";

export default {
  components: {
    Start
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  data() {
    return {
      currentPercent: 0.25,
      showPopup: false,
      exerciseList: [],
      notes: [],
      target: [],
      currentId: 0
    }
  },
  async onLoad() {
    if (!this.userinfo) {
      await this.$store.dispatch('initUserinfo')
    }
    this.getExercise()
  },
  methods: {
    // 获取练习列表
    async getExercise() {
      const res = await this.$cloudService.call({
        path: '/comprehensive/getPracticeList',
        data: {userId: this.userinfo.id}
      })
      this.exerciseList = res.data
    },
    toStart() {
      RunningService.shared.checkPermission(() => {
        RunningService.shared.start(() => {
          uni.navigateTo({url: `/pages/exercise/running/running?id=${this.currentId}`})
          setTimeout(() => {
            this.closePopup()
          }, 2000)
        })
      })
    },
    openPopup(item) {
      this.showPopup = true
      this.notes = item.notes
      this.target = item.target
      this.currentId = item.id
    },
    closePopup() {
      this.showPopup = false
    },
  },
}
</script>
<style lang="scss" scoped>
.exercise-index {
  padding: 40rpx;
  overflow: auto;
  height: 100vh;
  box-sizing: border-box;

  .index-box {
    margin-bottom: 60rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .box-item {
      border-radius: 32rpx;
      overflow: hidden;
      background: #cdcbcb;
      width: 100%;
      height: 332rpx;
      position: relative;

      .item-img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      .item-info {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 16rpx 10rpx;
        background: rgba(255, 255, 255, 0.86);
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;

        .info-title {
          font-size: 36rpx;
        }

        .info-content {
          display: flex;
          align-items: center;

          .content-time {
            font-size: 20rpx;
            color: rgba(0, 0, 0, 0.70);
            margin-right: 10rpx;
          }
        }
      }
    }
  }

  .start-popup {
    position: fixed;
    z-index: 101;
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
}
</style>