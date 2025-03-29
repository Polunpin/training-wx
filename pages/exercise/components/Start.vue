<template>
  <div class="start-wrap no-scrollbar">
    <!-- 练习目标 -->
    <div class="module module-target">
      <div class="title">练习目标</div>
      <div class="list">
        <div class="list-item" v-for="(item,index) in target" :key="index">
          <text class="item-title">{{item.content}}</text>
          <text class="item-completion">{{item.completion}}%</text>
        </div>
      </div>
    </div>
    <!-- 注意事项 -->
    <div class="module module-precautions">
      <div class="title">注意事项</div>
      <div class="list">
        <div class="list-item" v-for="(item,index) in notes" :key="index">
          <text class="item-title">{{ item }}</text>
        </div>
      </div>
    </div>
    <div class="start-btn" @click="hanldeStart">
      <image
        src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/start-btn.png?sign=20914982fce1ebb00392882646f78936&t=1741933583"
        mode="scaleToFill"
      />
    </div>
  </div>
</template>
<script>
export default{
  props: {
    notes: {
      type: Array,
      default: () => []
    },
    target: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    hanldeStart() {
      this.$emit('handleStart')
    }
  },
}
</script>
<style lang="scss" scoped>
.start-wrap {
  padding: 60rpx 60rpx 240rpx;
  height: 100vh;
  overflow: auto;
  box-sizing: border-box;
  .module {
    padding: 30rpx;
    border-radius: 32rpx;
    .title {
      font-size: 48rpx;
    }
    &.module-target{
      background: #F5FCF7;
    }
    &.module-precautions{
      margin-top: 68rpx;
      background: rgba(255, 249, 185, 0.88);
    }
    .list {
      padding: 0 20rpx;
      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10rpx;
        .item-title {
          font-size: 28rpx;
        }
        .item-completion {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
  .start-btn {
    width: 280rpx;
    height: 280rpx;
    margin: 0 auto;
    margin-top: 120rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}

</style>