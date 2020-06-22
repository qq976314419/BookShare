/**
 * format time
 * @param {*} date Date()
 * return yyyy-mm-dd
 */
export const timeFormat = (date) => {
  let timeStr = ""
  timeStr = date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate()
  return timeStr
}
/**
 * @param {to : mailTo,text:mail text} data 
 * 
 */
export const sendEmail = (data) => {
  wx.cloud.callFunction({
    name: 'sendEmail',
    data: {
      data: {
        ...data
      }
    },
    success: (res) => {
      wx.showToast({
        title: '邮件通知成功',
        duration: 1500,
        mask: true,
      })
    },
    fail: (msg) => {
      wx.showToast({
        title: '邮件通知失败，请联系管理员：'+msg,
        icon: 'none',
        duration: 1500,
        mask: true,
      })
    }
  })
}
/**
 * remove image
 * @param {*} imageSrc 
 */
export const removeCloudImage = (imageSrc) => {
  wx.cloud.deleteFile({
    fileList: [imageSrc],
    success: (res) => {
      wx.showToast({
        title: '资源删除成功',
        duration: 1500,
        mask: true
      })
    },
    fail: (res) => {
      console.log(res)
    },
    complete: () => {
      wx.hideLoading()
    }
  })
}