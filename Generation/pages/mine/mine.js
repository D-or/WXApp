Page({
  data: {
    windowWidth: 0,
    windowHeight: 0,
    label: [
      [
        "生成历史",
        "../../src/image/generated.png",
        1.5,
        1.2,
        0
      ], [
        "上传历史",
        "../../src/image/uploaded.png",
        1.5,
        1.5,
        0.2
      ], [
        "关于",
        "../../src/image/contact.png",
        1.6,
        1.6,
        0
      ]
    ]
  },

  onTapLabel: function(e) {
    let id = e.currentTarget.id;
    let itemList = ['3155965489@qq.com', 'github.com/DoubleWoodH'];

    switch (id) {
      case "0":
        wx.navigateTo({
          url: "../../pages/generated/generated"
        })
        break;

      case "1":
        wx.navigateTo({
          url: "../../pages/uploaded/uploaded"
        })
        break;

      case "2":
        wx.showActionSheet({
          itemList,
          success: function(res) {
            wx.setClipboardData({
              data: itemList[res.tapIndex],
              success: function() {
                wx.showToast({
                  title: '复制成功',
                  mask: true,
                  icon: 'success',
                  duration: 1000
                })
              }
            })
          }
        })
        break;

      default:
        break
    }
  },

  onLoad: function () {
    let self = this

    try {
      let systemInfo = wx.getSystemInfoSync()

      self.setData({
        windowHeight: systemInfo.windowHeight,
        windowWidth: systemInfo.windowWidth
      })
    } catch (err) {
    }
  }
})
