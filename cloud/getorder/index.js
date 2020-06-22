// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.action=='getorder'){
    return cloud.database().collection('orders').doc(id=event.id).get({
      success:(res)=>{
        return res
      },
      fail:(msg)=>{
        return msg
      }
    })
  }
  else if(event.action=='update'){
    return cloud.database().collection('orders').doc(id=event.id).update({
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
  else{
    let useropenid=event.useropenid
    return cloud.database().collection("orders").where({
      'ownerInfo._openid':useropenid
    }).orderBy('applyTime', 'desc')
    .get({
      success(res){
        return res
      },
      fail(msg){
        return msg
      }
    })
  }
}