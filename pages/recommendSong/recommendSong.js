// pages/recommendSong/recommendSong.js
import request from '../../utils/request.js'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:'',
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo=wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1
    })
    this.getrecommendList()

    PubSub.subscribe('switchType',(msg,type)=>{
      let recommendList=this.data.recommendList
      let index=this.data.index
      console.log(index);
      if(type=='pre'){
        (index==0)&&(index=recommendList.length)
         index=index-1
      }else{
        (index==recommendList.length-1)&&(index=-1)
        index=index+1
      }
      console.log(index);
      this.setData({
        index
      })
      let musicId=recommendList[index].id
      PubSub.publish("musicId",musicId)
    })
  },
  async getrecommendList(){
    let recommendListData =await request('/recommend/songs')
    console.log(recommendListData);
    this.setData({
      recommendList:recommendListData.recommend
    })
  },
  toSongDetail(event){
    let song = event.currentTarget.dataset.song;
    let index = event.currentTarget.dataset.index;
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId='+song.id,
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