// pages/addbook/index.js
const booksDb = wx.cloud.database().collection("books")
let id
Page({

  /**
   * 页面的初始数据
   */
  data: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  getId(event) {
    id = event.detail.value
  },
  delBook() {
    booksDb.doc(id).remove({
      success(res) {
        console.log('删除成功', res)
      },
      fail(res) {
        console.log('删除失败', res)
      }
    })
  },
  addBook(event) {
    console.log(event)
    booksDb.add({
      data: {
        ...event.detail.value,
        imageSrc: '../../images/index/QRCode.png',
        recommend: false
      },
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  getBook() {
    booksDb.get({
      success(res) {
        console.log('查询成功', res)
      },
      fail(res) {
        console.log('查询失败', res)
      }
    })
  },
  updateBook() {
    booksDb.doc(id).update({
      success(res) {
        console.log('查询成功', res)
      },
      fail(res) {
        console.log('查询失败', res)
      }
    })
  },
  getOpenId() {
    wx.cloud.callFunction({
      name: 'getopenid',
      success(res) {
        console.log(res.result.openid)
      }
    })
  },
  cloudgetbook() {
    wx.cloud.callFunction({
      name: 'getbooks',
      success(res) {
        console.log(res)
      }
    })
  },
  uploadimage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.uploadFile(res.tempFilePaths[0])
      }
    })
  },
  uploadFile(fileUrl) {
    wx.cloud.uploadFile({
      cloudPath: 'books/testname',
      filePath: fileUrl,
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
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