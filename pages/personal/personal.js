// pages/personal/personal.js
import request from '../../utils/request'
let startY=0  //手指起始坐标
let moveY=0   //手指移动的坐标
let moveDistance=0    //手指移动的距离

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'translateY(0)',
    coveTransition:'',
    userInfo:{},
    recentPlayList:[]
  },
handleTouchStart(event){
  startY=event.touches[0].clientY
  console.log(1);
},
handleTouchMove(event){
  console.log(2);
  this.setData({
    coveTransition:``
  })
  moveY=event.touches[0].clientY
  moveDistance=moveY-startY
  if(moveDistance<=0){
    return
  }
  if(moveDistance>=80){
    moveDistance=80
  }
  else{
    this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`
    })
  }
},
handleTouchEnd(){
  console.log(3);
  this.setData({
    coverTransform:`translateY(0)`,
    coveTransition:'transform 0.5s linear'
  })
},
toLogin(){
  wx.navigateTo({
    url:"/pages/login/login"
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo=wx.getStorageSync('userInfo')
    if(userInfo){
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
    }
    if(userInfo){
    this.getUserRecentplayList(this.data.userInfo.userId)
  }
  },
async getUserRecentplayList(userId){
  let recentPlayListData=await request('/user/record',{uid:userId,type:0})
  let index=0
  let recentPlayList=recentPlayListData.allData.slice(0,10).map(item=>{
    item.id=index++
    return item
  })
  console.log(recentPlayList);
  this.setData({
    recentPlayList
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