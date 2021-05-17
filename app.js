// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getHeight()
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  getHeight: function() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.statusBarHeight = res.statusBarHeight;
        this.globalData.screenHeight  = res.screenHeight;
        this.globalData.bodyHeight = res.windowHeight;
      }
    });
  },

  globalData: {
    baseUrl: "http://172.20.10.5:8888/",
    userInfo: null,
    openId: ""
  }         
})
