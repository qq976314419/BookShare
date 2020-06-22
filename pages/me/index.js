// pages/me/index.js
let userDb = wx.cloud.database().collection("users")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dataInit()
  },
  dataInit() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    userDb.get({
      success: (res) => {
        this.setData({
          userInfo: res.data[0]
        })
      },
      fail: (msg) => {
        wx.showToast({
          title: '获取用户信息错误，请联系管理员',
          duration: 1500,
          mask: true,
        })
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
    this.dataInit()
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
    this.dataInit()
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