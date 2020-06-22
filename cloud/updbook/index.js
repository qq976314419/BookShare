// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {  
  if (event.id){
    return cloud.database().collection("books").doc(event.id).update({
      data:{
        ...event.data
      },
      success:(res)=>{
        return res
      },
      fail:(msg)=>{
        return msg
      }
    })
  }
}