// pages/cartInfo-admin/user/user.js
import Toast from '@vant/weapp/toast/toast'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserList()
  },

  /**
   * 获取用户列表
   */
  getUserList: function () {
    let baseUrl = app.globalData.baseUrl
    const _this = this

    wx.request({
      url: baseUrl + "user/get-userlist",
      method: "GET",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        let userList = res.data.userList
        userList.forEach(function (item) {
          if(item.name.length >= 8) {
            item.name = item.name.slice(0,7) + "..."
          }
          switch (item.purview) {
            case 1:
              item.purviewName = "管理员"
              break
            case 2:
              item.purviewName = "普通用户"
              break
            default:
              item.purviewName = "普通用户"
              break
          }
        })
        
        _this.setData({
          userList: userList
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 修改用户权限
   * @param {*} e 获取元素绑定值
   */
  updatePurview: function (e) {
    let userInfo = null
    let userList = this.data.userList
    const openId = e.currentTarget.dataset.id
    const baseUrl = app.globalData.baseUrl

    userList.forEach(function (item) {
      if (item.openId == openId) {
        switch(item.purview) {
          case 1:
            item.purview = 2
            item.purviewName = "普通用户"
            break
          case 2:
            item.purview = 1
            item.purviewName = "管理员"
            break
          default:
            item.purview = 2
            item.purviewName = "普通用户"
            break
        }
        userInfo = item
      }
    })
    if (userInfo == null) {
      return
    }

    this.setData({
      userList: userList
    })

    wx.request({
      url: baseUrl + 'user/update',
      data: {
        openId: userInfo.openId,
        name: userInfo.name,
        purview: userInfo.purview,
      },
      method: "POST",
      header: { 
        'content-type':'application/x-www-form-urlencoded'
      },
      success: function (res) {
        Toast.success('修改权限成功');
      },
      fail: function (res) {

      }
    })
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