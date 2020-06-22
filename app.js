//app.js
App({
  onLaunch: function () {
  //云开发环境初始化
    wx.cloud.init({
      env:"bookshare-007xc"
    })
    wx.cloud.callFunction({
      name:"getopenid",
      success:(res)=>{
        wx.setStorage({
          data: res.result.openid,
          key: 'useropenid',
        })
      }
    })
  },
})