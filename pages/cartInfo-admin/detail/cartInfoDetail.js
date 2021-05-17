// pages/cartInfo/detail/cartInfoDetail.js
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
    markers: [
      {id: 1, latitude: 28.245749, longitude: 113.026757}
    ],
    center: {
      lat: 0,
      lon: 0,
    },
    cartInfo: {
      id: 1,
      name: "致远楼清洁车",
      state: "正常"
    },
    rubbishList: [],
    iconList: [
      {id: 0, src: "../../icon/可回收物 (1).png", color: "#409EFF"},
      {id: 1, src: "../../icon/干垃圾 (1).png", color: "#F56C6C"},
      {id: 2, src: "../../icon/厨余垃圾.png", color: "#67C23A"},
      {id: 3, src: "../../icon/其他垃圾.png", color: "#303133"},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    // let cartInfo = {
    //   id: options.id,
    //   name: options.name,
    //   state: options.state
    // }
    
    this.getPosition()
    this.setData({
      mapHeight: app.globalData.bodyHeight * 0.6,
      contentHeight: app.globalData.bodyHeight * 0.4 + 50,
      // cartInfo: cartInfo
    })
    this.getRubbishList()
  },

  /**
   * 获取中心位置
   */
  getPosition: function () {
    let center = {
      lat: this.data.markers[0].latitude,
      lon: this.data.markers[0].longitude
    }
    this.setData({
      center: center
    })
  },

  /**
   * 获取垃圾信息
   */
  getRubbishList() {
    const baseUrl = app.globalData.baseUrl
    const _this = this
    console.log(this.data)
    wx.request({
      url: baseUrl + 'rubbish/get-rubbish',
      data: {
        cartId: 1
      },
      method: "GET",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log("getRubbishList() RES : ", res)
        let rubbishList = res.data.rubbishList
        _this.setData({
          rubbishList: rubbishList
        })
      },
      fail: function (res) {
        console.log("getRubbishList() FAIL : ", res)
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