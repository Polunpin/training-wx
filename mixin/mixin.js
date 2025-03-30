export default {
  computed: {
    headerTop() {
      return wx.getMenuButtonBoundingClientRect()
    }
  },
  methods: {
    jumpCustomerService(url) {
      wx.openCustomerServiceChat({
        extInfo: {
          url
        },
        corpId: "wwcb10560218a47a01",
        success(res) {},
        fail(err) {
          console.log(err);
        },
      });
    },
  },
  onShareAppMessage: function () {
    return {
      title: '护安行练车,稳当',
      path: '/pages/index/index',
      imageUrl: ''  // 可选，自定义分享卡片的图片
    }
  },
  onShareTimeline: function () {
    return {
      title: '护安行练车,稳当',
      path: '/pages/index/index',
      imageUrl: ''  // 可选，自定义分享卡片的图片
    }
  }
}