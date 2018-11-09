/*
 * Revision History:
 *     Initial:        2018/11/09        DoubleWoodH
 */

Page({
  data: {
    windowWidth: 0,
    windowHeight: 0,
    count: 0,
    userInfo: null,
    scopeUserInfo: false,
    message: "",
    phoneOrMail: "",
    err: false
  },

  onTextarea(e) {
    const { value } = e.detail;

    this.setData({
      message: value,
      count: value.length
    })
  },

  onBlur(e) {
    this.setData({
      phoneOrMail: e.detail.value
    })
  },

  onInput() {
    this.setData({
      err: false
    })
  },

  onFeedback({}, that) {
    let self = that ? that : this;
    const { userInfo, phoneOrMail, message } = self.data;

    if (!message) {
      wx.showToast({
        title: '总得说点什么吧...',
        mask: true,
        icon: 'none',
        duration: 1000
      })

      return
    }

    if (phoneOrMail) {
      if (!phoneOrMail.match(/\w+[@]{1}\w+[.]\w+/) && !phoneOrMail.match(/^1\d{10}$/)) {
        this.setData({
          err: true
        })

        return
      }
    }

    const { avatarUrl:avatar, nickName, gender, country, province, city } = userInfo;
    let data = {
      userID: wx.getStorageSync("id") ? Number(wx.getStorageSync("id")) : -1,
      userName: nickName,
      avatar,
      gender,
      address: country+"_"+province+"_"+city,
      phoneOrMail,
      message
    };

    wx.showLoading({
      title: '^_^ 正在提交中...',
      mask: true
    })

    try {
      wx.request({
        url: "https://www.doublewoodh.club/api/user/feedback",
        method: "POST",
        data,
        success(res) {
          wx.hideLoading()

          if (res.statusCode === 200 && res.data != -1) {
            wx.showToast({
              title: '提交成功！',
              mask: true,
              icon: 'success',
              duration: 1000
            })
          } else {
            wx.showToast({
              title: '(╯°Д°)╯ ┻━┻ 没成功，再来一次！',
              mask: true,
              icon: 'none',
              duration: 1000
            })
          }
        },
        fail() {
          wx.hideLoading()
          wx.showToast({
            title: '(╯°Д°)╯ ┻━┻ 没成功，再来一次！',
            mask: true,
            icon: 'none',
            duration: 1000
          })
        }
      })
    } catch (err) {
    }
  },

  onUserInfo(e) {
    let self = this;
    const { userInfo } = e.detail;

    try {
      if (userInfo) {
        wx.setStorageSync('scope.userInfo', true)
  
        this.setData({
          userInfo,
          scopeUserInfo: true
        })

        self.onFeedback(self)
      } else {
        wx.showToast({
          title: '拒绝了我就无法反馈哦~',
          mask: true,
          icon: 'none',
          duration: 800
        })
      }
    } catch (err) {
    }
  },

  onLoad() {
    let self = this

    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              self.setData({
                userInfo: res.userInfo,
                scopeUserInfo: true
              })
            }
          })
        }
      }
    })

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