<template>
  <view>
    <view class="container">
      <view>
        <image
          src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/submit-0.png?sign=3934fcaa532c2bd463a400033d4e55f6&t=1730479870"
          mode=""
          class="img"
        ></image>
      </view>
    </view>

    <view class="submit-box">
      <button type="primary" class="btn" @click="jumpKehu">联系客服</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    jumpKehu() {
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
  },
};
</script>

<style lang="scss">
.container {
  box-sizing: border-box;
  width: 100%;
  padding: 150rpx 20rpx 0rpx 20rpx;
  display: flex;
  justify-content: center;
  text-align: center;

  .img {
    width: 254px;
    height: 235px;
    flex-shrink: 0;
  }
}
.submit-box {
  padding: 20rpx 30rpx;
  z-index: 10;
  position: fixed;
  left: 0;
  right: 0;

  .btn {
    border-radius: 50rpx;
    background: #ffa100; // #007aff;
  }
}
</style>
