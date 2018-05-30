Page({
  data: {
    windowWidth: 0,
    windowHeight: 0,
    label: [
      [
        "生成历史",
        "../../src/image/generated.png",
        1.5,
        1.2
      ], [
        "联系我",
        "../../src/image/contact.png",
        1.5,
        1.5
      ]
    ]
  },

  onTapLabel: function(e) {
    let id = e.currentTarget.id

    switch (id) {
      case "0":
        // wx.navigateTo({
        //   url: "../../pages/collection/collection"
        // })
        break

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
