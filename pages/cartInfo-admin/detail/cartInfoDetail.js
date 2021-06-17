// pages/cartInfo/detail/cartInfoDetail.js
import Toast from '@vant/weapp/toast/toast'
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
    markers: [],
    center: {
      lat: 28.245749,
      lon: 113.026757,
    },
    cartInfo: null,
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
    console.log(options)
    let cartInfo = {
      id: parseInt(options.id),
      name: options.name,
      state: options.state
    }
    
    this.setData({
      mapHeight: app.globalData.bodyHeight * 0.6,
      contentHeight: app.globalData.bodyHeight * 0.4 + 50,
      cartInfo: cartInfo,
      mapCtx: wx.createMapContext('myMap'),
    })
    this.initMarkers()

    this.getRubbishList()
  },

  /**
   * 图标信息初始化
   */
  initMarkers: function () {
    const cartInfo = this.data.cartInfo
    let markers = []
    if(cartInfo.state == "异常") {
      markers.push({
        id: cartInfo.id,
        latitude: 0, 
        longitude: 0, 
        iconPath: "../../icon/cart-danger.png", 
        width: 40, 
        height: 40,
      })
    }else{
      markers.push({
        id: cartInfo.id,
        latitude: 0, 
        longitude: 0, 
        iconPath: "../../icon/cart.png", 
        width: 40, 
        height: 40,
      })
    }
    this.setData({
      markers: markers
    })
    console.log(this.data.markers)
    this.wsConn()
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
    const cartId = this.data.cartInfo.id
    
    wx.request({
      url: baseUrl + 'rubbish/get-rubbish',
      data: {
        cartId: cartId
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
   * 创建websocket连接并接受信息
   */
  wsConn: function () {
    const _this = this
    const url = app.globalData.baseWsUrl

    if(!this.socketOpen) {
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
      const cartId = this.data.cartInfo.id
      let markers = this.data.markers
      let pos = JSON.parse(res.data) 
      
      if(pos.state != null) {
        return
      }

      if(!(pos.id == cartId)) {
        return 
      }

      if(markers[0].latitude == 0) {
        console.log(markers[0])
        markers[0].latitude = pos.latitude
        markers[0].longitude = pos.longitude
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

  startBack: function () {
    const socketOpen = this.data.socketOpen
    const socketMsg = "{\"id\": 1, \"state\": \"back\"}"

    if (socketOpen) {
      sendSocketMessage(socketMsg)
      Toast.success('发送指令成功');
    }
    
    function sendSocketMessage(msg) {
      if (socketOpen) {
        wx.sendSocketMessage({
          data:msg
        })
      } 
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