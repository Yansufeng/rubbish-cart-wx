// pages/cartInfo/cartInfo.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    socketOpen: false,
    socketMsgQueue: [],
    mapHeight: 0,
    contentHeight: 0,
    active: false,
    listTop: -30,
    center: {
      lat: 28.245749,
      lon: 113.026757,
    },
    markers: [],
    cartList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    this.setData({
      mapHeight: app.globalData.bodyHeight * 0.6,
      contentHeight: app.globalData.bodyHeight * 0.4 + 50,
      mapCtx: wx.createMapContext('myMap')
    })
    this.getCartList()
    this.wsConn()
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
        _this.initMarkers()
      },
      fail: function (res) {
        console.log("getCartList FAIL : ", res)
      }
    })
  },

  /**
   * 初始化图标
   */
  initMarkers: function () {
    const _this = this
    let cartList = this.data.cartList
    let markers = []
    console.log(cartList)
    for(let i = 0; i < cartList.length; i++) {
      console.log(cartList[i])
      if(cartList[i].state == "异常") {
        markers.push({
          id: cartList[i].cartId,
          latitude: 0, 
          longitude: 0, 
          iconPath: "../icon/cart-danger.png", 
          width: 40, 
          height: 40,
        })
      }else{
        markers.push({
          id: cartList[i].cartId,
          latitude: 0, 
          longitude: 0, 
          iconPath: "../icon/cart.png", 
          width: 40, 
          height: 40,
        })
      }
    }

    this.setData({
      markers: markers
    })
  },

  /**
   * 创建websocket连接并接受信息
   */
  wsConn: function () {
    const _this = this
    const socketOpen = this.data.socketOpen
    const url = app.globalData.baseWsUrl

    if(!socketOpen) {
      wx.connectSocket({
        url: url,
        success: function () {
          console.log("websocket连接成功！")
          _this.setData({
            socketOpen: true
          })
        }
      })
    }

    wx.onSocketMessage((res) => {
      console.log(res.data)
      let markers = this.data.markers
      let pos = JSON.parse(res.data) 

      if(markers[pos.id - 1].latitude == 0) {
        console.log(markers[pos.id - 1])
        markers[pos.id - 1].latitude = pos.latitude
        markers[pos.id - 1].longitude = pos.longitude
        this.setData({
          markers: markers
        })
      }
      this.data.mapCtx.translateMarker({
        markerId: pos.id,
        duration: 2000,
        destination: {
          latitude:pos.latitude,
          longitude:pos.longitude,
        }
      })
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

    this.setData({
      socketOpen: false
    })
    wx.closeSocket()

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
    this.wsConn()
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