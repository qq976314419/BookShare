// pages/orderoperation/index.js
let orderDb = wx.cloud.database().collection('orders')
let bookDb = wx.cloud.database().collection('books')
import {
  sendEmail,
  timeFormat
} from "../../common/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operation: '',
    orderId: '',
    orderInfo: null,
    orderProcess: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
    this.dataInit()
  },

  dataInit() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let openid = wx.getStorageSync('useropenid')
    wx.cloud.callFunction({
      name: 'getorder',
      data: {
        action: 'getorder',
        id: this.data.orderId
      },
      success: (res) => {
        this.setData({
          orderInfo: res.result.data,
        })
        if (this.data.orderInfo.ownerInfo._openid == openid) {
          this.setData({
            operation: 'owner',
            orderProcess: res.result.data.process
          })
        } else {
          this.setData({
            operation: 'applier',
            orderProcess: res.result.data.process
          })
        }
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
  refuse() {
    wx.showModal({
      title: '提示',
      content: '要拒绝申请吗',
      mask: true,
      success: (res) => {
        if (res.confirm) {
          let updData = {
            process: '拒绝',
          }
          this.updOrder(updData)
          this.updateBook()
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: "none",
            mask: true
          })
        }
      }
    })
  },
  agree() {
    wx.showModal({
      title: '提示',
      content: '要通过申请吗',
      mask: true,
      success: (res) => {
        if (res.confirm) {
          let updData = {
            process: '通过申请',
          }
          this.updOrder(updData)
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: "none",
            mask: true
          })
        }
      }
    })
  },
  startShare() {
    wx.showModal({
      title: '提示',
      content: '提醒用户取书?',
      mask: true,
      success: (res) => {
        if (res.confirm) {
          let updData = {
            process: '可以取书',
          }
          this.updOrder(updData)
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: "none",
            mask: true
          })
        }
      }
    })
  },
  remind() {
    wx.showModal({
      title: '提示',
      content: '邮件提醒用户归还图书?',
      mask: true,
      success: (res) => {
        if (res.confirm) {
          if (this.data.orderInfo.remindTimes >= 1) {
            let times = this.data.orderInfo.remindTimes - 1
            this.setData({
              'orderInfo.remindTimes': times
            })
            this.updOrderRemindTimes(times)
          } else {
            wx.showToast({
              title: '提醒次数不足',
              icon: "none",
              mask: true
            })
          }
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: "none",
            mask: true
          })
        }
      }
    })
  },
  complete() {
    wx.showModal({
      title: '提示',
      content: '用户已归还?',
      mask: true,
      success: (res) => {
        if (res.confirm) {
          let updData = {
            process: '完成分享',
          }
          this.updOrder(updData)
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: "none",
            mask: true
          })
        }
      }
    })
  },

  updateBook() {
    wx.showLoading({
      title: '更新中...',
      mask:true
    })
    if (this.data.operation == 'owner') {
      bookDb.doc(this.data.orderInfo.bookId).update({
        data: {
          status: true,
          applyStatus: ''
        },
        complete:()=>{
          wx.hideLoading()
        }
      })
    } else {
      wx.cloud.callFunction({
        name: 'updbook',
        data: {
          id: this.data.orderInfo.bookId,
          data: {
            status: true,
            applyStatus: ''
          }
        },
        complete:()=>{
          wx.hideLoading()
        }
      })
    }
  },


  sharing() {
    wx.showModal({
      title: '提示',
      content: '已取到书了吗？',
      mask: true,
      success: (res) => {
        if (res.confirm) {
          let startTime = new Date()
          let startTimeStr = timeFormat(startTime)
          let endTime = new Date()
          endTime.setDate(endTime.getDate() + 30)
          let endTimeStr = timeFormat(endTime)
          let updData = {
            process: '分享中',
            startTime: startTime,
            startTimeStr: startTimeStr,
            endTime: endTime,
            endTimeStr: endTimeStr
          }
          this.applierUpdate(updData)
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: "none",
            mask: true
          })
        }
      }
    })
  },
  cancel() {
    wx.showModal({
      title: '提示',
      content: '要取消申请吗',
      mask: true,
      success: (res) => {
        if (res.confirm) {
          let updData = {
            process: '已取消',
          }
          this.applierUpdate(updData)
          this.updateBook()
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: "none",
            mask: true
          })
        }
      }
    })
  },
  returnBook() {
    wx.showModal({
      title: '提示',
      content: '要归还图书吗',
      mask: true,
      success: (res) => {
        if (res.confirm) {
          let updData = {
            process: '申请还书',
          }
          this.applierUpdate(updData)
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: "none",
            mask: true
          })
        }
      }
    })
  },


  applierUpdate(updData) {
    let process = updData.process
    wx.showLoading({
      title: '更新中...',
      mask: true
    })
    orderDb.doc(this.data.orderId).update({
      data: {
        ...updData
      },
      success: (res) => {
        let emailData = {
          to: this.data.orderInfo.ownerInfo.email,
        }
        if (process == '分享中') {
          emailData.text = '您分享的图书:《' + this.data.orderInfo.bookName + '》借阅人已确认取书，感谢您的分享，赠人玫瑰，手有余香'
        } else if (process == '已取消') {
          emailData.text = '您分享的图书:《' + this.data.orderInfo.bookName + '》的借阅申请已取消'
        } else if (process == '申请还书') {
          emailData.text = '您分享的图书:《' + this.data.orderInfo.bookName + '》借阅人申请还书,申请人还书后请及时登录小C确认已归还图书'
        } else {
          emailData.text = '您分享的图书:《' + this.data.orderInfo.bookName + '》申请状态已变更'
        }
        sendEmail(emailData)
        this.setData({
          'orderInfo.process': process,
          orderProcess: process
        })
        wx.showToast({
          title: '操作成功',
          duration: 1500,
          mask: true,
        })
      },
      fail: (msg) => {
        wx.showToast({
          title: '操作失败',
          duration: 1500,
          icon: "none",
          mask: true,
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  updOrder(updData) {
    let process = updData.process
    wx.showLoading({
      title: '更新中...',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'getorder',
      data: {
        id: this.data.orderId,
        action: 'update',
        data: {
          ...updData
        }
      },
      success: (res) => {
        let emailData = {
          to: this.data.orderInfo.applierInfo.email,
        }
        if (process == '拒绝') {
          emailData.text = '非常抱歉地通知您，您的图书：《' + this.data.orderInfo.bookName + '》的申请已被拒绝，不要灰心，可以尝试申请其他图书'
        } else if (process == '通过申请') {
          emailData.text = '恭喜，您申请借阅的图书：《' + this.data.orderInfo.bookName + '》已通过申请，待图书持有人取书通知'
        } else if (process == '可以取书') {
          emailData.text = '您申请的图书：《' + this.data.orderInfo.bookName + '》已可以取书，请联系图书持有人确认取书信息，取书后请及时登录小C确认取书'
        } else if (process == '完成分享') {
          emailData.text = '您的图书：《' + this.data.orderInfo.bookName + '》的借阅已完成'
        } else {
          emailData.text = '您的图书：《' + this.data.orderInfo.bookName + '》的申请状态已变更'
        }
        if (process == '拒绝' || process == '完成分享') {
          this.updateBook()
        }
        this.setData({
          'orderInfo.process': process,
          orderProcess: process
        })
        sendEmail(emailData)
        wx.showToast({
          title: '操作成功',
          duration: 1500,
          mask: true,
        })
      },
      fail: (msg) => {
        wx.showToast({
          title: '操作失败',
          icon: "none",
          duration: 1500,
          mask: true,
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  updOrderRemindTimes(times) {
    wx.showLoading({
      title: '更新中...',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'getorder',
      data: {
        id: this.data.orderId,
        action: 'update',
        data: {
          remindTimes: times
        }
      },
      success: (res) => {
        let emailData = {
          to: this.data.orderInfo.applierInfo.email,
          text: '您申请的的图书：《' + this.data.orderInfo.bookName + '》已临近还书日期，请注意还书'
        }
        sendEmail(emailData)
      },
      fail: (msg) => {
        wx.showToast({
          title: '操作失败',
          icon: "none",
          duration: 1500,
          mask: true,
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})