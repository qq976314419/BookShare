// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('books').where({
    recommend:true,
    status:true,
  }).get({
    success(res){
      return res
    },
    fail(msg){
      return msg
    }
  })
}