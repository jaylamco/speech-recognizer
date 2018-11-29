'use strict';

const Controller = require('egg').Controller;
const { isEmpty } = require('lodash');
const pump = require('mz-modules/pump');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '..', '..', 'uploads');

class FileController extends Controller {
  constructor(params) {
    super(params);
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath);
    }
  }

  async show() {
    await this.ctx.render(
      'page/multiple.html',
      {},
      {
        layout: 'layout.html',
      }
    );
  }

  async upload() {
    const parts = this.ctx.multipart({ autoFields: true });
    let stream;
    const voicePath = path.join(targetPath, uuidv1());
    while (!isEmpty((stream = await parts()))) {
      await pump(stream, fs.createWriteStream(voicePath));
    }
    const wavPath = await this.ctx.service.ffmpeg.voice2wav(voicePath);
    const result = await this.ctx.service.xfyun.voiceTranslate(wavPath);
    this.ctx.body = result;
    if (+result.code !== 0) {
      this.ctx.status = 500;
    }
  }
}

module.exports = FileController;
