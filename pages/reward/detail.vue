<template>
  <div class="detail-wrap">
    <!-- Header -->
    <Header :headerInfo="{title: '兑换'}" />
    <div class="page-info no-scrollbar" >
      <div class="detail-box" v-if="!pageLoading">
        <div class="box-top">
          <div class="box-img">
            <image :src="detailInfo.image" mode="widthFix"/>
          </div>
        </div>
        <div class="box-bottom">
          <!-- 分割线 -->
          <div class="split-line">
            <div class="circle circle-left"></div>
            <div class="line"></div>
            <div class="circle circle-right"></div>
          </div>
          <div class="box-content">
            <div class="detail-count">
              消耗金币：{{detailInfo.exchangeCondition}}
            </div>
            <div class="detail-information">
              {{detailInfo.description}}
            </div>
            <div class="detail-btn" v-if="optionData.type === 'list' && !isChange" @click="toChange">兑换</div>
          </div>
        </div>
        
      </div>
    </div>
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
      optionData: 0,
      detailInfo: {},
      pageLoading: true,
      isChangeLock: false,
      isChange: false
    }
  },
  async onLoad(option) {
    if (!this.userinfo) {
      await this.$store.dispatch('initUserinfo')
    }
    this.optionData = option
    this.getDetailInfo()
  },
  methods: {
   async getDetailInfo () {
    const obj = {}
    if (this.optionData.type === 'list') {
      obj.id = this.optionData.id
    } else {
      obj.redemptionId = this.optionData.id
    }
    const res = await this.$cloudService.call({
      path:this.optionData.type === 'list' ?'/reward/getRewardDetail' : '/comprehensive/exchangeDetail',
      data: obj
    })
    this.pageLoading = false
    this.detailInfo = res.data
    console.log(res.data)
   },
   async toChange() {
    if (this.isChangeLock) return
    this.isChangeLock = true
    const res = await this.$cloudService.call({
      path:'/comprehensive/exchange',
      method: 'POST',
      data: {
        rewardId: this.optionData.id,
        userId: this.userinfo.id,
        goldCoins: this.detailInfo.exchangeCondition
      }
    })
    this.isChangeLock = false
    if(res.data) {
      this.isChange = true
    }
    uni.showToast({
      title: res.errorMsg,
      icon: 'none',
      mask: true
    })
   }
  },
}
</script>
<style lang="scss" scoped>
.detail-wrap {
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
    overflow: auto;
    padding: 40rpx 40rpx 120rpx;
  }
  .detail-box {
    width: 100%;
    padding: 10rpx 10rpx 50rpx;
    min-height: 100%;
    box-sizing: border-box;
    position: relative;
    border-radius: 24rpx;
    background: #fff;
    display: flex;
    flex-direction: column;
    .box-top {
      flex: 1;
      display: flex;
      align-items: center;
      .box-img {
        flex-shrink: 0;
        width: 100%;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
    
    .box-bottom {
      padding-bottom: 60rpx;
      .split-line {
        margin-top: 50rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 100%;
        left: 0rpx;
        right: 0rpx;
        .circle {
          width: 96rpx;
          height: 96rpx;
          background-color: #B4A5CC;
          flex-shrink: 0;
          position: relative;
          &.circle-left {
            right: -38rpx;
            clip-path: circle(50% at 0% 50%);
          }
          &.circle-right {
            left: -38rpx;
            clip-path: circle(50% at 100% 50%);
          }
        }
        .line {
          width: calc(100% - 96rpx);
          height: 1px;
          flex-shrink: 0;
          border-bottom: 2px dashed #B4A5CC;
        }
      }
      .box-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 66rpx;
        .detail-information {
          margin-top: 30rpx;
          font-size: 30rpx;
          line-height: 48rpx;
          color: rgba(0, 0, 0, 0.37);
          text-align: center;
        }
        .detail-count {
          display: flex;
          align-items: center;
          color: #000;
          margin-top: 24rpx;
          font-size: 36rpx;
        }
        .detail-btn {
          padding: 28rpx 140rpx;
          background: #B4A5CC;
          border-radius: 28rpx;
          font-size: 40rpx;
          line-height: 44rpx;
          color: #000;
          font-weight: 600;
          width: fit-content;
          margin-top: 64rpx;
        }
      }
    }
  }
}

</style>