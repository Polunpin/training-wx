<template>
  <view class="study-info-wrap" v-if="!pageLoading">
    <view class="img">
      <image :src="infoObj.imageUrl" alt="图片" class='imgItem' mode="widthFix"></image>
    </view>
    <view class="content">
      <scroll-view class="tabOne" scroll-x="true">
        <view class="tabOne-item" v-for="(item,index) in detailKeys" :key="index" @click="changeTabOne(index)"
              :class="pitchIndex===index? 'pitch-tabOne' :''">
          {{ item }}
        </view>
      </scroll-view>
      <view class="info">
        <view class="tabTwo">
          <view class="tabTwo-item " v-for="(item,index) in fourLevel" :key="index"
                @click="changeTabTwo(pitchIndex, index)"
                :class="{
							'active-click': picthFourIndex[pitchIndex]===index,
							'active-status': Number(item.learningStatus) === 2,
							'active-status-click': picthFourIndex[pitchIndex]===index && Number(item.learningStatus) === 2
						}"
          >
            {{ item.level4Dir }}
          </view>

        </view>
        <view class="explain">
          <view class="title">
            讲解
          </view>
          <view class="explain-content">
            {{ infoObj.content }}
          </view>
        </view>

      </view>
    </view>

    <view class="fixed-box">
      <view class="fixed-item one " @click="jumpCustomerService('https://work.weixin.qq.com/kfid/kfc56ed1d19ae24537e')">
        <image class="icon-tiwen"
               src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/study/icon-tiwen.png?sign=7ace934d2353d335a9a7906d2153ddbd&t=1740974690"></image>
        提问
      </view>
      <view class="fixed-item  btn learning-btn" :class="{'learning-btn-other': Number(infoObj.learningStatus) === 2}"
            @click="changeStatus">
        {{ Number(infoObj.learningStatus) === 2 ? '我已掌握' : '我学会了' }}
      </view>
    </view>
  </view>
</template>
<!--   -->
<script>
import {mapGetters} from "vuex";

export default {
  components: {},
  data() {
    return {
      detail: {},
      pitchIndex: 0,
      picthFourIndex: [],
      level2Dir: '',
      level3Dir: '',
      level4Dir: '',
      pageLoading: true,
      isRequest: false
    }
  },
  watch: {},
  computed: {
    detailKeys() {
      return Object.keys(this.detail)
    },
    //当前选中的 三级
    fourLevel() {
      return this.detail[this.detailKeys[this.pitchIndex]]
    },
    // 当前选中的四级
    infoObj() {
      if (this.fourLevel) {
        return this.fourLevel[this.picthFourIndex[this.pitchIndex] || 0]
      } else {
        return {}
      }
    },
    ...mapGetters(["userinfo"])
  },
  async onLoad(option) { //option为object类型，会序列化上个页面传递的参数
    if (!this.userinfo) {
      await this.$store.dispatch('initUserinfo')
    }
    console.log(option, '页面参数'); //打印出上个页面传递的参数。
    if (option.level2Dir) {
      this.level2Dir = decodeURIComponent(option.level2Dir)
      this.level3Dir = option.level3Dir ? decodeURIComponent(option.level3Dir) : ''
      this.level4Dir = option.level4Dir ? decodeURIComponent(option.level4Dir) : ''
      await this.getListInfo()
      this.detailKeys.forEach((key, index) => {
        this.$set(this.picthFourIndex, index, 0);
      });
      if (this.level3Dir) {
        this.pitchIndex = Object.keys(this.detail).findIndex(e => e === this.level3Dir) || 0
        const currentIndex = this.detail[this.level3Dir].findIndex(e => e.level4Dir === this.level4Dir)
        this.$set(this.picthFourIndex, this.pitchIndex, currentIndex);
      }

      console.log(Object.keys(this.detail))
      console.log(this.detail, 'detial')
    }
  },
  onLaunch() {
  },
  mounted() {
  },
  methods: {
    // 知识点详情 接口  	// knowledge/listInfoBySecondLevel  知识点详情 get
    async getListInfo() {
      const res = await this.$cloudService.call({
        path: '/knowledgeLibrary/listInfoByLevel2Dir',
        method: 'POST',
        data: {
          "level2Dir": this.level2Dir,
          "userId": this.userinfo.id
        }
      })
      this.pageLoading = false
      this.detail = res.data.reduce((pre, cur) => {
        if (!pre[cur['level3Dir']]) {
          pre[cur['level3Dir']] = [];
          pre[cur['level3Dir']].push(cur)
        } else {
          pre[cur['level3Dir']].push(cur)
        }
        return pre
      }, {})
    },
    changeTabOne(index) {
      this.pitchIndex = index;
      if (this.picthFourIndex[index] === undefined) {
        this.$set(this.picthFourIndex, index, 0);
      }
    },
    changeTabTwo(tabOneIndex, tabTwoIndex) {
      this.$set(this.picthFourIndex, tabOneIndex, tabTwoIndex);
    },
    changeStatus() {
      this.setState()
    },
    // 知识状态更新 接口
    async setState() {
      if (this.isRequest) return
      this.isRequest = true
      const res = await this.$cloudService.call({
        path: '/learningProgress/saveOrUpdate',
        method: 'POST',
        data: {
          id: this.infoObj.learningId,
          userId: this.userinfo.id,
          knowledgeId: this.infoObj.id,
          learningStatus: Number(this.infoObj.learningStatus) === 2 ? 1 : 2
        }
      })
      this.isRequest = false
      if (Number(this.infoObj.learningStatus) !== 2) {
        uni.showToast({
          title: `我学会了`,
          icon: 'none'
        })
        this.$set(this.infoObj, 'learningId', res.data)
      }
      const learningStatus = Number(this.infoObj.learningStatus) === 2 ? 1 : 2
      this.$set(this.infoObj, 'learningStatus', learningStatus)
    },
  }
}
</script>

