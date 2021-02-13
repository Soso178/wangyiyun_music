// pages/songDetail/songDetail.js
import request from '../../utils/request.js'
import PubSub, { publish } from 'pubsub-js'
import moment from 'moment'
const appInstance=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    song:{},
    songUrl:'',
    musicId:'',
    currentTime:'00:00',
    durationTime:'00:00',
    currentWidth:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId=options.musicId
    this.setData({
      musicId
    })
    console.log(musicId);
    if(appInstance.globalData.isMusicPlay&appInstance.globalData.musicId==musicId){
      this.setData({
        isPlay:true
      })
    }
    this.backgrondAudioManager=wx.getBackgroundAudioManager()
    this.backgrondAudioManager.onPlay(()=>{
      this.setData({
        isPlay:true
      })
      appInstance.globalData.isMusicPlay=true
      appInstance.globalData.musicId=musicId
    })
    this.backgrondAudioManager.onPause(()=>{    
      this.setData({
        isPlay:false
      })
      appInstance.globalData.isMusicPlay=false
    })
    this.backgrondAudioManager.onStop(()=>{
      this.setData({
        isPlay:false
      })
      appInstance.globalData.isMusicPlay=false
    }) 
    this.backgrondAudioManager.onTimeUpdate(()=>{
      let currentTime=moment(this.backgrondAudioManager.currentTime*1000).format('mm:ss')
      let currentWidth=this.backgrondAudioManager.currentTime/this.backgrondAudioManager.duration*450
      this.setData({
        currentTime,
        currentWidth
      })
    })
    this.backgrondAudioManager.onEnded(()=>{
      PubSub.publish('switchType','next')
      PubSub.subscribe('musicId',(msg,musicId)=>{   
        this.getMusicInfo(musicId)
        this.musicControl(true,musicId)
        PubSub.unsubscribe("musicId")
      })
      this.setData({
        currentWidth:0,
        currentTime:'00:00'
      })
    })
    this.getMusicInfo(musicId)
  },

  handleMusicPlay(){
    // this.setData({
    //   isPlay:!this.data.isPlay
    // })
    this.musicControl(!this.data.isPlay,this.data.musicId,this.data.songUrl)
  },
  async getMusicInfo(musicId){
      let songData=await request('/song/detail',{ids:musicId})
      let durationTime=moment(songData.songs[0].dt).format('mm:ss')
      this.setData({
        song:songData.songs[0],
        durationTime
      })
      console.log(this.data.songUrl);
      wx.setNavigationBarTitle({
        title: this.data.song.name,
      })
      console.log(1);
  },
 async musicControl(isPlay,musicId,songUrl){
    if(isPlay){
      if(!songUrl){
        console.log(5);
        let songUrlData=await request('/song/url',{id:musicId})
        this.setData({
          songUrl:songUrlData.data[0].url
        })
      }    
     this.backgrondAudioManager.src=this.data.songUrl
      this.backgrondAudioManager.title=this.data.song.name
    }else{
      this.backgrondAudioManager.pause()
    }
    console.log(2);
  },
  handleSwitch(event){
    let type=event.currentTarget.id    
    this.backgrondAudioManager.stop()
    PubSub.subscribe('musicId',(msg,musicId)=>{  
      console.log(1111);    
      this.getMusicInfo(musicId)
      this.musicControl(true,musicId)
      PubSub.unsubscribe("musicId")
    })
    PubSub.publish("switchType",type)
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