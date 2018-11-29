'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
    console.log(this.config.XFYUN_X_APPID);
  }
}

module.exports = HomeController;
