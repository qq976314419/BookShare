// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let db=event.db
  let id=event.id
  let data=event.data
  return cloud.database().collection(db).doc(id).update({
    data:{
      ...data
    },
    success:(res)=>{
      return res
    },
    fail:(msg)=>{
      return msg
    }
  })
}