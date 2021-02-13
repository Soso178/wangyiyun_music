import config from './config'
//封装ajax请求
export default(url,data={},method='GET')=>{
  return new Promise((resolve,reject)=>{
      wx.request({
    url:config.mobilHost+url,
    data,
    method,
    header:{
      cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_U')!==-1):''
    },
    success:(res)=>{
      if(data.isLogin){
        console.log(1);
        console.log(1);
        wx.setStorage({
          data: res.cookies,
          key: 'cookies',
        })
      }
      resolve(res.data)
    },
    fail:(err)=>{
    }
  })
  })
}