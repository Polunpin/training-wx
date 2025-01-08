<template>
  <view class="container">
    <view class="header">
      <view class="title-box">
        <view class="inner">
          <view class="title">体验课</view>
          <view class="desc">护安行陪驾，开车不再怕</view>
        </view>
        <image src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/hotel-reservation-success.png?sign=b16f7d547e80614556e8ff0a65df60ee&t=1730479658" class="img"></image>
      </view>
    </view>
    <view class="form-box">
      <uni-forms
          ref="form"
          :modelValue="formData"
          label-width="160rpx"
          :label-align="labelPosition">
        <view class="item-title">基本信息</view>
        <view class="border-box">
          <uni-forms-item class="border-box" label="姓名" required>
            <uni-easyinput
                v-model="formData.name"
                placeholder="请填写真实姓名，用于签署学员免责协议"
            />
          </uni-forms-item>
        </view>
        <view class="border-box">
          <uni-forms-item class="border-box" label="手机号" required>
            <uni-easyinput
                type="number"
                v-model="formData.phone"
                placeholder="请输入手机号（大陆地区）"
            />
          </uni-forms-item>
        </view>
        <view class="border-box">
          <uni-forms-item class="border-box" label="接送地址" required>
            <view class="inner" @click="selectAddress">
              <uni-easyinput
                  disabled
                  :disableColor="{ disableColor: '#f5f5f5' }"
                  v-model="formData.address"
                  placeholder="请选择定位"
              />
              <view class="icon-wrap">
                <image
                    src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/address.png?sign=e67e73e99af6613896993a4814d0e56c&t=1730479177"
                    class="icon"
                ></image>
              </view>
            </view>
          </uni-forms-item>
        </view>
        <view class="line"></view>
        <view class="item-title time-box">预约时间
          <view class="total-time" v-show="totalTime">共{{ totalTime }}</view>
        </view>
        <view class="border-box">
          <uni-forms-item class="border-box" label="开始" required>
            <view class="inner" @click="showSelectDate('start')">
              <uni-easyinput
                  disabled
                  v-model="formData.startTime"
                  placeholder="请选择开始时间"
              />
            </view>
            <view class="icon-wrap right">
              <uv-icon
                  class="icon"
                  name="arrow-down"
                  color="#9FA2A8"
                  size="16"
              ></uv-icon>
            </view>
            <!-- 	<uni-datetime-picker @change="handleStartChange" hide-second type="datetime" return-type="timestamp"
              placeholder="请选择开始时间" v-model="formData.startTime" /> -->
          </uni-forms-item>
        </view>
        <view class="border-box">
          <uni-forms-item class="border-box" label="结束" required>
            <view class="inner" @click="showSelectDate('end')">
              <uni-easyinput
                  disabled
                  v-model="formData.endTime"
                  placeholder="请选择结束时间"
              />
            </view>
            <view class="icon-wrap right">
              <uv-icon
                  class="icon"
                  name="arrow-down"
                  color="#9FA2A8"
                  size="16"
              ></uv-icon>
            </view>
            <!-- <uni-datetime-picker :start="formData.startTime" :disabled="formData.startTime === ''" hide-second
              type="datetime" return-type="timestamp" placeholder="请选择结束时间" v-model="formData.endTime" /> -->
          </uni-forms-item>
        </view>
        <view class="line"></view>
        <view class="item-title" style="margin-top:35rpx">驾驶证
          <text class="text">驾驶证照片或交管12123截图</text>
        </view>
        <view class="upload-box">
          <view class="upload" v-if="!imgData" @click="uploadImg">
            <image
                src="../../static/images/image.png"
                class="icon"
            ></image>
            <text class="text">上传图片</text>
          </view>
          <view class="preview" v-else>
            <image
                :src="imgData.url"
                class="image"
                @click="handlePreview"
            ></image>
            <view class="center">
              <view class="name">{{ imgData.name }}</view>
              <view class="size">{{ imgData.size }}</view>
            </view>
            <image
                src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/delete.png?sign=83166bdc57a92a911b5e5e9e83e3a9ac&t=1730479341"
                class="delete"
                @click="handleRemove"
            >
            </image>
          </view>
        </view>
        <view class="item-title" style="margin-top: 22px">备注</view>
        <view class="border-box">
          <uni-easyinput
              v-model="formData.notes"
              type="textarea"
              class="border-box"
              placeholder="请输入备注"
          />
        </view>
      </uni-forms>
    </view>
    <view class="submit-box">
      <button type="primary" class="submit" @click="submit">提交</button>
    </view>
    <uv-datetime-picker
        ref="startTime"
        :minDate="minStarTime"
        :formatter="formatter"
        v-model="startTime"
        mode="datetime"
        @confirm="startConfirm"
    ></uv-datetime-picker>
    <uv-datetime-picker
        ref="endTime"
        :minDate="startTime"
        :formatter="formatter"
        v-model="endTime"
        mode="datetime"
        @confirm="endConfirm"
    ></uv-datetime-picker>
  </view>
