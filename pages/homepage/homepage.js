// pages/homepage/homepage.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenId()
    this.setData({
      height: app.globalData.bodyHeight
    })
  },

  //显示错误信息
  showErrMsg: function(msg) {
    Dialog.alert({
      message: msg
    }).then(() => {
      // on close
    });
  },

  //获取OpenID
  getOpenId: function() {
    let baseUrl = app.globalData.baseUrl
    let _this = this
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: baseUrl + 'user/get-openid',
            data: {
              code: res.code
            },
            method: "GET",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              // console.log("getOpenId() RES : ", res)
              if(res.data.state) {
                app.globalData.openId = res.data.openId
                _this.setData({
                  openId: res.data.openId
                })
                console.log("openid=", app.globalData.openId)
              } else {
                _this.showErrMsg("获取OpenID失败！")
                console.log("获取OpenID失败！\n", res.data.msg)
              }
            },
            fail: function(res) {
              _this.showErrMsg("获取OpenID失败！")
              console.log("failed")
            }
          })
        } else {
          _this.showErrMsg("登录失败！")
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  //获取用户昵称
  getUserName: function() {
    let _this = this
    wx.getUserProfile({
      desc: '用于登记管理员信息', 
      success: function(res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName

        // console.log("userInfo : ", userInfo)
        app.globalData.userInfo = userInfo
        _this.setData({
          nickName: nickName
        })
        _this.getRegister()
      },
      fail: function(res) {
        _this.showErrMsg("获取用户信息失败！")
        console.log("getUserName() failed :\n", res)
      }
    })
  },

  //获取用户权限或注册新用户
  getRegister: function() {
    let baseUrl = app.globalData.baseUrl
    let _this = this
    let openId = this.data.openId
    let nickName = this.data.nickName

    wx.request({
      url: baseUrl + 'user/register',
      data: {
        openId: openId,
        name: nickName
      },
      method: "GET",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        app.globalData.purview = res.data.purview
        _this.setData({
          purview: res.data.purview
        })
        // app.globalData.purview = res.data.purview
        _this.go2Info()
      },
      fail: function(res) {
        _this.showErrMsg("注册失败！")
        console.log("getRegister() FAIL : ", res)
      }
    })
  },

  //获取用户权限
  getPower: function() {
    let baseUrl = app.globalData.baseUrl
    let _this = this
    let openId = this.data.openId
    // this.go2Info()
    wx.request({
      url: baseUrl + 'user/get-purview',
      data: {
        openId: openId
      },
      method: "GET",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log("getPower() RES : ", res)
        app.globalData.purview = res.data.purview
        _this.setData({
          purview: res.data.purview
        })
        // _this.go2Info()
      },
      fail: function(res) {
        _this.showErrMsg("获取权限失败！")
        console.log("getPower() failed :\n", res)
      }
    })
  },

  //点击登录按钮触发登录
  getLogin: function() {
    let openId = this.data.openId
    this.getUserName()
  },

  //转跳至车信息页
  go2Info: function() {
    switch (this.data.purview) {
      case 1:
        wx.switchTab({
          url: '/pages/cartInfo-admin/cartInfo',
        })
        break
      case 2:
        wx.navigateTo({
          url: '../cartInfo/cartInfo',
        })
        break
      default:
        wx.navigateTo({
          url: '../cartInfo/cartInfo',
        })
        break
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})