<template>
  <view class="container">
    <!-- 顶部标题区域 -->
    <view class="header">
      <text class="page-title">驾驶宝典</text>
    </view>

    <!-- 阶段卡片区域 -->
    <view class="stage-cards">
      <view
          class="card"
          v-for="(stage, index) in stageList"
          :key="index"
          :style="{ backgroundColor: stage.bgColor }"
      >
        <!-- 如果是解锁状态，展示阶段标题和进度 -->
        <view v-if="!stage.locked" class="card-content">
          <text class="stage-title">{{ stage.title }}</text>
          <view class="progress-box">
            <image
                src="https://cdn-icons-png.flaticon.com/512/481/481132.png"
                class="progress-icon"
            />
            <text class="progress-text">{{ stage.current }}/{{ stage.total }}</text>
          </view>
        </view>
        <!-- 如果是锁定状态，则展示锁图标 -->
        <view v-else class="locked-box">
          <image
              src="https://cdn-icons-png.flaticon.com/512/565/565655.png"
              class="locked-icon"
          />
        </view>
      </view>
    </view>

    <!-- 知识点列表区域 -->
    <view class="knowledge-list">
      <view
          class="knowledge-item"
          v-for="(item, i) in knowledgePoints"
          :key="i"
      >
        <!-- 左侧序号区块 -->
        <view class="index-box">{{ i + 1 }}</view>
        <!-- 右侧标题和描述 -->
        <view class="text-box">
          <text class="item-title">{{ item.title }}</text>
          <text class="item-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 阶段卡片示例数据
      stageList: [
        {
          title: '初级',
          current: 12,
          total: 68,
          locked: false,
          bgColor: '#CCE1FF'
        },
        {
          title: '中级',
          current: 0,
          total: 68,
          locked: true,
          bgColor: '#76AADB'
        },
        {
          title: '高级',
          current: 0,
          total: 68,
          locked: true,
          bgColor: '#345D9D'
        }
      ],
      // 知识点列表示例数据
      knowledgePoints: [
        { title: '学习驾驶前的准备', desc: '一样很重要' },
        { title: '学习驾驶前的准备', desc: '一样很重要' },
        { title: '学习驾驶前的准备', desc: '一样很重要' },
        { title: '学习驾驶前的准备', desc: '一样很重要' },
      ],
    }
  },
  methods: {
    // 需要与后端交互时可在此处编写请求逻辑
    // async fetchData() {
    //   const res = await yourRequestApi()
    //   this.stageList = res.stageList
    //   this.knowledgePoints = res.knowledgePoints
    // }
  },
  mounted() {
    // 若要在页面加载时获取数据，可在此处调用：
    // this.fetchData()
  }
}
</script>

<style scoped>
/* 容器 */
.container {
  padding: 20rpx;
  background-color: #ffffff;
}

/* 顶部标题区域 */
.header {
  margin-bottom: 20rpx;
}
.page-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

/* 阶段卡片区域 */
.stage-cards {
  display: flex;
  flex-direction: row;
  margin-bottom: 30rpx;
}
.card {
  width: 160rpx;
  height: 200rpx;
  border-radius: 16rpx;
  margin-right: 20rpx;
  position: relative;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
}
.card-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.stage-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}
.progress-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: auto;
}
.progress-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 8rpx;
}
.progress-text {
  font-size: 24rpx;
  color: #333;
}
.locked-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.locked-icon {
  width: 48rpx;
  height: 48rpx;
  opacity: 0.8;
}

/* 知识点列表区域 */
.knowledge-list {
  padding-top: 10rpx;
}
.knowledge-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 20rpx;
}
.index-box {
  width: 46rpx;
  height: 46rpx;
  background-color: #cce1ff;
  border-radius: 8rpx;
  color: #333;
  font-size: 24rpx;
  text-align: center;
  line-height: 46rpx;
  margin-right: 12rpx;
}
.text-box {
  display: flex;
  flex-direction: column;
}
.item-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 6rpx;
}
.item-desc {
  font-size: 24rpx;
  color: #666;
}
</style>