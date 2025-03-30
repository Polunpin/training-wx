<template>
  <!-- 评分 -->
  <div class="score-wrap">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="item-title">{{ item.content }}</div>
      <div class="item-score">
        <template v-for="i in starNum">
          <image
              v-if="item.rate < i + 1"
              :key="i"
              class="score-icon"
              src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/star.png?sign=2b4ba404f766be19e3e4df8cc2cdecfa&t=1742124042"
              mode="scaleToFill"
              @click="isClick && handleStar(index, i)"
          />
          <image
              v-else
              class="score-icon"
              :key="'active' + i"
              src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/star-active.png?sign=2b4ba404f766be19e3e4df8cc2cdecfa&t=1742124042"
              mode="scaleToFill"
              @click="isClick && handleStar(index, i)"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    isClick: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      starNum: 5,
      list: []
    }
  },
  watch: {
    'dataList': {
      handler(n) {
        this.list = n
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    handleStar(index, i) {
      this.list[index].rate = i + 1
      this.$emit('handleStar', this.list)
    }
  }
}
</script>
<style lang="scss" scoped>
.score-wrap {
  .item {
    display: flex;
    justify-content: space-between;
    margin-top: 36rpx;

    &:first-child {
      margin-top: 0;
    }

    .item-title {
      font-size: 28rpx;
      color: rgba(108, 108, 109, 1);
    }

    .item-score {
      display: flex;
      align-items: center;

      .score-icon {
        width: 48rpx;
        height: 48rpx;;
      }
    }
  }
}
</style>