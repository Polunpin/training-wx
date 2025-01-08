<template>
  <view class="container" v-if="userinfo">
    <image
        v-if="true"
        src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/logo.png?sign=624ce5a1a14883bfe5d569fe5454cee9&t=1730479945"
        class="logo"></image>
    <image
        v-else
        src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/task.png?sign=235193151d2ec51b66905f457d84289c&t=1736369942"
        class="logo"></image>

    <view class="info-block">
      <view class="title">{{ userinfo.stuName }}</view>
      <view class="tag">
        <view class="item">已预约：{{ userinfo.used }}小时</view>
        <view class="item">待约课：{{ userinfo.lave }}小时</view>
      </view>
    </view>
    <view class="list-box">
      <view class="list-item">
        <button class="btn" @click="jumpCustomerService"></button>
        <image
            src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/kehu.png?sign=270644f53ab8cff63318b7e83613c257&t=1730479739"
            class="img"></image>
      </view>

      <view class="list-item">
        <image
            src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/study.png?sign=fbb5f55a3d8528e06531094648a99ed6&t=1731692176"
            class="img"
            @click="jumpStudy"></image>
      </view>

      <view class="list-item">
        <image
            src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/yuyue.png?sign=cc541147500b5fc84c4cadcaacc6caf7&t=1730479825"
            class="img"
            @click="jumpCourse"
        ></image>
      </view>

      <view class="list-item">
        <image
            src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/jilu.png?sign=8d735fd4bd1d7e3c1809142f99c47954&t=1730479715"
            class="img"
            @click="jumpRecord"
        ></image>
      </view>
    </view>
  </view>
</template>

<script>
import {get} from "@/utils/request.js";
import {mapGetters} from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  onLoad() {
    get("/lessonManagement/personalInfo", {
      unionId: uni.getStorageSync("unionid"),
    }).then((res) => {
      this.$store.commit("setUserinfo", res);
    });
  },
  methods: {
    //客服
    jumpCustomerService() {
      wx.openCustomerServiceChat({
        extInfo: {
          url: "https://work.weixin.qq.com/kfid/kfc8cb15992d541ece4",
        },
        corpId: "wwcb10560218a47a01",
        success(res) {},
        fail(err) {
          console.log(err);
        },
      });
    },

    //学习
    jumpStudy() {
      console.log("AAA");
    },

    //预约
    jumpCourse() {
      if (this.userinfo.isAppointment) {
        if (this.userinfo.trainerId === null) {
          uni.showToast({
            title: "客服分派教练中",
            icon: "none",
          });
        } else if (this.userinfo.lave === 0) {
          if (this.userinfo.used === 2) {
            uni.showToast({
              title: "请联系客服，购买正式课",
              icon: "none",
            });
          } else {
            uni.showToast({
              title: "🚙 山川湖海，一路平安 👋🏻已结课",
              icon: "none",
            });
          }
        } else {
          uni.navigateTo({
            url: "/pages/formal/formal",
          });
        }
      } else {
        if (this.userinfo.id === 0) {
          uni.showToast({
            title: "联系客服，确认上课时间",
            icon: "none",
          });
        } else {
          uni.navigateTo({
            url: "/pages/reservation/reservation",
          });
        }

      }
    },

    //记录
    jumpRecord() {
      if (this.userinfo.isAppointment) {
        uni.navigateTo({
          url: "/pages/record/record",
        });
      } else {
        uni.showToast({
          title: "暂无预约记录",
          icon: "none",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  padding-bottom: 120rpx;
  line-height: 1;

  .logo {
    width: 388rpx;
    height: 180rpx;
    margin: 80rpx auto 0;
  }

  .info-block {
    box-sizing: border-box;
    margin-left: auto;
    margin-top: 120rpx;
    padding: 50rpx 400rpx 50rpx 50rpx;
    background: #eaf5fa url("https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/"+
		"images/fxp.png?sign=6ebde2db0fbd249637f9d1c3960bc624&t=1730479402") no-repeat right bottom;
    background-size: 112rpx 112rpx;
    border-top-left-radius: 15rpx;
    border-bottom-left-radius: 15rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    max-width: 85%;
    white-space: nowrap;

    .title {
      margin-bottom: 30rpx;
      color: #333333;
      font-size: 40rpx;
      font-weight: 500;
    }

    .tag {
      display: flex;
      align-items: center;
      gap: 30rpx;

      .item {
        color: #333333;
        font-size: 28rpx;
        font-weight: 400;
      }
    }
  }

  .list-box {
    display: flex;
    flex-direction: column;
    padding: 50rpx 28rpx 0;

    .list-item {
      position: relative;

      .img {
        width: 480rpx;
        height: 200rpx;
      }

      .btn {
        z-index: 10;
        position: absolute;
        left: 0;
        top: 0;
        width: 480rpx;
        height: 200rpx;
        background: transparent;
        background-size: 100% 100%;
        border: none;

        &::after {
          border: none;
        }
      }

      //功能图标右对齐
      &:nth-child(2),
      &:nth-child(4){
        display: flex;
        justify-content: flex-end;
        margin: 50rpx 0;
      }
    }
  }
}
</style>
