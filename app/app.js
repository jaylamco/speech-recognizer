//app.js
App({
  onError: function() {
    wx.showToast({
      title: '脚本异常',
      icon: 'none'
    })
  }
})