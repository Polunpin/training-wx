<template>
  <div class="container">
    <!-- 头部信息 -->
    <header class="header">
      <h1>安全驾驶新玩法</h1>
      <p>30 天内自信上路保证</p>
    </header>

    <!-- 功能列表 -->
    <ul class="features">
      <li>
        <span class="checkmark">&#10004;</span>
        系统课程 · 从新手到专家
      </li>
      <li>
        <span class="checkmark">&#10004;</span>
        一键练习 · 驾驶轨迹分析
      </li>
      <li>
        <span class="checkmark">&#10004;</span>
        趣味挑战 · 金币兑换好礼
      </li>
      <li>
        <span class="checkmark">&#10004;</span>
        在线答疑 · 有问题不用怕
      </li>
    </ul>

    <!-- 订阅选项 -->
    <div class="subscription-options">
      <label class="subscription-option" :class="{ active: selectedOption === 'monthly' }">
        <input type="radio" name="subscription" value="monthly" v-model="selectedOption" />
        <span class="price">¥88.00/月</span>
        <span class="description">按月订阅</span>
      </label>
      <label class="subscription-option" :class="{ active: selectedOption === 'permanent' }">
        <input type="radio" name="subscription" value="permanent" v-model="selectedOption" />
        <span class="price">¥199.00/永久</span>
        <span class="description">安全永相伴</span>
      </label>
    </div>

    <!-- 立即解锁按钮 -->
    <button class="unlock-button" @click="unlockSubscription">安全驾驶·立即解锁</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedOption: 'monthly', // 默认选中按月订阅
      pageLoading: true, // 加载状态
    };
  },

  methods: {
    async getPay() {
      try {
        const res = await this.$cloudService.call({
          path: '/comprehensive/pay',
          data: {amount: 1}
        });
        this.pageLoading = false;
        this.dataInfo = res.data || {};
      } catch (error) {
        console.error('获取支付参数失败:', error);
        this.pageLoading = false;
        wx.showToast({
          title: '获取支付参数失败，请稍后再试',
          icon: 'none',
        });
      }
    },

    async unlockSubscription() {
      // 1. 调用 getPay 获取支付参数
      await this.getPay();
      // const res = await this.$cloudService.call({
      //   path: '/comprehensive/pay',
      // })
      // this.pageLoading = false
      // this.dataInfo = res.data || {}
      // console.log(this.dataInfo)
      // console.log(this.dataInfo.timeStamp)

      // // 2. 检查支付参数是否成功获取
      // if (!this.dataInfo.timeStamp || !this.dataInfo.nonceStr || !this.dataInfo.package || !this.dataInfo.signType || !this.dataInfo.paySign) {
      //   console.info(this.dataInfo.timeStamp);
      //   wx.showToast({
      //     title: '支付参数不完整，请稍后再试',
      //     icon: 'none',
      //   });
      //   return;
      // }

      // 3. 执行支付操作
      wx.requestPayment({
        timeStamp: this.dataInfo.timeStamp,
        nonceStr: this.dataInfo.nonceStr,
        package: this.dataInfo.package,
        signType: this.dataInfo.signType,
        paySign: this.dataInfo.paySign,
        success(res) {
          console.log('支付成功:', res);
          wx.showToast({
            title: '支付成功',
            icon: 'success',
          });
        },
      });
    },
  },
};
</script>

<style scoped>
/* 全局样式 */
.container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* 头部样式 */
.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 24px;
  margin: 0;
}

.header p {
  font-size: 20px;
  margin-top: 5px;
}

/* 功能列表样式 */
.features {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.features li {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.checkmark {
  font-size: 20px;
  color: green;
  margin-right: 10px;
}

/* 订阅选项样式 */
.subscription-options {
  margin-top: 30px;
}

.subscription-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}

.subscription-option.active {
  background-color: #f0f0f0;
}

.subscription-option input[type="radio"] {
  margin-right: 10px;
}

.price {
  font-size: 18px;
  font-weight: bold;
}

.description {
  font-size: 14px;
}

/* 立即解锁按钮样式 */
.unlock-button {
  width: 100%;
  padding: 15px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 30px;
}
</style>