<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
  font-family: 'PingFang sc', serif;
}

.study-info-wrap {
  height: 100vh;
  overflow: scroll;
}

.img {
  width: 100%;
  min-height: 400rpx;

  .imgItem {
    width: 100%;
    height: 100%;
  }
}

.fixed-box {
  position: fixed;
  bottom: 0;
  padding: 24rpx 66rpx calc(24rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  width: 100%;
  display: flex;
  background: #fff;
  justify-content: center;
  align-items: center;

  .fixed-item {
    height: 100%;
  }

  .btn {
    padding: 20rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    border-radius: 200rpx;
    width: 100%;
    box-sizing: border-box
  }

  .one {
    margin-right: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-shrink: 0;
    font-size: 24rpx;
    color: #333;

    .icon-tiwen {
      width: 48rpx;
      height: 48rpx;
      margin-bottom: 4rpx;
    }
  }

  .learning-btn {
    background-color: rgba(90, 185, 91, 1);
  }

  .learning-btn-other {
    background: rgba(125, 134, 125, 0.45);
  }

}

.content {
  .tabOne {
    font-size: 40rpx;
    font-weight: 600;
    white-space: nowrap;

    .tabOne-item {
      display: inline-block;
      padding: 16rpx 40rpx;
      white-space: nowrap;
      font-size: 28rpx;
      box-sizing: border-box;
    }

    .pitch-tabOne {
      margin-top: 0;
      border-radius: 30rpx 30rpx 0 30rpx;
      font-size: 34rpx;
      color: #4882C0;
      background-color: #fff;
      position: relative;
    }
  }

  .info {
    margin: 0 auto;
    padding: 30rpx 26rpx calc(184rpx + env(safe-area-inset-bottom));

    .tabTwo {
      display: flex;
      flex-wrap: wrap;
      /* 以下属性可根据需要调整，用于设置弹性项目之间的间距 */
      gap: 20rpx;
      font-size: 25rpx;

      .tabTwo-item {
        padding: 12rpx 20rpx;
        border: 2rpx solid #F8F8F8;
        background: #F8F8F8;
        color: #1D1E22;
        border-radius: 4rpx;
      }

      .active-click {
        color: #4882C0;
        border-radius: 4rpx;
        border: 2rpx solid #4882C0;
        background: rgba(72, 130, 192, 0.10);
      }

      .active-status {
        color: #1FB150;
        border-radius: 4rpx;
        border: 2rpx solid #1FB150;
        background: rgba(31, 177, 80, 0.10);
      }

      .active-status-click {
        color: #1FB150;
        border-radius: 4rpx;
        border: 1px solid #1FB150;
        background: rgba(27, 155, 71, 0.20);
      }
    }

    .explain {
      padding: 0 10rpx;
      margin-top: 50rpx;

      .title {
        font-size: 36rpx;
        color: rgba(51, 51, 51, 1);
        font-weight: 600;
        line-height: 60rpx;
      }
    }

    .property {
      padding: 0 10rpx;
      margin-top: 64rpx;

      .property-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50rpx;
        font-size: 28rpx;
        color: rgba(29, 30, 34, 1);
      }

    }
  }
}
</style>