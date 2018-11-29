'use strict';
const { Service } = require('egg');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegStatic.path);

class FFmpegService extends Service {
  async voice2wav(voicePath) {
    const command = ffmpeg(voicePath);
    const targetDir = path.join(path.dirname(voicePath), 'wav');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }

    const target = path.join(targetDir, path.basename(voicePath)) + '.wav';
    return new Promise((resolve, reject) => {
      command
        .audioCodec('pcm_s16le')
        .audioChannels(2)
        .audioBitrate(8000)
        .output(target)
        .on('error', error => {
          reject(error);
        })
        .on('end', () => {
          resolve(target);
        })
        .run();
    });
  }
}

module.exports = FFmpegService;
