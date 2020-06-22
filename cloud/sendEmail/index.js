const cloud = require('wx-server-sdk')
cloud.init()
var nodemailer = require('nodemailer')
var config = {
  host: 'smtp.163.com', 
  port: 25, 
  secure: false,
  auth: {
    user:'xiaocbook@163.com',
    pass:'FBULDFCWJPEQZDWX'
  }
};
var transporter = nodemailer.createTransport(config);
exports.main = async(event, context) => {
  var mail = {
    from: '小C图书漂流<xiaocbook@163.com>',
    subject: '图书申请状态变更',
    ...event.data
  };
    let res = await transporter.sendMail(mail);
    return res;
}