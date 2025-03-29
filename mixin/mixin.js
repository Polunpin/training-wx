export default {
  computed: {
    headerTop() {
      var header = wx.getMenuButtonBoundingClientRect()
      return header
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
      title: '练车不慌张，护安伴成长',
      path: '/pages/index/index',
      imageUrl: ''  // 可选，自定义分享卡片的图片
    }
  },
  onShareTimeline: function () {
    return {
      title: '自定义分享标题',
      query: '',
      imageUrl: ''  // 可选，自定义分享卡片的图片
    }
  }
}