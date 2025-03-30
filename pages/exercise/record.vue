<template>
  <div class="record-wrap no-scrollbar">
    <div class="record-list" v-if="!pageLoading && recordList.length">
      <div class="list-item" v-for="(item, index) in recordList" :key="index">
        <div class="item-header">
          <div class="header-title">
            <image class="title-icon"
                   src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/record-base-icon.png?sign=9471c86d37d63201dc9ea755e00e659e&t=1742122911"/>
            {{ item.type }}
          </div>
          <div class="header-distance">{{ item.totalDistance }}Km</div>
        </div>
        <div class="item-child" v-for="(childItem, childIndex) in item.practiceRecord" :key="childIndex"
             @click="toReport(childItem.id)">
          <div class="child-map">
            <map
                :include-points="childItem.trajectory"
                :id="`track-review-map-${childItem.id}`"
                :enable-zoom="false"
                :enable-scroll="false"
                :polyline="childItem.polyline"
                class="track-preview-map"
            >
            </map>
          </div>
          <div class="child-info">
            <div class="info-distance">
              {{ childItem.distance }}
              <text>Km</text>
            </div>
            <div class="info-time">
              {{ childItem.duration }}
            </div>
            <div class="info-date">
              {{ childItem.consumptionTime }}
            </div>
          </div>
          <div class="child-btn">
            <image v-if="Number(childItem.isRecord) === 0" @click.stop="openSummarizePopup(childItem)"
                   src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/icon-edit.png?sign=345f0ea638667a885fea612325e8c2fe&t=1742297744"/>
            <image v-else
                   src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/exercise/icon-share.png?sign=345f0ea638667a885fea612325e8c2fe&t=1742297744"/>
          </div>
        </div>
      </div>
    </div>
    <!-- 信息 -->
    <div class="summarize-popup"
         :style="{height: showSummarizePopup ? `calc(100vh - 10px)` : 0}"
    >
      <div class="popup-content" v-if="showSummarizePopup">
        <div class="close-box" @touchend.stop="closePopup"></div>
        <Summarize :reportId="reportId" @toSave="toSave" @toReport="toReport"/>
      </div>
    </div>
    <!-- 空 -->
    <Empty class="record-empty" v-if="!pageLoading && !recordList.length"/>
  </div>
</template>
<script>
import Summarize from './components/Summarize.vue'
import {mapGetters} from "vuex";
import Empty from '@/components/empty.vue'

export default {
  components: {
    Summarize,
    Empty
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  data() {
    return {
      reportId: 0,
      showSummarizePopup: false,
      recordList: [],
      mapContext: [],
      pageLoading: true
    }
  },
  async onLoad() {
    if (!this.userinfo) {
      await this.$store.dispatch('initUserinfo')
    }
    this.getRecordList()
  },
  methods: {
    // 获取练习记录列表
    async getRecordList() {
      const res = await this.$cloudService.call({
        path: '/practiceRecord/getPracticeRecordList',
        data: {userId: this.userinfo.id}
      })
      res.data.forEach(record => {
        record.practiceRecord.forEach(practice => {
          let id = practice.id;
          this.mapContext[id] = wx.createMapContext(`track-review-map-${id}`);
          practice.polyline = [{
            points: practice.trajectory || [],
            borderColor: '#ffffff',
            borderWidth: 1,
            level: "abovelabels",
            dottedLine: false,
            color: '#16dd90',
            width: 7,
            arrowLine: false,
          }]
        });
      });
      this.pageLoading = false
      this.recordList = res.data


    },
    openSummarizePopup(item) {
      this.reportId = item.id
      this.showSummarizePopup = true
    },
    closePopup() {
      this.showSummarizePopup = false
    },
    toSave() {
      this.closePopup()
    },
    toReport(id = '') {
      const urlid = id || this.reportId
      uni.navigateTo({url: `/pages/exercise/report?id=${urlid}&type=record`})
      setTimeout(() => {
        this.closePopup()
      }, 2000)
    }
  },
}
</script>
<style lang="scss" scoped>
.record-wrap {
  height: 100vh;
  overflow: auto;
  background: #f8f8f8;
  padding: 32rpx;
  box-sizing: border-box;
  position: relative;

  .record-list {
    .list-item {
      background: #fff;
      border-radius: 20rpx 20rpx 0 0;
      margin-bottom: 32rpx;

      .item-header {
        padding: 20rpx 24rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -50%;
          display: block;
          height: 2rpx;
          width: 200%;
          background: rgba(3, 16, 42, 0.08);
          transform: scale(0.5);
        }

        .header-title {
          font-size: 28rpx;
          display: flex;
          align-items: center;
          font-weight: 500;

          .title-icon {
            width: 48rpx;
            height: 48rpx;
            margin-right: 10rpx;
          }
        }

        .header-distance {
          font-size: 28rpx;
        }
      }

      .item-child {
        display: flex;
        align-items: center;
        position: relative;
        padding: 14rpx 24rpx;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -50%;
          display: block;
          height: 2rpx;
          width: 200%;
          background: rgba(3, 16, 42, 0.08);
          transform: scale(0.5);

          &:last-child {
            &::after {
              display: none;
            }
          }
        }

        .child-map {
          width: 226rpx;
          height: 226rpx;
          flex-shrink: 0;

          .track-preview-map {
            width: 100%;
            height: 100%;
          }

        }

        .child-info {
          align-self: flex-end;
          flex: 1;
          margin: 0 20rpx 10rpx;

          .info-distance {
            font-size: 40rpx;
            line-height: 40rpx;
            margin-bottom: 10rpx;
          }

          .info-time {
            font-size: 24rpx;
            line-height: 24rpx;
            color: #6C6C6D;
            margin-bottom: 10rpx;
          }

          .info-date {
            line-height: 20rpx;
            font-size: 20rpx;
            color: #6C6C6D;
          }
        }

        .child-btn {
          flex-shrink: 0;

          image {
            width: 48rpx;
            height: 44rpx;
          }
        }
      }
    }
  }

  .record-empty {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.summarize-popup {
  position: fixed;
  z-index: 200;
  width: 100%;
  bottom: 0;
  left: 0;
  border-radius: 32rpx 32rpx 0 0;
  overflow: hidden;
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.2);
  transition: all 0.3s;

  .popup-content {
    height: 100%;
    position: relative;

    .close-box {
      width: 100%;
      height: 40rpx;;

      &::after {
        content: '';
        position: absolute;
        top: 16rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 64rpx;
        height: 8rpx;
        background: rgba(3, 16, 42, 0.16);
        border-radius: 8rpx;
      }
    }
  }

}
</style>