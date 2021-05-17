// pages/cartInfo/cartInfo.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapHeight: 0,
    contentHeight: 0,
    active: false,
    listTop: -30,
    center: {
      lat: 28.245749,
      lon: 113.026757,
    },
    markers: [
      {id: 1, latitude: 28.245749, longitude: 113.026757, iconPath: "../icon/cart.png", width: 40, height: 40},
      {id: 2, latitude: 28.246269, longitude: 113.026016, iconPath: "../icon/cart.png", width: 40, height: 40}
    ],
    cartList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    this.setData({
      mapHeight: app.globalData.bodyHeight * 0.6,
      contentHeight: app.globalData.bodyHeight * 0.4 + 50
    })
    this.getCartList()
  },

  /**
   * 获取清洁车信息列表
   */
  getCartList: function () {
    let baseUrl = app.globalData.baseUrl
    let _this = this
    wx.request({
      url: baseUrl + 'cart/get-info',
      method: "GET",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log("getCartList RES : ", res)
        _this.setData({
          cartList: res.data.cartList
        })
      },
      fail: function (res) {
        console.log("getCartList FAIL : ", res)
      }
    })
  },

  /**
   * 控制信息栏升降
   */
  showList() {
    if (this.data.active) {
      this.setData({
        listTop: -30,
        contentHeight: app.globalData.bodyHeight * 0.4 + 50,
        active: false
      })
    } else {
      this.setData({
        listTop: - (this.data.mapHeight - 30),
        contentHeight: app.globalData.bodyHeight - 30,
        active: true
      })
    }
  },

  /**
   * 转跳至详情页
   * @param {*} e 获取元素上绑定值
   */
  go2Detail: function (e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let state = e.currentTarget.dataset.state
    wx.navigateTo({
      url: '../cartInfo/detail/cartInfoDetail?id=' + id + '&name=' + name + '&state=' + state,
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