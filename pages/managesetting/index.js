// pages/managesetting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    action: '',
    db: ''
  },

  switchBookChange(event) {
    wx.showLoading({
      title: '更新中...',
      mask:true,
    })
    let {
      index
    } = event.target.dataset
    let recommend = this.data.lists[index].recommend
    let list = "lists[" + index + "].recommend"
    this.setData({
      [list]: !recommend
    })
    let data={
      recommend:this.data.lists[index].recommend
    }
    let id=this.data.lists[index]._id
    this.updateData(data,id)
  },
  switchRole(event) {
    wx.showLoading({
      title: '更新中...',
      mask:true,
    })
    let {
      index
    } = event.target.dataset
    let role = this.data.lists[index].role
    let list = "lists[" + index + "].role"
    if (role == this.data.action) {
      this.setData({
        [list]: "user"
      })
    } else {
      this.setData({
        [list]: this.data.action
      })
    }
    let data={
      role:this.data.lists[index].role
    }
    let id=this.data.lists[index]._id
    this.updateData(data,id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let action = options.action
    this.setData({
      action: action
    })
    if (action == "recommend") {
      this.setData({
        db: 'books'
      })
      wx.cloud.callFunction({
        name:'getbook',
        success:(res)=>{
          this.setData({
            lists:res.result.data
          })
        },
        fail:(msg)=>{
          console.log(msg)
        },
        complete:()=>{
          wx.hideLoading()
        }
      })
    } else {
      this.setData({
        db: 'users'
      })
      wx.cloud.callFunction({
        name:'getuser',
        success:(res)=>{
          this.setData({
            lists:res.result.data
          })
        },
        fail:(msg)=>{
          console.log(msg)
        },
        complete:()=>{
          wx.hideLoading()
        }
      })
    }
  },

  updateData(data,id) {
    wx.cloud.callFunction({
      name:'managetools',
      data:{
        db:this.data.db,
        id:id,
        data:data
      },
      success:(res)=>{
        console.log(res)
      },
      fail:(msg)=>{
        console.log(msg)
      },
      complete:()=>{
        wx.hideLoading()
        wx.showToast({
          title: '更新完成',
          duration:1500,
          mask:true
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