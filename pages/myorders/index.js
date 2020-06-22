// pages/myorders/index.js
let orderDb = wx.cloud.database().collection('orders')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    navbarindex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBorrow()
  },

  getBorrow() {
    this.setData({
      navbarindex: 0
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    orderDb.orderBy('applyTime', 'desc').get({
      success: (res) => {
        this.setData({
          lists: res.data
        })
      },
      fail: (msg) => {
        console.log(msg)
      },
      complete: () => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  getShare() {
    this.setData({
      navbarindex: 1
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let userOpenId = wx.getStorageSync('useropenid')
    wx.cloud.callFunction({
      name: 'getorder',
      data: {
        useropenid: userOpenId
      },
      success: (res) => {
        this.setData({
          lists: res.result.data
        })
      },
      fail: (msg) => {
        console.log(msg)
      },
      complete: () => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
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
    if (this.data.navbarindex == 0) {
      this.getBorrow()
    } else if (this.data.navbarindex == 1) {
      this.getShare()
    } else {
      this.getBorrow()
    }

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
    if (this.data.navbarindex == 0) {
      this.getBorrow()
    } else {
      this.getShare()
    }

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