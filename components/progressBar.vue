<template>
  <view class="progress-bar">
    <!-- 进度条容器 -->
    <view class="progress" :style="{ width: `${percentage}%`,backgroundColor:color }"></view>
    <!-- 显示进度百分比的文本 -->
    <text class="progress-text" v-if="text">{{ text }}</text>
  </view>
</template>
<script>
export default {
  name: "progressBar",
  data() {
    return {};
  },
  props: {
    // 接收进度百分比，类型为数字，默认值为 0
    percentage: {
      type: Number,
      default: 0,
      // 验证传入的百分比是否在 0 到 100 之间
      validator: function (value) {
        return value >= 0 && value <= 100;
      }
    },
    // 进度条的颜色
    color: {
      type: String,
      default: '#4caf50',

    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
* {
  font-family: 'PingFang sc', serif;
}

.progress-bar {
  height: 36rpx;
  width: 95%;
  background-color: #F3F3F3;
  border-radius: 18rpx;
  overflow: hidden;
  position: relative; /* 为了让子元素可以相对于它定位 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress {
  height: 100%;
  background-color: #4caf50;
  border-radius: 18rpx;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}

.progress-text {
  color: #1C1916;
  z-index: 1; /* 确保文字显示在进度条之上 */
  font-size: 24rpx;
  font-weight: 600;
}
</style>