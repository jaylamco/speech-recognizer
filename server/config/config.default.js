'use strict';

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1541681356385_4137';

  // add your config here
  config.middleware = [];

  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  };

  config.multipart = {
    fileSize: '2gb',
    whitelist: [ '.aac', '.m4a', '.mp3' ],
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.XFYUN_API_KEY = 'xxx';
  config.XFYUN_X_APPID = 'xxx';

  return config;
};
