/*
 * MIT License
 *
 * Copyright (c) 2017 Lin Hao.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*
 * Revision History:
 *     Initial: 2018/01/05      Lin Hao
 */

var wxCharts = require('../../lib/wxcharts-min');
var util = require('../../utils/util');
var lineChart = null;
var appInstance = getApp();

// 你的小程序 ID 及 secret
const APPID = "";
const APPSecret = "";

Page({
  data: {
    windowHeight: 0,
    windowWidth: 0,
    stepInfoList: null
  },

  onTouch: function (e) {
    lineChart.scrollStart(e)
  },

  onMove: function (e) {
    lineChart.scroll(e)
  },

  onTouchEnd: function (e) {
    lineChart.scrollEnd(e)
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    })
  },

  onLoad(e) {
    try {
      let systemInfo = wx.getSystemInfoSync()
      let windowWidth = systemInfo.windowWidth
      let windowHeight = systemInfo.windowHeight

      this.setData({ windowHeight, windowWidth })

      wx.login({
        success(res) {
          wx.request({
            url: `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APPSecret}&js_code=${res.code}&grant_type=authorization_code`,
            success(response) {
              wx.getWeRunData({
                success(res) {
                  wx.request({
                    url: 'http://192.168.199.184:8888/decode',
                    method: "POST",
                    data: {
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      sessionKey: response.data.session_key
                    },
                    success(res) {
                      let data = JSON.parse(res.data)
                      let step = []
                      let time = []
  
                      data.stepInfoList.map((item) => {
                        step.push(item.step)
                        time.push(util.formatTime(new Date(Number(item.timestamp + "000"))))
                      })

                      lineChart = new wxCharts({
                        canvasId: 'lineCanvas',
                        type: 'line',
                        categories: time,
                        animation: true,
                        // background: '#5cb0a4',
                        enableScroll: true,
                        series: [{
                          name: '最近30天',
                          data: step,
                          format: function (val, name) {
                            return val.toFixed(0)
                          }
                        }],
                        xAxis: {
                          disableGrid: true
                        },
                        yAxis: {
                          title: '步数',
                          format: function (val) {
                            return val.toFixed(0)
                          },
                          min: 0
                        },
                        width: windowWidth,
                        height: windowHeight,
                        dataLabel: true,
                        dataPointShape: true,
                        extra: {
                          lineStyle: 'curve'
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
})
