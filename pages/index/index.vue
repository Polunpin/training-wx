<template>
  <div class="index-container" v-if="!pageLoading">
    <div class="logo" @click="jumpPage('/pages/index/guide')">
      <image
        src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/index/logo.png?sign=6ab433dd380e30fdb7e8b8e782a03f72&t=1740907791"
        class="logo-img"></image>
    </div>
    <!-- 用户信息 -->
    <div class="info-box">
      <div class="shape">
        <div class="first"></div>
        <div class="second"></div>
      </div>
        <div class="info-bg info-border-radius">
          <div class="info-bg1 info-border-radius">
            <div class="info-content info-border-radius">
              <p class="content-name"></p> 
              <div class="content-val">
                <p class="val-title">驾驶能力</p>
                <p class="val-count">{{dataInfo.proficiency || 0}}</p>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div class="module">
      <!-- 当前进度 -->
      <div class="module-current" v-if="Object.keys(dataInfo).length">
        <div class="current-info">
          <span class="info-title">当前进度：</span>
          {{dataInfo.level4Dir}}
        </div>
        <div class="current-btn" @click="jumpPage(`/pages/studyView/studyInfo?level2Dir=${dataInfo.level2Dir}&level3Dir=${dataInfo.level3Dir}&level4Dir=${dataInfo.level4Dir}`)">继续学习</div>
      </div>
      <!-- 模块列表 -->
      <div class="module-list">
        <!-- 前两项 -->
        <div class="list-first-row">
          <!-- 学习 -->
          <div class="list-item" @click="jumpPage('/pages/studyView/studyIndex')">
            <image
              src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/index/icon-study.png?sign=2171d1dd675a5ff9c6e3c4d2593bf505&t=1740908577"
              mode="scaleToFill"
              class="item-logo logo-study"
            />
            <p class="item-title">学习</p>
          </div>
          <!-- 练习 -->
          <div class="list-item even" @click="jumpPage('/pages/exercise/index')">
            <image
              src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/index/icon-exercise.png?sign=a98501336204a56314dbf3a565caf3bf&t=1740908630"
              mode="scaleToFill"
              class="item-logo logo-exercise"
            />
            <p class="item-title">练习</p>
          </div>
        </div>
        <!-- 记录 -->
        <div class="list-item odd" @click="jumpPage('/pages/exercise/record')">
          <image
            src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/index/icon-record.png?sign=9995fd37a38a3a341b9c0b8a73dd48e3&t=1740908589"
            mode="scaleToFill"
            class="item-logo logo-record"
          />
          <p class="item-title">记录</p>
        </div>
        <!-- 挑战 -->
        <div class="list-item even" @click="jumpPage('/pages/challenge/index')">
          <image
            src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/index/icon-challenge.png?sign=df3b41a356683758303e42f546d4296a&t=1740908616"
            mode="scaleToFill"
            class="item-logo logo-challenge"
          />
          <p class="item-title">挑战</p>
        </div>
        <!-- 客服 -->
        <div class="list-item odd" @click="jumpCustomerService('https://work.weixin.qq.com/kfid/kfc8cb15992d541ece4')">
          <image
            src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/index/icon-customer.png?sign=2a61fd7f077c64103f50e22652a143e6&t=1740908602"
            mode="scaleToFill"
            class="item-logo logo-customer"
          />
          <p class="item-title">客服</p>
        </div>
        <!-- 奖励 -->
        <div class="list-item even" @click="jumpPage('/pages/reward/list')">
          <image
            src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/index/icon-reward.png?sign=37235096514e2c84b5a1f0f054ab69a9&t=1740908565"
            mode="scaleToFill"
            class="item-logo logo-reward"
          />
          <p class="item-title">奖励</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { get } from "@/utils/request.js";
