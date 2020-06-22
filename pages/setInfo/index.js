// pages/register/index.js
let userDb = wx.cloud.database().collection("users")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      name: '',
      dept: '',
      email: '',
      phone: null
    },
    bookId: '',
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
        if (res.data.length > 0) {
          this.setData({
            'userInfo.name': res.data[0].name,
            'userInfo.dept': res.data[0].dept,
            'userInfo.phone': res.data[0].phone,
            'userInfo.email': res.data[0].email,
            'userInfo.manage': false,
            'userInfo.supmanage': false,
            bookId: res.data[0]._id
          })
        } else {
          userDb.add({
            data: {
              name: '',
              dept: '',
              email: '',
              phone: null,
              infoStatus: false
            },
            success: (res) => {
              this.setData({
                bookId: res._id
              })
            }
          })
        }
      },
      fail: (msg) => {
        wx.showToast({
          title: '获取数据失败，请联系管理员',
          icon: 'none',
          mask: true,
        })
      },
      complete: () => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  getUserName(event) {
    this.setData({
      'userInfo.name': event.detail.value
    })
  },
  getDept(event) {
    this.setData({
      'userInfo.dept': event.detail.value
    })
  },
  getEmail(event) {
    this.setData({
      'userInfo.email': event.detail.value
    })
  },
  getPhone(event) {
    this.setData({
      'userInfo.phone': event.detail.value
    })
  },
  saveInfo(event) {
    wx.showLoading({
      title: '更新中',
      mask: true
    })
    let info = this.data.userInfo
    let infostatus
    if (info.name && info.dept && info.email && info.phone) {
      infostatus = true
    } else {
      infostatus = false
    }
    userDb.doc(this.data.bookId).update({
      data: {
        ...info,
        infoStatus: infostatus
      },
      success: (res) => {
        wx.hideLoading()
        wx.showToast({
          title: '更新成功',
          duration: 1500,
          mask: true
        })
      },
      fail: (msg) => {
        wx.hideLoading()
        wx.showToast({
          title: '更新失败，请联系管理员',
          icon: "none",
          duration: 1500,
          mask: true
        })
      }
    })
  },

  wxShowToast(msg) {
    wx.showToast({
      title: msg + "不能为空",
      icon: "none",
      duration: 1500,
      mask: true,
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
    this.dataInit()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})