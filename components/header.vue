<template>
  <div class="header-info">
    <div :style="{ height: `${headerTop.top}px`}"></div>
    <div class="header" :style="{ height: `${headerTop.height}px`, paddingBottom: '10rpx'}">
      <div class="btn" @click="handleClick">
        <image class="btn-img"
               :src="headerInfo.img || 'https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/common/arrow-back.png?sign=8a07f4b4b27cf2a1f7931ffc970b80d3&t=1742276165'"/>
      </div>
      <div class="title">{{ headerInfo.title }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isHasClick: {
      type: Boolean,
      default: false
    },
    headerInfo: {
      type: Object,
      default: () => ({
        title: '',
        img: ''
      })
    }
  },
  data() {
    return {}
  },
  methods: {
    handleClick() {
      if (this.isHasClick) {
        this.$emit('handleClick')
      } else {
        uni.navigateBack()
      }

    }
  },
}
</script>
<style lang="scss" scoped>
.header-info {
  // position: fixed;
  // top: 0;
  width: 100%;
  z-index: 10;

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-size: 28rpx;

    .btn {
      position: absolute;
      left: 30rpx;
      top: 50%;
      transform: translateY(-50%);

      .btn-img {
        width: 34rpx;
        height: 34rpx;
      }
    }
  }
}
</style>