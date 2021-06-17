// pages/cartInfo-admin/rubbish/rubbish.js
import Toast from '@vant/weapp/toast/toast'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newType: "",
    rubbishType: [],
    iconList: [
      {id: 0, src: "../../icon/可回收物 (1).png", color: "#409EFF"},
      {id: 1, src: "../../icon/干垃圾 (1).png", color: "E6A23C"},
      {id: 2, src: "../../icon/厨余垃圾.png", color: "#67C23A"},
      {id: 3, src: "../../icon/其他垃圾.png", color: "#303133"},
    ]
  },

  /**
   * 数据绑定
   * @param {*} event 
   */
  onChange(event) {
    this.setData({
      newType: event.detail
    })
  },

  /**
   * 增加新的垃圾分类
   */
  addType: function () {
    let baseUrl = app.globalData.baseUrl
    const _this = this
    const newType = this.data.newType

    if (newType == "") {
      Toast.fail('未输入垃圾分类名');
      return
    }

    wx.request({
      url: baseUrl + "rubbish/add-type",
      method: "POST",
      data: {
        name: newType,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if(res.data.state) {
          let list = _this.data.rubbishType
          let newItem = {name: newType, iconId: 4}
          list.push(newItem)
          _this.setData({
            rubbishType: list
          })
          Toast.success('增加垃圾分类成功');
        } else {
          Toast.fail('垃圾分类名重复');
        }
      },
      fail: function (res) {
        console.log(res)
        Toast.fail('增加失败');
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTypeList()
  },

  getTypeList: function () {
    const _this = this
    const baseUrl = app.globalData.baseUrl

    wx.request({
      url: baseUrl + "rubbish/type/get-all",
      method: "GET",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log("getTypeList（） ： ", res)
        let typeList = res.data.typeList
        _this.setData({
          rubbishType: typeList
        })
      },
      fail: function(res) {
        console.log("getTypeList（） fail： ", res)
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