// import { call } from '@/api/request.js'
import {mapGetters} from "vuex";
export default {
  computed: {
    ...mapGetters(["userinfo"]),
  },
  data () {
    return {
      dataInfo:{},
      pageLoading: true
    }
  },
  async onShow() {
    if (!this.userinfo) {
      await this.$store.dispatch('initUserinfo')
    }
    if (this.userinfo) {
      await this.getStudyDetail()
    }
  },
  methods: {
    // 获取继续学习
    async getStudyDetail () {
      const res = await this.$cloudService.call({
        path:'/learningProgress/getLearningProgress',
        data: {userId: this.userinfo.id}
      })
      this.pageLoading = false
      this.dataInfo = res.data || {}
    },

    //学习
    jumpPage(url) {
      uni.navigateTo({
		    url
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.index-container {
  .logo {
    padding:  40rpx 0 0 40rpx;
    position: relative;
    z-index: 10;
    .logo-img {
      width: 526rpx;
      height: 242rpx;
      display: block;
    }
  }
  
  .info-box {
    margin-top: -60rpx;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    .shape {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .first {
        width: 80rpx;
        height: 80rpx;
        border-radius: 40rpx 0 0 40rpx;
        background: rgba(92, 110, 128, 0.50);
        box-shadow: -2px 4px 4px 0px rgba(0, 0, 0, 0.39);
      }
      .second {
        width: 40rpx;
        height: 80rpx;
        background: rgba(92, 110, 128, 0.50);
      }
    }
    .info-border-radius {
      border-top-left-radius: 160rpx;
      border-bottom-left-radius: 120rpx;
    }
    .info-bg {
      padding: 32rpx 0 32rpx 32rpx;
      background: #d9d9d9;
      width: 80%;
      box-shadow: 0 4rpx 20rpx 0 rgba(0, 0, 0, 0.25);
      .info-bg1 {
        background: #fff;
      }
      .info-content {
        background: rgba(14, 176, 245, 0.07);
        padding: 24rpx 60rpx 24rpx 120rpx;
        box-shadow: 0 4rpx 8rpx 0 rgba(0, 0, 0, 0.02);
        display: flex;
        justify-content: space-between;
        align-items: center;
        .content-name {
          font-size: 40rpx;
          color: #333;
        }
        .content-val {
          display: flex;
          flex-direction: column;
          align-items: center;
          .val-title {
            font-size: 24rpx;
            color: rgba(51, 51, 51, 0.56);
          }
          .val-count {
            font-size: 82rpx;
            font-weight: 600;
            line-height: 100rpx;
            position: relative;
          }
        }
      }
    }
  }
  .module {
    padding: 66rpx 60rpx;
    .module-current {
      padding: 14rpx 30rpx;
      border-radius: 20rpx;
      background: rgba(255, 255, 255, 0.14);
      box-shadow: 0 0 12rpx 0 #95CBF0;
      display: flex;
      align-items: center;
      .current-info {
        font-size: 26rpx;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        .info-title {
          font-weight: 600;
        }
      }
      .current-btn {
        flex-shrink: 0;
        font-size: 28rpx;
        margin-left: 10rpx;
        color: rgba(35, 78, 151, 0.81);
        font-weight: bolder;
      }
    }
    .module-list {
      margin-top: 24rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      .list-item {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin-top: 8rpx;
        .item-logo {
          width: 108rpx;
          height: 108rpx;
          position: absolute;
          right: 20rpx;
          bottom: 20rpx;
          &.logo-record {
            width: 100rpx;
            height: 82rpx;
          }
          &.logo-challenge {
            width: 96rpx;
            height: 96rpx;
          }
          &.logo-customer {
            width: 84rpx;
            height: 84rpx;
          }
          &.logo-reward {
            width: 84rpx;
            height: 84rpx;
          }
        }
        .item-title {
          font-size: 32rpx;
          position: absolute;
          font-weight: 600;
          top: 30rpx;
          left: 30rpx;
        }
        &.even {
          width: 274rpx;
          height: 180rpx;
          background-image: url('https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/index/module-right.png?sign=8b4c46dc0046f4cd5013ee83b2952c76&t=1740908972');
          background-size: 100% 170rpx;
          background-position: center;
          background-repeat: no-repeat;
        }
        &.odd {
          width: 340rpx;
          height: 180rpx;
          background-image: url('https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/index/module-left.png?sign=151b6516fd6688bf8c3ad7a2a4bc74d3&t=1740909094');
          background-size: 100% 170rpx;
          background-position: center;
          background-repeat: no-repeat;
        }
       
      }
      .list-first-row {
        position: relative;
        height: 368rpx;
        width: 100%;
        .list-item { 
          margin: auto;
          &:first-child {
            width: 100%;
            height: 368rpx;
            background-image: url('https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/index/module-1.png?sign=f82cae40000bafe9cb466e5734904047&t=1740908737');
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            .item-logo {
              width: 274rpx;
              height: 200rpx;
              left: 40rpx;
              bottom: 80rpx;
            }
            .item-title {
              top: 30rpx;
              right: 30rpx;
              left: auto;
            }
          }
          &.even {
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
      }
    }
  }
}
</style>