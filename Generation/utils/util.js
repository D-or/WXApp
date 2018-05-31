/*
 * Revision History:
 *     Initial: 2018/05/25      Lin Hao
 */

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const Login = () => {
  try {
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.request({
            url: 'https://www.doublewoodh.club/api/user/login',
            method: "POST",
            data: {
              code: res.code
            },
            success: function(resp) {
              const { userID } = resp.data;
  
              if (userID === -1) {
                wx.showToast({
                  title: '登录不了，是不是你拒绝了我...还是网络的问题呢？',
                  mask: true,
                  icon: 'none',
                  duration: 1000
                })
              } else {
                try {
                  wx.setStorageSync('id', userID)
                } catch (e) {    
                }
              }
            }
          })
        } else {
          wx.showToast({
            title: '登录不了，是不是你拒绝了我...还是网络的问题呢？',
            mask: true,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '登录不了，是不是你拒绝了我...还是网络的问题呢？',
          mask: true,
          icon: 'none',
          duration: 1000
        })
      }
    })
  } catch(e) {
  }
}

const GetUserID = () => {
  try {
    let id = wx.getStorageSync('id')
    if (id) {
      return id;
    } else {
      Login();
    }
  } catch (e) {    
  }
}

module.exports = {
  formatTime,
  Login,
  GetUserID
}
