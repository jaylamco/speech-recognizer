//index.js
const app = getApp();
const recorderManager = wx.getRecorderManager();
const recordIconSource = {
  normal: './images/icon_record.png',
  active: './images/icon_record_ing.png'
}
const iotUpload = 'http://127.0.0.1:7001';

Page({
  data: {
    command: null,
    deviceId: null,
    recordIcon: recordIconSource.normal,
  },
  onLoad: function() {
    // 测试用的
    this.setData({
      deviceId: wx.getStorageSync('deviceId')
    })

    // 监听录音结束
    recorderManager.onStop(this.onRecordStop);
  },
  rebind: function() {
    wx.setStorageSync('deviceId', null);
    this.setData({
      deviceId: null
    });
  },
  startScan: function() {
    const vm = this;
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: (res) => {
        wx.setStorageSync('deviceId', res.result);
        vm.setData({
          deviceId: res.result
        })
      }
    })
  },
  startRecord: function() {
    recorderManager.start({
      duration: 5000,
      sampleRate: 8000,
      encodeBitRate: 16000
    });
    this.setData({
      recordIcon: recordIconSource.active
    })
  },
  stopRecord: function() {
    recorderManager.stop();
    this.setData({
      recordIcon: recordIconSource.normal
    })
  },

  onRecordStop: function(res) {
    wx.showLoading({
      title: '语言识别中...',
    })
    const vm = this;
    const {
      tempFilePath
    } = res;
    wx.uploadFile({
      url: iotUpload + '/upload',
      filePath: tempFilePath,
      name: 'file',
      complete(res) {
        try {
          const data = JSON.parse(res.data);
          if (+data.code !== 0) {
            wx.showToast({
              title: `C:${data.code}`,
              icon: 'none'
            });
            return;
          }
          if (!data.data) {
            wx.showToast({
              title: '请说标准普通话',
              iocn: 'none'
            });
            return;
          }
          console.log(data.data); // 语音翻译结果
        } catch (error) {
          wx.showToast({
            title: '语音识别失败',
            icon: 'none'
          })
        }
      }
    })
  }
})