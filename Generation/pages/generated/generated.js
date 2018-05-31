Page({
  data: {
    list: [],
    windowHeight: 0,
    windowWidth: 0
  },

  onPreview(e) {
    const { image, urls } = e.currentTarget.dataset;

    wx.previewImage({
      current: image,
      urls: urls.slice(0, 2)
    })
  },

  onSave(e) {
    const { image } = e.currentTarget.dataset;

    wx.showActionSheet({
      itemList: ["收入相册中"],
      success: function(res) {
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.writePhotosAlbum'] === false) {
              wx.showToast({
                title: '@_@ 我看不了你的相册，只能删了我重新来了...',
                mask: true,
                icon: 'none',
                duration: 1500
              })
            } else {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  wx.showLoading({
                    title: '正在收入囊中...',
                    mask: true
                  })
    
                  wx.getImageInfo({
                    src: image,
                    success: function (data) {
                      wx.saveImageToPhotosAlbum({
                        filePath: data.path,
                        success(res) {
                          wx.hideLoading()
                          wx.showToast({
                            title: '˃.˂ 收起来了耶~',
                            mask: true,
                            icon: 'success',
                            duration: 1000
                          })
              
                          self.setData({
                            generated: ""
                          })
                        },
                        fail: function() {
                          wx.hideLoading()
                          wx.showToast({
                            title: '(｡ŏ_ŏ) 它溜了...',
                            mask: true,
                            icon: 'none',
                            duration: 1000
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  },

  onLoad: function() {
    let self = this;
    const util = require("../../utils/util.js");

    try {
      let userID = wx.getStorageSync("id")
      let res = wx.getSystemInfoSync();
      const { windowWidth, windowHeight } = res;

      this.setData({ windowWidth, windowHeight })

      if (!userID) {
        wx.showToast({
          title: '你已经拒绝了我，登录不了，哼！',
          mask: true,
          icon: 'none',
          duration: 1000
        })

        return
      }

      wx.showLoading({
        title: '看看你的生成历史...',
        mask: true
      })

      wx.request({
        method: "POST",
        url: "https://www.doublewoodh.club/api/image/getall",
        data: {
          "userID": userID
        },
        success: function(res) {
          wx.hideLoading();

          if (res.statusCode !== 200) {
            wx.showToast({
              title: '你的网络有点问题吧',
              mask: true,
              icon: 'none',
              duration: 1000
            })

            return
          }

          let images = res.data.images;
          let list = [];

          if (!images) {
            return
          }

          images.map((item, index) => {
            if (index % 2 === 0) {
              let once = [];

              once.push(item.path);
              once.push(images[index + 1].path);
              once.push(util.formatTime(new Date(item.created)));

              list.unshift(once);
            }
          })

          self.setData({ list })
        },
        fail: function() {
          wx.hideLoading();
        }
      })
    } catch (e) {
    }
  }
})