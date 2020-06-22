// pages/addbook/index.js
const booksDb = wx.cloud.database().collection("books")
const userDb = wx.cloud.database().collection('users')
import {
  removeCloudImage
} from "../../common/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bookId: "",
    operation: true,
    bookInfo: {
      name: "",
      category: "",
      author: "",
      publish: "",
      desc: "",
      status: true,
      imageSrc: ''
    },
    categories: ["专业书籍","文学", "经管励志", "小说", "历史社科","生活艺术","少儿","科普读物"],
    cateIndex: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        operation: !this.data.operation,
        bookId: options.id
      })
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      this.getBook(options.id)
    }
    this.checkUserStatus()
  },
  checkUserStatus() {
    userDb.get({
      success: (res) => {
        if (!res.data[0].infoStatus) {
          wx.showModal({
            title: '提示',
            content: '需要完善用户资料',
            cancelText: '取消',
            confirmText: '完善资料',
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
    })
  },
  getBook(id) {
    booksDb.doc(id).get({
      success: (res) => {
        let book = res.data
        this.setData({
          'bookInfo.name': book.name,
          'bookInfo.category': book.category,
          'bookInfo.author': book.author,
          'bookInfo.publish': book.publish,
          'bookInfo.desc': book.desc,
          'bookInfo.status': book.status,
          'bookInfo.imageSrc': book.imageSrc
        })
      },
      fail: (msg) => {
        wx.showToast({
          title: '获取信息失败，请联系管理员',
          duration: 1500,
          mask: true
        })
      },
      complete: () => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },

  switchChange() {
    this.setData({
      'bookInfo.status': !this.data.bookInfo.status
    })
  },
  cateChange(e) {
    let index = e.detail.value;
    this.setData({
      cateIndex: index,
      'bookInfo.category': this.data.categories[index]
    })
  },

  onSubmit(event) {
    let book = event.detail.value
    if (this.data.operation) {
      this.addBook(book)
    } else {
      this.updBook(book)
    }
  },
  addBook(book) {
    wx.showLoading({
      title: '添加中...',
      mask: true,
    });
    booksDb.add({
      data: {
        ...book,
        category: this.data.categories[this.data.cateIndex],
        imageSrc: this.data.bookInfo.imageSrc,
        status: this.data.bookInfo.status,
        recommend: false,
        applyStatus: ""
      },
      success(res) {
        wx.hideLoading()
        wx.showToast({
          title: '添加成功',
          duration: 1500,
          mask: true,
        });
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '添加失败，请联系管理员',
          duration: 1500,
          mask: true,
        });
      }
    })
  },
  updBook(book) {
    wx.showLoading({
      title: '更新中...',
      mask: true
    })
    booksDb.doc(this.data.bookId).update({
      data: {
        ...book,
        category: this.data.categories[this.data.cateIndex],
        imageSrc: this.data.bookInfo.imageSrc,
        status: this.data.bookInfo.status,

      },
      success: (res) => {
        wx.hideLoading()
        wx.showToast({
          title: '更新成功',
          duration: 1500,
          mask: true,
        });
      },
      fail: (res) => {
        wx.hideLoading()
        wx.showToast({
          title: '更新失败，请联系管理员',
          duration: 1500,
          mask: true,
        });
      }
    })
  },
  addimage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.uploadFile(res.tempFilePaths[0])
      },
      fail: () => {},
      complete: () => {}
    });
  },
  uploadFile(fileUrl) {
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    wx.cloud.uploadFile({
      cloudPath: 'books/' + new Date().getTime(),
      filePath: fileUrl,
      success: (res) => {
        this.setData({
          "bookInfo.imageSrc": res.fileID
        })
      },
      fail: (res) => {
        console.log(res)
      },
      complete: () => {
        wx.hideLoading(),
          wx.showToast({
            title: '上传成功',
            mask: true,
          })
      }
    })
  },
  imagePreview(e){
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
    })
  },
  removeImage() {
    wx.showModal({
      title: '提示',
      content: '要删除预览图吗?',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
            mask: true
          })
          if (this.data.bookInfo.imageSrc) {
            removeCloudImage(this.data.bookInfo.imageSrc)
            this.setData({
              'bookInfo.imageSrc': ''
            })
          }
        } else if (res.cancel) {
          wx.showToast({
            title: '取消操作',
            icon: 'none',
            mask: true
          })
        }
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
    this.checkUserStatus()
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
    this.data
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