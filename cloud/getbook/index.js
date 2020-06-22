// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.id){
    return cloud.database().collection("books").aggregate().lookup({
      from: 'users',
      localField: '_openid',
      foreignField: '_openid',
      as: 'ownerInfo',
    })
    .end()
    .then(res=>{
      item=res.list.filter(book=>{return book._id==event.id})[0]
      return item
    },
    msg=>{
      return msg
    }
    )
    // .get({
    //   success(res){
    //     return res
    //   },
    //   fail(msg){
    //     return msg
    //   },
    // })
  }
  else{
    return cloud.database().collection("books").where({
      status:true
    }).get({
      success(res){
        return res
      },
      fail(msg){
        return msg
      }
    })
  }
}