<template>
  <div class="challenge-index">
    <!-- 头部 -->
    <Header :headerInfo="{title: '挑战'}"/>
    <!-- 内容 -->
    <div class="page-info no-scrollbar" v-if="!pageLoading">
      <!-- 我的金币 -->
      <div class="my-coin">
        <div class="coin-left">
          <text class="count">{{ gold }}</text>
          <text>我的金币</text>
        </div>
        <div class="coin-btn" @click="toReward">
          兑换中心
          <image
              src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/common/arrow-right.png?sign=0d970358ae90050cdf5465852b589eea&t=1742198192"
              mode="scaleToFill"
          />
        </div>
      </div>
      <!-- 挑战内容 -->
      <div class="challenge-content">
        <div class="challenge-title">
          <image
              class="title-img"
              src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/challenge/challenge-title.png?sign=b17ecedca748c20f91c1a4f71b5e4b41&t=1742388568"
              mode="widthFix"
          />
        </div>
        <div class="right-icon">
          <image
              src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/challenge/race.png?sign=56b4642cc2059bcdf302e43de7b2d501&t=1742880340"
              mode="scaleToFill"
          />
        </div>
        <div class="challenge-list">
          <div class="list-item" v-for="(item, index) in challengeList" :key="index">
            <div class="item-detail" :class="{'item-detail-color': Number(item.progress>=100) }">
              <div class="detail-info">
                <text class="progress">{{ item.progress }}%</text>
                <text class="title">累计练习{{ item.conditionValue }}公里</text>
              </div>
              <div class="coin-img">
                <image
                    :style="{'display': Number(item.progress>=100) && Number(item.sortOrder) === 1 ? 'block' : 'none'}"
                    src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/challenge/correct.png?sign=850a1245f359c853e5a10f0160b75a7f&t=1742881820"
                    mode="scaleToFill"
                />
                <image
                    :style="{'display': Number(item.progress>=100) && Number(item.sortOrder) === 1 ? 'none' : 'block'}"
                    @click="getCoin(item)"
                    src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/common/coin.png?sign=49bab82631f3a544db1e0626e4a26763&t=1742290920"
                    mode="scaleToFill"
                />
              </div>
            </div>
            <ProgressBar class="challenge-progress-bar" :percentage="item.progress"
                         :color="Number(item.progress) < 100 ? '#000' : '#1B9B47'"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from '@/components/header.vue'
import ProgressBar from '@/components/progressBar.vue';
import {mapGetters} from "vuex";

export default {
  components: {
    Header,
    ProgressBar
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  data() {
    return {
      gold: -1,
      pageLoading: true,
      challengeList: [],
      isCoinLock: false
    }
  },
  async onLoad() {
    if (!this.userinfo) {
      await this.$store.dispatch('initUserinfo')
    }
    this.getChallengeList()
  },
  methods: {
    // 获取列表
    async getChallengeList() {
      const res = await this.$cloudService.call({
        path: '/comprehensive/getChallengeList',
        data: {userId: this.userinfo.id}
      })
      this.pageLoading = false
      this.gold = res.data.gold
      this.challengeList = res.data.challenges
      console.log(this.challengeList)
    },
    toReward() {
      uni.navigateTo({url: '/pages/reward/list'})
    },
    async getCoin(item) {
      if (Number(item.progress) >= 100) {
        if (this.isCoinLock) true
        this.isCoinLock = true
        const res = await this.$cloudService.call({
          path: '/comprehensive/collectCoins',
          method: 'POST',
          data: {
            challengeId: item.id,
            userId: this.userinfo.id,
            currentGold: this.gold,
            taskGold: item.rewardGold
          }
        })
        this.isCoinLock = false
        console.log(res)
        if (res.data) {
          this.gold = Number(this.gold) + Number(item.rewardGold)
          this.$set(item, 'sortOrder', 1);
          uni.showToast({
            title: '领取成功',
            icon: 'none',
            mask: true
          })
        } else {
          uni.showToast({
            title: res.errorMsg,
            icon: 'none',
            mask: true
          })
        }

      } else {
        uni.showToast({
          title: '任务未完成',
          icon: 'none',
          mask: true
        })
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.challenge-index {
  height: 100vh;
  overflow: hidden;
  background-image: url('https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/challenge/challenge-bg.png?sign=07123061fb7ee2aa0c04ea04ee159f1c&t=1743163187');
  background-color: #F8F8F8;
  background-size: 100% 600rpx;
  background-repeat: no-repeat;
  box-sizing: border-box;
  background-position: top;
  display: flex;
  flex-direction: column;

  .page-info {
    flex: 1;
    overflow: auto;

    .my-coin {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 44rpx 48rpx;
      box-sizing: border-box;

      .coin-left {
        display: flex;
        flex-direction: column;

        text {
          font-size: 30rpx;
          color: rgba(0, 0, 0, 0.66);

          &.count {
            font-size: 80rpx;
            line-height: 80rpx;
            font-weight: 600;
            color: rgba(0, 0, 0, 1);
            margin-bottom: 2px;
          }
        }
      }

      .coin-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30rpx;

        image {
          width: 38rpx;
          height: 38rpx;
        }
      }
    }

    .challenge-content {
      margin: 0 32rpx 60rpx;
      position: relative;

      .challenge-title {
        padding: 34rpx 22rpx 16rpx 32rpx;
        background: #f1f1f1;
        width: 66%;
        border: 1px solid #fff;
        border-bottom: 0;
        border-radius: 40rpx 40rpx 0 0;
        margin-bottom: -4rpx;
        position: relative;
        transform: perspective(30rpx) rotateX(2deg);
        transform-origin: left bottom;
        z-index: 11;

        .title-img {
          width: 272rpx;
          transform: perspective(30rpx) rotateX(-2deg);
          transform-origin: left bottom;
        }

        &::after {
          content: '';
          position: absolute;
          width: 40rpx;
          height: 40rpx;
          background: radial-gradient(circle at 100% 0, transparent 45rpx, #f1f1f1 35rpx);
          right: -36rpx;
          bottom: -4rpx;

        }
      }

      .right-icon {
        width: 256rpx;
        height: 244rpx;
        position: absolute;
        right: -8px;
        top: -72rpx;
        z-index: 9;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .challenge-list {
        background: rgba(242, 242, 242, 0.69);
        border: 1px solid #fff;
        border-radius: 0 40rpx 40rpx 40rpx;
        padding: 36rpx 20rpx 20rpx;
        position: relative;
        z-index: 10;

        .list-item {
          padding: 28rpx;
          background: #fff;
          border-radius: 20rpx;
          margin-top: 32rpx;

          &:first-child {
            margin-top: 0;
          }

          .item-detail {
            display: flex;
            align-items: center;
            margin-bottom: 30rpx;

            .detail-info {
              flex: 1;

              text {
                display: block;
              }

              .progress {
                font-size: 72rpx;
                line-height: 72rpx;
                font-weight: 600;
              }

              .title {
                font-size: 32rpx;
              }
            }

            .coin-img {
              width: 130rpx;
              height: 130rpx;
              position: relative;

              image {
                width: 100%;
                height: 100%;
                flex-shrink: 0;
              }
            }

            &.item-detail-color {
              color: #1B9B47;
            }
          }

          /deep/ .challenge-progress-bar .progress-bar {
            height: 26rpx;
          }
        }
      }
    }
  }
}
</style>