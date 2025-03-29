<template>
  <div class="record-list-wrap">
    <!-- Header -->
    <Header :headerInfo="{title: '兑换记录'}" />
    <!-- 滚动区域 -->
    <scroll-view class="page-info" :style="{height: `calc(100% - ${headerTop.height + headerTop.top}px)`}" lower-threshold="100">
      <!-- 列表 -->
      <div class="record-list" v-if="!pageLoading && recordList.length">
        <div class="list-item" v-for="(item,index) in recordList" :key="index" @click="toDetail(item.id)">
          <div class="item-content">
            <div class="content">
              <text class="content-title">{{item.title}}</text>
              <text class="content-count">-{{item.exchangeCondition}}金币</text>
            </div>
            <div class="img">
              <image
                :src="item.image"
                mode="scaleToFill"
              />
            </div>
          </div>
          <div class="item-date">
            兑换时间：{{item.exchangeTime}}
          </div>
        </div>
      </div>
      <!-- 空 -->
      <Empty class="record-empty" v-if="!pageLoading && !recordList.length"/>
    </scroll-view>
  </div>
</template>
<script>
import Header from '@/components/header.vue'
import Empty from '@/components/empty.vue'
import {mapGetters} from "vuex";
export default {
  components: {
    Header,
    Empty
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  data () {
    return {
      recordList: [],
      pageLoading: true
    }
  },
  async onLoad() {
    if (!this.userinfo) {
      await this.$store.dispatch('initUserinfo')
    }
    this.getRecordList()
  },
  methods: {
    // 获取列表
    async getRecordList () {
      const res = await this.$cloudService.call({
        path: '/redemption/getRewardExchangeList',
        data: {userId: this.userinfo.id}
      })
      this.pageLoading = false
      this.recordList = res.data
    },
    toDetail(id) {
      uni.navigateTo({ url: `/pages/reward/detail?id=${id}&type=record`})
    },
  },
}
</script>
<style lang="scss" scoped>
.record-list-wrap {
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
  }
  .record-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 40rpx;
    .list-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #fff;
      border-radius: 16rpx;
      box-shadow: 0 0 8rpx rgba(0,0,0,0.03);
      margin-top: 24rpx;
      overflow: hidden;
      padding: 30rpx 30rpx 20rpx 60rpx;
      box-sizing: border-box;
      &:first-child {
        margin-top: 0;
      }
      .item-content {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .content{
          .content-title {
            display: block;
            font-size: 36rpx;
            font-weight: bold;
            margin-right: 10rpx;
            line-height: 44rpx;

          }
          .content-count {
            display: block;
            font-size: 32rpx;
            line-height: 44rpx;
          }
        }
        .img {
          flex-shrink: 0;
          width: 240rpx;
          height: 240rpx;
          image {
            width: 100%;
            height: 100%;
          }
        }
      }
      .item-date {
        font-size: 24rpx;
        color: rgba(177, 177, 177, 1);
        align-self: flex-end;
        margin-top: 10rpx;
      }
    }
  }
  .loading {
    padding: 40rpx 0 60rpx;
    text-align: center;
  }
  .record-empty {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>