<template>
  <view class="study-index-wrap">
    <view class="swiper-box">
      <view class="main">
        <view class="swiper-item" v-for="(item,index) in imgList" :key="index" :ref="item.level"
              @click="clickItem(item)" :class="pitchLevel===item.level? 'bigImg' :''">
          <image class="image"
                 :src="'https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/study/'+item.imgUrl+'?sign=5dc985b4e8f195b8ad0a7f4ea9635ae9&t=1740967594'"></image>
        </view>
      </view>


    </view>
    <!-- 目录 -->
    <view class="catalog">
      <view class="title">
        目录
      </view>
      <view class="content-box" v-if="list.length && pageLoading">
        <view class="content-item" v-for="(item,index) in list" :key="index"
              @click="jumpStudyInfo(item.level2Dir)">
          <view class="index" :style="{ 'background': color }">
            {{ index + 1 }}
          </view>
          <view class="message">
            <view class="text">
              {{ item.level2Dir }}
            </view>
            <ProgressBar :percentage="item.per" :text='item.text' :color="color"/>
          </view>
        </view>
      </view>
      <view class="empty" v-if="!list.length && pageLoading">
        暂无数据
      </view>
    </view>
  </view>
</template>
<script>
import ProgressBar from '@/components/progressBar.vue';
import {mapGetters} from "vuex";

export default {
  components: {
    ProgressBar,
  },
  data() {
    return {
      imgList: [{
        level: '基础',
        imgUrl: 'swiper-base.png',
        color: '#DBF3FD'
      },
        {
          level: '初级',
          imgUrl: 'swiper-chuji.png',
          color: '#CAE9E0'
        },
        {
          level: '中级',
          imgUrl: 'swiper-zhongji.png',
          color: '#FFDCBA'
        },
        {
          level: '高级',
          imgUrl: 'swiper-gaoji.png',
          color: '#D7D4E5'
        },

      ],
      pitchLevel: '基础',
      list: [],
      studentId: '6',
      pageLoading: false
    }
  },
  watch: {
    pitchLevel(val) {
      this.getKnowledge(val)
    }
  },
  computed: {
    color() {
      return this.imgList.find(item => item.level === this.pitchLevel).color
    },
    ...mapGetters(["userinfo"])
  },
  async onLoad() {
  },
  async onShow() {
    if (!this.userinfo) {
      await this.$store.dispatch('initUserinfo')
    }
    this.getKnowledge(this.pitchLevel)
  },
  onLaunch() {
  },
  methods: {
    // 学习模块 接口  // knowledge/knowledgeListByFirst   学习模块 post
    async getKnowledge(pitchLevel) {
      this.pageLoading = false
      const res = await this.$cloudService.call({
        path: '/knowledgeLibrary/listByLevel1Dir',
        method: 'POST',
        data: {
          "level1Dir": pitchLevel,
          "userId": this.userinfo.id
        }
      })
      this.pageLoading = true

      this.list = res.data.map(item => {
        item.text = item.learnCount + '/' + item.knowledgeSum
        item.per = Math.floor((item.learnCount / item.knowledgeSum) * 100)
        return item
      })
    },
    checkout() {
      let keyMap = {
        "基础": '',
        "初级": '基础',
        "中级": '初级',
        "高级": '中级'
      }
      if (keyMap[this.pitchLevel] === '') {
        return true
      }
      return new Promise((resolve) => {
        this.$cloudService.call({
          path: '/knowledgeLibrary/listByLevel1Dir',
          method: 'POST',
          data: {
            "level1Dir": this.pitchLevel,
            "userId": this.userinfo.id
          }
        }).then(res => {
          resolve(res.data.every((item) => {
            return item.knowledgeSum === item.learnCount
          }))
        })
      })
    },
    async jumpStudyInfo(str) {
      if (!(await this.checkout())) {
        uni.showToast({
          title: '请先完成上一阶段学习',
          icon: 'none'
        })
        return
      }
      uni.navigateTo({
        url: `/pages/studyView/studyInfo?level2Dir=${str}`,
      });

    },
    clickItem(item) {
      this.pitchLevel = item.level
    }
  }
}
</script>

<style scoped lang="less">
* {
  font-family: 'PingFang sc', serif;
}

/deep/ ::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}

.study-index-wrap {
  padding-top: 100rpx;
}

.swiper-box {
  height: 420rpx;
  overflow-x: scroll;
  overflow-y: hidden;
  width: 100vw;

  .main {
    height: 100%;
    width: 1054rpx;
    padding-left: 50rpx;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 50rpx;

    .swiper-item {
      width: 188rpx;
      height: 254rpx;
      flex-shrink: 0; /* 元素不缩小 */
    }

    .swiper-item:last-child {
      margin-right: 50rpx;
    }


    .bigImg {
      width: 290rpx;
      height: 400rpx;
    }

    .image {
      width: 100%;
      height: 100%;
    }
  }

}


.catalog {
  padding: 100rpx 66rpx;

  .title {
    font-size: 56rpx;
    font-weight: 700;
  }

  .content-box {
    padding: 0 20rpx;

    .content-item {
      display: flex;
      align-items: center;
      padding: 40rpx 0 30rpx;

      .index {
        width: 80rpx;
        height: 80rpx;
        border-radius: 16rpx;
        color: #fff;
        text-align: center;
        line-height: 80rpx;
        margin-right: 30rpx;
        font-weight: 600;
        flex-shrink: 0;
        position: relative;
        top: 10rpx;
        font-size: 40rpx;
      }

      .message {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;
        position: relative;
        // padding-bottom: 30rpx;
        &::after {
          content: '';
          position: absolute;
          bottom: -30rpx;
          left: -50%;
          display: block;
          height: 1px;
          width: 200%;
          background: rgba(0, 0, 0, 0.1);
          transform: scale(0.5);
        }

        .text {
          font-size: 40rpx;
          font-weight: 600;
          margin-bottom: 10rpx;
          color: #333;
        }


      }

    }
  }

  .empty {
    padding: 40rpx;
    text-align: center;
  }

}
</style>