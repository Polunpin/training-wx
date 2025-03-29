<template>
  <div class="reward-list-wrap">
    <!-- Header -->
    <Header :headerInfo="{title: '奖励'}" />
    <!-- 滚动区域 -->
    <scroll-view class="page-info" scroll-y :style="{height: `calc(100% - ${headerTop.height + headerTop.top}px)`}" lower-threshold="100">
      <div class="my-coin">
        <div class="coin-left">
          <text class="count">{{gold}}</text>
          <text>我的金币</text>
        </div>
        <div class="coin-btn" @click="toRecord">
          兑换记录
          <image
            src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/common/arrow-right.png?sign=0d970358ae90050cdf5465852b589eea&t=1742198192"
            mode="scaleToFill"
          />
        </div>
      </div>
      <!-- 列表 -->
     <div class="reward-list">
        <div class="list-item" v-for="(item,index) in rewardList" :key="index" @click="toDetail(item.id)"> 
          <div class="item-img">
            <image
              :src="item.image"
              mode="scaleToFill"
            />
          </div>
          <div class="item-title">{{item.title}}</div>
          <div class="item-count">
            金币:{{item.exchangeCondition}}
          </div>
          <!-- <div class="item-mask" v-if="item.isExchange">
            已兑换
          </div> -->
        </div>
     </div>
    </scroll-view>
  </div>
</template>
<script>
import Header from '@/components/header.vue'
import {mapGetters} from "vuex";
export default {
  components: {
    Header
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  data () {
    return {
      gold: 0,
      rewardList: []
    }
  },
  async onLoad() {
    if (!this.userinfo) {
      await this.$store.dispatch('initUserinfo')
    }
  },
  onShow() {
    this.getRewardList()
  },
  methods: {
    // 获取列表
    async getRewardList () {
      const res = await this.$cloudService.call({
        path: '/comprehensive/getRewardList',
        data: {userId: this.userinfo.id}
      })
      this.gold = res.data.gold
      this.rewardList = res.data.rewards
      console.log(res.data)
    },
    toRecord() {
      uni.navigateTo({ url: '/pages/reward/record'})
    },
    toDetail(id) {
      uni.navigateTo({ url: `/pages/reward/detail?id=${id}&type=list`})
    },
    // loadMore () {
    //   console.log(11)
    // }
  },
}
</script>
<style lang="scss" scoped>
.reward-list-wrap {
  // background: linear-gradient(-220deg,rgba(180, 165, 204, 1)1%,#f8f8f8,rgb(240, 237, 246), #f8f8f8);
  background-image: url('https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/reward/reward-bg.png?sign=42b81e38f300a1b5299caa072ceb50df&t=1743071355');
  background-color: #F8F8F8;
  background-size: 100% 600rpx;
  background-repeat: no-repeat;
  box-sizing: border-box;
  background-position: top;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .page-info {
    flex: 1;
    padding-bottom: 20rpx;
  }
  .my-coin {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 44rpx 40rpx;
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
  .reward-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0 auto;
    margin-top: -24rpx;
    padding:0 40rpx 40rpx;
    .list-item {
      width: calc(50% - 12rpx);
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #fff;
      border-radius: 16rpx;
      box-shadow: 0 0 8rpx rgba(0,0,0,0.03);
      margin-top: 24rpx;
      overflow: hidden;
      padding: 40rpx;
      box-sizing: border-box;
      position: relative;
     
      .item-img {
        width: 240rpx;
        height: 240rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
      .item-title {
        font-size: 24rpx;
        margin-top: 34rpx;
      }
      .item-count {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        margin-top: 6rpx;
      }
      .item-mask {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32rpx;
        font-weight: 700;
        color: rgba(129, 129, 129, 1);

      }
    }
  }
  .loading {
    padding: 40rpx 0 60rpx;
    text-align: center;
  }
}
</style>