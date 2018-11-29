'use strict';
const { Service } = require('egg');
const fs = require('fs');
const formUrlencoded = require('form-urlencoded').default;
const axios = require('axios');
const md5 = require('md5');

class XFYunService extends Service {
  async voiceTranslate(voicePath) {
    // 暴力的读取文件
    let data = fs.readFileSync(voicePath);
    data = new Buffer(data).toString('base64');
    data = formUrlencoded({ audio: data });
    const params = {
      engine_type: 'sms16k',
      aue: 'raw',
    };
    const x_CurTime = Math.floor(new Date().getTime() / 1000) + '',
      x_Param = new Buffer(JSON.stringify(params)).toString('base64');
    return axios({
      url: 'http://api.xfyun.cn/v1/service/v1/iat',
      method: 'POST',
      data,
      headers: {
        'X-Appid': this.config.XFYUN_X_APPID,
        'X-CurTime': x_CurTime,
        'X-Param': x_Param,
        'X-CheckSum': md5(this.config.XFYUN_API_KEY + x_CurTime + x_Param),
      },
    }).then(data => {
      return data.data || {};
    });
  }
}

module.exports = XFYunService;