</template>

<script>
import {baseURL} from "@/utils/config.js";
import {timeFormat} from "@/uni_modules/uv-ui-tools/libs/function/index.js";
import {mapGetters} from "vuex";
import {get, post} from "@/utils/request.js";

export default {
  data() {
    return {
      labelPosition: "left",
	  hours:0,
      imgData: null, //上传的驾驶证
      //表单数据
      formData: {
        name: "", //姓名
        phone: "", //手机号
        address: "", //接送地址
        startTime: "", //开始时间
        endTime: "", //结束时间
        latitude: "", //纬度
        longitude: "", //经度
        notes: "", //备注
      },
      startTime: "", //开始时间
      endTime: "", //结束时间
      minStarTime: "", //开始选择日期最小限制
      minEndTime: "", //结束选择日期最小限制
      maxEndTime: "", //结束选择日期最大限制
      //格式化时间选择
      formatter(type, value) {
        if (type === "year") {
          return `${value}年`;
        }
        if (type === "month") {
          return `${value}月`;
        }
        if (type === "day") {
          return `${value}日`;
        }
        if (type === "hour") {
          return `${value}时`;
        }
        if (type === "minute") {
          return `${value}分`;
        }
        return value;
      },
    };
  },
  computed: {
    totalTime() {
      if (this.formData.startTime && this.formData.endTime) {
      		const start = new Date(this.formData.startTime.replace(/-/g, '/'));
      		const end = new Date(this.formData.endTime.replace(/-/g, '/'));
      		const difference = end - start;
      		this.hours = Math.floor(difference / (1000 * 60 * 60));
      		const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      		return `${this.hours}小时`;
      		//hours < 10 ? "0" + hours :
      		// ${
      		//   minutes < 10 ? "0" + minutes : minutes
      		// }分
      	}
      	return '';
      },
    ...mapGetters(["userinfo"]),
  },
  onLoad() {
  },
  methods: {
    //开始选择日期确认
    startConfirm(e) {
      this.formData.startTime = timeFormat(e.value, "yyyy-mm-dd hh:MM");
      this.formData.endTime = "";
      this.endTime = "";
    },
    //结束选择日期确认
    endConfirm(e) {
      this.formData.endTime = timeFormat(e.value, "yyyy-mm-dd hh:MM");
    },
    //显示选中时间弹窗
    showSelectDate(name) {
      if (name === "start") {
        this.minStarTime = +new Date();
        this.$refs.startTime.open();
      }
      if (name === "end") {
        if (!this.formData.startTime) {
          uni.showToast({
            title: "请选择开始时间",
            icon: "none",
          });
          return;
        }
        this.$refs.endTime.open();
      }
    },
    //提交
    submit() {
      if (!this.formData.name) {
        uni.showToast({
          title: "请输入姓名",
          icon: "none",
        });
        return;
      }
      if (!this.formData.phone) {
        uni.showToast({
          title: "请输入手机号",
          icon: "none",
        });
        return;
      }
      const reg = /^1[3-9]\d{9}$/;
      if (!reg.test(this.formData.phone)) {
        uni.showToast({
          title: "手机号格式错误",
          icon: "none",
        });
        return;
      }
      if (!this.formData.address) {
        uni.showToast({
          title: "请选择接送地址",
          icon: "none",
        });
        return;
      }
      if (!this.formData.startTime) {
        uni.showToast({
          title: "请选择接预约开始时间",
          icon: "none",
        });
        return;
      }
      if (!this.formData.endTime) {
        uni.showToast({
          title: "请选择接预约结束时间",
          icon: "none",
        });
        return;
      }
      if (!this.imgData) {
        uni.showToast({
          title: "请上传驾驶证",
          icon: "none",
        });
        return;
      }
	  if(this.hours<2){
	  	uni.showToast({
	  		title: '预约时间最低为2小时',
	  		icon: 'none'
	  	});
	  	return;
	  }
	  if(this.hours>6){
	  	uni.showToast({
	  		title: '预约时间高不超过6小时',
	  		icon: 'none'
	  	});
	  	return;
	  }
      const data = {
        openId: uni.getStorageSync("openid"),
        studentId: this.userinfo.id,
        startTime: this.formData.startTime + ":00",
        endTime: this.formData.endTime + ":00",
        longitude: this.formData.longitude,
        latitude: this.formData.latitude,
        address: this.formData.address,
        stuName: this.formData.name,
        telephone: this.formData.phone,
        imageId: this.imgData.imageId,
        notes: this.formData.notes,
		duration:this.totalTime
      };
      uni.showLoading({
        title: "提交中...",
        mask: true,
      });
      return post("/lessonManagement/reservation", data)
          .then((res) => {
            // uni.showToast({
            //   title: "提交成功",
            //   duration: 1000,
            //   mask: true,
            // });
            setTimeout(() => {
              uni.redirectTo({
                url: "/pages/submit/success/success",
              });
            }, 600);
            // this.imgData = null; //上传的驾驶证
            // this.formData.name = ""; //姓名
            // this.formData.phone = ""; //手机号
            // this.formData.address = ""; //接送地址
            // this.formData.startTime = ""; //开始时间
            // this.formData.endTime = ""; //结束时间
            // this.formData.latitude = ""; //纬度
            // this.formData.longitude = ""; //经度
            // this.formData.notes = ""; //备注
            // this.startTime = ""; //开始时间
            // this.endTime = ""; //结束时间
            // this.minStarTime = ""; //开始选择日期最小限制
            // this.minEndTime = ""; //结束选择日期最小限制
            // this.maxEndTime = ""; //结束选择日期最大限制
          })
          .catch((err) => {
            uni.showToast({
              title: "提交失败",
              icon: "none",
              duration: 2000,
            });
            setTimeout(() => {
              uni.redirectTo({
                url: "/pages/submit/fail/fail",
              });
            }, 600);
            console.log(err);
          });
    },
    //开始时间发生变化
    handleStartChange() {
      this.formData.endTime = "";
    },
    async getLocationAndSelectAddress() {
      const _this = this;
      // 获取用户当前位置
      uni.getLocation({
        type: "gcj02",
        highAccuracyExpireTime: true,
        success: (result) => {
          // 打开选择地址界面
          uni.chooseLocation({
            latitude: result.latitude,
            longitude: result.longitude,
            success: (res) => {
              _this.formData.address = res.name;
              _this.formData.latitude = res.latitude;
              _this.formData.longitude = res.longitude;
            },
            fail: (err) => {
              console.log(err);
            },
          });
        },
        fail: (err) => {
          // 检测用户是否授权位置权限
          uni.getSetting({
            success(res) {
              if (!res.authSetting["scope.userLocation"]) {
                // 用户未授权，提示用户
                uni.showModal({
                  title: "需要定位权限",
                  content: "我们需要您的位置权限来提供服务",
                  success: (modalRes) => {
                    if (modalRes.confirm) {
                      // 用户同意，打开设置页面
                      uni.openSetting({
                        success(settingRes) {
                          if (settingRes.authSetting["scope.userLocation"]) {
                            _this.getLocationAndSelectAddress();
                          } else {
                            // 用户依然拒绝授权，可以再次提示或者提供替代方案
                            uni.showToast({
                              title: "需要您授权位置权限",
                              icon: "none",
                            });
                          }
                        },
                      });
                    }
                  },
                });
              }
            },
          });
        },
      });
    },
    //选择地址
    selectAddress() {
      this.getLocationAndSelectAddress();
    },
    //移除图片
    handleRemove() {
      const _this = this;
      uni.showModal({
        title: "是否移除当前图片",
        success(res) {
          if (res.confirm) {
            _this.imgData = null;
          }
        },
      });
    },
    //预览图片
    handlePreview() {
      uni.previewImage({
        urls: [this.imgData.url],
      });
    },
    //上传图片
    uploadImg() {
      const _this = this;

      uni.chooseImage({
        count: 1,
        success(res) {
          uni.showLoading({
            title: "上传中...",
            mask: true,
          });
          uni.uploadFile({
            url: baseURL + "/weCom/uploadFile",
            filePath: res.tempFilePaths[0],
            name: "file",
            formData: {
              stuId: _this.userinfo.id,
            },
            success: (result) => {
              const data = JSON.parse(result.data);
              _this.imgData = {};
              _this.imgData.imageId = data.data;
              _this.imgData.url = res.tempFilePaths[0];
              _this.imgData.name = "大小";
              _this.imgData.size =
                  Math.floor(res.tempFiles[0].size / 1024) + "KB";
              uni.showToast({
                title: "上传成功",
                icon: "none",
              });
            },
            fail(err) {
              uni.showToast({
                title: "上传失败",
                icon: "none",
              });
              _this.imgData = null;
              console.log(err);
            },
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  height: 1rpx;
  background: #f7f7f7 !important;
  margin-top: 35rpx;
}

/deep/ .border-box {
  margin-top: 25rpx;
  border: solid 1px #64b0d2 !important;
  border-radius: 15rpx;
}

.container {
  padding-bottom: 120rpx;
  line-height: 1;

  .header {
    box-sizing: border-box;
    width: 100%;
    height: 129px;
    flex-shrink: 0;
    padding: 0 28rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #ebf8fb;

    .title-box {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .inner {
        padding: 0 20rpx;

        .title {
          color: #040404;
          font-family: "Work Sans";
          font-size: 28px;
          font-style: normal;
          font-weight: 600;
          line-height: 60px;
        }

        .desc {
          color: #64B0D2;
          text-align: center;
          font-family: "PingFang SC";
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 22px;
          letter-spacing: -0.408px;
        }
      }

      .img {
        width: 110px;
        height: 110px;
        flex-shrink: 0;
      }
    }
  }

  /deep/ .uni-forms-item {
    margin-bottom: 0 !important;
    padding: 0 15rpx;
  }

  /deep/ .uni-forms-item.is-direction-left {
    align-items: center !important;
  }

  /deep/ .form-box {
    padding: 48rpx 24rpx;

    .time-box {
      margin-top: 35rpx;
      justify-content: space-between;
    }

    .total-time {
      color: #999999;
      text-align: left;
      font-size: 26rpx;
      position: relative;
    }

    .upload-box {
      padding: 20rpx 20rpx;
      border-radius: 12rpx;
      background-color: #f5f5f5;

      .preview {
        display: flex;
        align-items: center;
        height: 72rpx;

        .image {
          flex: 0 0 72rpx;
          height: 72rpx;
          margin-right: 12rpx;
        }

        .center {
          color: #1c1f1c;
          font-size: 28rpx;

          .size {
            margin-top: 5rpx;
            color: #595b59;
            font-size: 20rpx;
          }
        }

        .delete {
          width: 36rpx;
          height: 36rpx;
          margin-left: auto;
        }
      }

      .upload {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 72rpx;

        .icon {
          width: 30rpx;
          height: 30rpx;
          margin-right: 12rpx;
        }

        .text {
          color: #b3b3b3;
          font-size: 24rpx;
          font-weight: bold;
        }
      }
    }

    .item-title {
      display: flex;
      align-items: center;
      margin-bottom: 42rpx;
      color: #000000;
      font-size: 30rpx;
      font-weight: bold;

      .text {
        margin-left: auto;
        color: #b3b3b3;
        font-size: 24rpx;
        font-weight: 0;
      }
    }

    .inner {
      position: relative;
      padding-right: 80rpx;
      background: #ffffff; //#f5f5f5
      border-radius: 15rpx;
    }

    .icon-wrap {
      position: absolute;
      right: 15rpx;
      top: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform: translateY(-50%);

      &.right {
        right: 22rpx;
      }

      .icon {
        width: 36rpx;
        height: 36rpx;
      }
    }

    .uni-forms-item__label,
    .uni-easyinput__content-input {
      height: 92rpx;
      line-height: 92rpx;
      font-size: 30rpx !important;
    }

    .uni-date,
    .uni-date-x {
      border-radius: 12rpx;
      overflow: hidden;
    }

    .uni-date-x--border,
    .is-input-border {
      border: none !important; //#f5f5f5
      border-radius: 12rpx;
    }

    .is-focused {
      border-color: #96d2f0 !important;
    }

    .is-disabled .uni-easyinput__placeholder-class,
    .is-disabled {
      background-color: #ffffff !important;
      color: #999;
    }

    .uni-date-x,
    .uni-date-editor,
    .uni-easyinput__content {
      background-color: #ffffff !important;
    }
  }

  .submit-box {
    z-index: 10;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 30rpx 28rpx;
    box-shadow: -5rpx 0 10rpx rgba(0, 0, 0, 0.1);
    background: #ffffff;

    .submit {
      border-radius: 50rpx;
      background: #4882c0; // #007aff;
    }
  }
}
</style>
