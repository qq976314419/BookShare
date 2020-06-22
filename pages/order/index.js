// pages/book/index.js
let bookDb = wx.cloud.database().collection("books")
let userDb = wx.cloud.database().collection("users")
let orderDB = wx.cloud.database().collection("orders")
import {
  timeFormat,
  sendEmail
} from "../../common/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookInfo: null,
    bookId: null,
    ownerInfo: null,
    userInfo: null,
    date: {
      dateNow: null,
      dateNowStr: "",
      dateBorrow: null,
      dateBorrowStr: "",
      dateBack: null,
      dateBackStr: ''
    },
    operation: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bookId: options.id
    })
    this.dataInit(options.id)
    wx.showModal({
      title: '提示',
      content: '是否已阅读借书规则',
      cancelText: '已阅读',
      confirmText: '阅读规则',
      mask: true,
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '../about/index',
          })
        }
      }
    })
  },
  dataInit(id) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'getbook',
      data: {
        id: id
      },
      success: (res) => {
        this.setData({
          bookInfo: res.result,
          ownerInfo: res.result.ownerInfo[0]
        })
        if (!res.result.status) {
          this.setData({
            operation: false
          })
          wx.showToast({
            title: "来晚了，书已下架",
            icon: "none",
            duration: 1500,
            mask: true,
          })
        } else {
          this.setData({
            operation: true
          })
        }
      },
      fail: (msg) => {
        wx.showToast({
          title: '获取信息失败,请联系管理员',
          icon: "none",
          duration: 1500,
          mask: true,
        })
      },
      complete: () => {
        this.userInit()
      }
    })
  },
  userInit() {
    userDb.get({
      success: (res) => {
        this.setData({
          userInfo: res.data[0]
        })
        if (res.data.length > 0 && this.data.userInfo.infoStatus) {} else {
          wx.showModal({
            title: "提示",
            content: "请完善用户资料",
            mask: true,
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../setInfo/index',
                })
              } else if (res.cancel) {
                wx.navigateBack()
              }
            }
          })
        }
      },
      fail: (msg) => {
        wx.showToast({
          title: '获取信息失败，请联系管理员',
          mask: true,
          duration: 1500
        })
      },
      complete: () => {
        let date = new Date()
        let dateStr = timeFormat(date)
        this.setData({
          "date.dateNow": date,
          "date.dateNowStr": dateStr
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },

  // timeFormat(date) {
  //   let timeStr = ""
  //   timeStr = date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate()
  //   return timeStr
  // },
  apply() {
    wx.showLoading({
      title: '申请中',
      mask: true,
    })
    this.checkBookStatus()
  },
  checkBookStatus() {
    wx.cloud.callFunction({
      name: 'getbook',
      data: {
        id: this.data.bookId
      },
      success: (res) => {
        if (res.result.status) {
          this.updBookInfo()
        } else {
          wx.showToast({
            title: "下单晚了，别人已申请",
            icon: "none",
            duration: 1500
          })
        }
      },
      fail: (msg) => {
        wx.hideLoading()
        wx.showToast({
          title: '下单检查失败,请联系管理员',
          icon: "none",
          duration: 1500,
          mask: true,
        })
      },
    })
  },
  updBookInfo() {
    wx.showLoading({
      title: '更新状态中...',
      mask: true
    })
    wx.cloud.callFunction({
      name: "updbook",
      data: {
        id: this.data.bookId,
        data: {
          status: false,
          recommend: false,
          applyStatus: '分享中...'
        }
      },
      success: (res) => {
        wx.showLoading({
          title: '生成订单中...',
          mask: true,
        })
        this.setData({
          'bookInfo.status': false,
          'bookInfo.recommend': false,
          operation: false,
        })
        this.makeOrder()
      },
      fail: (msg) => {
        wx.showToast({
          title: '书籍状态更新失败，请联系客服',
          duration: 1500,
          icon: 'none',
          mask: true,
        })
      },
    })
  },
  makeOrder() {
    orderDB.add({
      data: {
        name: "申请借阅" + this.data.bookInfo.name,
        applyTime: this.data.date.dateNow,
        applyTimeStr: this.data.date.dateNowStr,
        applierInfo: this.data.userInfo,
        ownerInfo: this.data.ownerInfo,
        bookName: this.data.bookInfo.name,
        bookId: this.data.bookId,
        process: '新的申请',
        startTime: "",
        endTime: "",
        remindTimes: 3
      },
      success: (res) => {
        wx.hideLoading()
        wx.showToast({
          title: '申请成功',
          duration: 2500,
          mask: true,
        })
        let emailData = {
          to: this.data.ownerInfo.email,
          text: '您分享的图书：《' + this.data.bookInfo.name + '》有了新的申请'
        }
        sendEmail(emailData)
        wx.showModal({
          title: "提示",
          content: "是否想要获取订单信息提醒？",
          success: (res) => {
            if (res.confirm) {
              this.sendmsg()
            } else if (res.cancel) {
              wx.showToast({
                title: '用户取消订阅，返回首页',
                icon: 'none',
                duration: 2500,
                mask: true,
              })
              setTimeout(() => {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 2500);
            }
          }
        })
      },
      fail: (msg) => {
        wx.hideLoading()
        wx.showToast({
          title: '申请失败，请联系客服',
          duration: 1500,
          icon: 'none',
          mask: true,
        })
      }
    })
  },
  sendmsg() {
    let templateId = ['UyPBWodX-bJlOnLWGqrV1Pqu4OIHeDkv_KrTF0yKKzY']
    wx.requestSubscribeMessage({
      tmplIds: templateId,
      success: (res) => {
        if (res[templateId] == 'accept') {
          //用户同意了订阅，允许订阅消息
          this.callsubscribe()
        } else {
          //用户拒绝了订阅，禁用订阅消息
          wx.hideLoading()
          wx.showToast({
            title: '订阅失败，返回首页',
            icon: 'none',
            duration: 2500,
            mask: true,
          })
          setTimeout(() => {
            wx.switchTab({
              url: '../index/index',
            })
          }, 2500);
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '调用订阅失败',
          icon: 'none',
          mask: true,
          duration: 1500
        })
      },
    })
  },
  callsubscribe() {
    wx.cloud.callFunction({
      name: "subscribe",
      data: {
        msgData: {
          touser: this.data.userInfo._openid,
          lang: 'zh_CN',
          data: {
            name1: {
              value: this.data.userInfo.name
            },
            thing2: {
              value: this.data.bookInfo.name
            },
            thing4: {
              value: "小C图书漂流：" + this.data.ownerInfo.name
            },
            thing7: {
              value: "请在：我的小C->我的订单中查看详情"
            }
          },
          templateId: 'UyPBWodX-bJlOnLWGqrV1Pqu4OIHeDkv_KrTF0yKKzY',
          miniprogramState: 'developer'
        }
      },
      success: (res) => {
        wx.showToast({
          title: '订阅成功,返回首页',
          duration: 2500,
          mask: true,
        })
        setTimeout(() => {
          wx.switchTab({
            url: '../index/index',
          })
        }, 2500);
      },
      fail: (msg) => {
        wx.showToast({
          title: '订阅发生错误,请联系管理员',
          icon: 'none',
          duration: 2500,
          mask: true,
        })
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
    this.userInit() 
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
    this.dataInit(this.data.bookId)
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