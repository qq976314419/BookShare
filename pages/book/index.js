// pages/book/index.js
let bookDb = wx.cloud.database().collection("books")
import {
  removeCloudImage
} from "../../common/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookInfo: null,
    bookId: '',
    operation: false,
    ownerName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bookId: options.id
    })
    this.dataInit(options.id)
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
          ownerName: res.result.ownerInfo[0].name
        })
        let useropenid = wx.getStorageSync('useropenid')
        if (useropenid == res.result._openid) {
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
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  deleteBook() {
    wx.showModal({
      title: "删除提示",
      content: "确认删除分享吗？",
      mask: true,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
            mask: true,
          })
          if (this.data.bookInfo.imageSrc) {
            removeCloudImage(this.data.bookInfo.imageSrc)
          }
          bookDb.doc(this.data.bookId).remove({
            success: (res) => {
              wx.showToast({
                title: '删除成功,返回...',
                duration: 2000,
                mask: true,
                complete: () => {
                  setTimeout(() => {
                    wx.navigateBack()
                  }, 2000);
                }
              })
            },
            fail: (msg) => {
              wx.showToast({
                title: '删除失败，请联系管理员',
                duration: 1500,
                mask: true,
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '用户取消操作',
            icon: 'none',
            duration: 1500,
            mask: true,
          })
        }
      }
    })
  },
  imagePreview(e){
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
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
    this.dataInit(this.data.bookId)
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