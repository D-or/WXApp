/*
 * Revision History:
 *     Initial: 2018/06/06      Lin Hao
 */

Page({
  data: {
    list: [],
    windowHeight: 0,
    windowWidth: 0,
    touchStart: 0,
    distance: 0,
    opacity: 0,
    currentTargetId: 0
  },

  onPreview(e) {
    const { image } = e.currentTarget.dataset;

    wx.previewImage({
      current: image,
      urls: [image]
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

  onInit() {
    this.setData({
      opacity: 0
    })
  },

  onTouchStart(e) {
    this.setData({
      opacity: 0
    })

    let point = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    this.setData({
      currentTargetId: e.currentTarget.id,
      touchStart: point
    })
  },

  onTouchMove(e) {
    let distance = this.data.touchStart.x - e.changedTouches[0].clientX;
    let yDis = e.changedTouches[0].clientY - this.data.touchStart.y;

    if (yDis > 150) {
      this.setData({
        opacity: 0
      })

      return
    }

    this.setData({ distance })

    if (distance > 0) {
      distance /= 250

      this.setData({
        opacity: distance
      })
    }
  },

  onTouchEnd(e) {
    let finalDistance = this.data.touchStart.x - e.changedTouches[0].clientX

    let yDis = e.changedTouches[0].clientY - this.data.touchStart.y;

    if (yDis > 150) {
      this.setData({
        opacity: 0
      })

      return
    }

    if (finalDistance < 100) {
      this.setData({
        opacity: 0
      })
    } else {
      this.setData({
        opacity: 1
      })
    }
  },  

  onDelete(e) {
    let self = this;

    wx.showLoading({
      title: '正在删除中...',
      mask: true
    })

    wx.request({
      method: "POST",
      url: "https://www.doublewoodh.club/api/image/uploaded/delete",
      data: {
        "id": [self.data.list[e.currentTarget.id].id]
      },
      success: function(res) {
        wx.hideLoading()

        const { status } = res.data;

        if (status === 0) {
          let list = self.data.list;
          list.splice(e.currentTarget.id, 1);

          self.setData({ list })
  
          wx.showToast({
            title: '黑历史删掉了~',
            mask: true,
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: "完了，黑历史没有删掉...",
            mask: true,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function() {
        wx.hideLoading()

        wx.showToast({
          title: "完了，黑历史没有删掉...",
          mask: true,
          icon: 'none',
          duration: 1000
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
        title: '看看你的上传历史...',
        mask: true
      })

      wx.request({
        method: "POST",
        url: "https://www.doublewoodh.club/api/image/uploaded/getbyuserid",
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

          let list = res.data.images;

          list.map((item) => {
            item.created = util.formatTime(new Date(item.created));
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