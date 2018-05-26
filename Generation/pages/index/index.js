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
    generated: ""
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

  onGenerate(e) {
    let self = this;
    let value = e.detail.value;
    let texts = []

    if (!this.data.image) {
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

    if (texts.length === 1) {
      texts = ["", texts[0], ""]
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
      mask: true,
      duration: 1000
    })

    wx.uploadFile({
      url: 'https://www.doublewoodh.club/api/image/generate',
      filePath: self.data.image,
      name: 'image',
      formData:{
        'name': 'test',
        'texts': texts
      },
      success: function(res) {
        let data = JSON.parse(res.data);
        
        if (data.imageId !== -1) {
          wx.showToast({
            title: '@.@ 有了有了！',
            mask: true,
            icon: 'success',
            duration: 1000
          })

          self.setData({
            generated: data.image,
            textLines: 0
          })

          self.setData({
            textLines: 1
          })
        }
      },
      fail: function(err) {
        console.error(err)
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

  onLoad() {
    try {
      let res = wx.getSystemInfoSync();
      const { windowWidth, windowHeight } = res;

      this.setData({ windowWidth, windowHeight })
    } catch (e) {
    }
  }
})
