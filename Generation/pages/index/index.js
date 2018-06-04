/*
 * Revision History:
 *     Initial: 2018/05/25      Lin Hao
 */

Page({
  data: {
    windowHeight: 0,
    windowWidth: 0,
    textLines: 1,
    image: "",
    generated: "",
    choices: ["图片下", "图片内", "图片上"],
    sliderValue: 0,
    color: "black",
    slideIn: null
  },

  onChooseImage() {
    let self = this;

    wx.chooseImage({
      count: 1,
      success(res) {
        self.setData({
          image: res.tempFilePaths[0]
        })
      }
    })
  },

  onAddText() {
    let textLines = this.data.textLines;
    textLines++;

    this.setData({ textLines })
  },

  onMinuxText() {
    let textLines = this.data.textLines;
    textLines--;

    this.setData({ textLines })
  },

  onDrag(e) {
    const value = e.detail.value;

    if (value < 25) {
      for (let i = value; i >= 0; i--) {
        setTimeout(() => this.setData({
          sliderValue: i
        }), 50)
      }
    } else if (value >= 25 && value <= 75) {
      if (value > 50) {
        for (let i = value; i >= 50; i--) {
          setTimeout(() => this.setData({
            sliderValue: i
          }), 50)
        }
      } else {
        for (let i = value; i <= 50; i++) {
          setTimeout(() => this.setData({
            sliderValue: i
          }), 50)
        }
      }
    } else {
      for (let i = value; i <= 100; i++) {
        setTimeout(() => this.setData({
          sliderValue: i
        }), 50)
      }
    }
  },

  onSwitch(e) {
    let color = "black";
    let value = e.detail.value;

    if (!value) {
      color = "white";
    }

    this.setData({ color })
  },

  onGenerate(e) {
    let self = this;
    let value = e.detail.value;
    let texts = [];
    let userID;
    let position = "bottom";

    if (self.data.sliderValue === 50) {
      position = "inside";
    } else if (self.data.sliderValue === 100) {
      position = "top";
    }

    try {
      userID = wx.getStorageSync("id")

      if (!userID) {
        wx.showToast({
          title: '你已经拒绝了我，登录不了，哼！',
          mask: true,
          icon: 'none',
          duration: 1000
        })

        return
      }
    } catch (e) {
    }

    if (!self.data.image) {
      wx.showToast({
        title: '(￣_￣ )不跟没有图的人交朋友',
        mask: true,
        icon: 'none',
        duration: 1500
      })

      return
    }
    
    for (let i in value) {
      if (value[i]) {
        texts.push(value[i])
      }
    }

    if (texts.length === 0) {
      wx.showToast({
        title: '(￣_￣ )表情包除了图，总得有几句话的吧',
        mask: true,
        icon: 'none',
        duration: 1500
      })

      return
    }

    texts = JSON.stringify(texts)

    wx.showLoading({
      title: '^_^ 玩命制作中...',
      mask: true
    })

    wx.uploadFile({
      url: 'https://www.doublewoodh.club/api/image/generate',
      filePath: self.data.image,
      name: 'image',
      formData:{
        'name': 'test',
        'texts': texts,
        'userID': userID,
        "position": position,
        "color": self.data.color
      },
      success: function(res) {
        let data = JSON.parse(res.data);
        wx.hideLoading()

        switch (data.imageId) {
          case 0:
            wx.showToast({
              title: 'Σ( ° △ °) 有不该有的文字耶~',
              mask: true,
              icon: 'none',
              duration: 1000
            })
            break;

          case -1:
            wx.showToast({
              title: '(╯°Д°)╯ ┻━┻ 没成功，再来一次！',
              mask: true,
              icon: 'none',
              duration: 1000
            })
            break;
        
          default:
            wx.showToast({
              title: '@.@ 有了有了！',
              mask: true,
              icon: 'success',
              duration: 1000
            })

            self.setData({
              generated: data.image
            })
            break;
        }
      },
      fail: function(err) {
        wx.hideLoading()
        wx.showToast({
          title: '(╯°Д°)╯ ┻━┻ 没成功，再来一次！',
          mask: true,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  onSave() {
    let self = this;

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
                src: self.data.generated,
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
  },

  onDiscard() {
    this.setData({
      generated: ""
    })
  },

  onSlideIn() {
    let slideIn = this.data.slideIn;

    this.setData({
      slideIn: !slideIn
    })
  },

  onLoad() {
    const util = require("../../utils/util.js");
    util.GetUserID();

    try {
      let res = wx.getSystemInfoSync();
      const { windowWidth, windowHeight } = res;

      this.setData({ windowWidth, windowHeight })
    } catch (e) {
    }
  }
})
