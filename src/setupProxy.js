
const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    // 将原来的proxy改为createProxyMiddleware 
      createProxyMiddleware(
        '/api',
        {
          // target: 'http://127.0.0.1',
          target: 'https://huanshengxiyu.com',
          changeOrigin: true,
          // pathRewrite : { '^/api': '' },
        },
        
      )
    )
};