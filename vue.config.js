const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/class": {
        target:
          "https://bi.innoclass.cn/api/public/card/422e5936-e3f1-4080-a226-e2311ab69019/query", // 目标服务器地址
        changeOrigin: true, // 是否改变源地址
        pathRewrite: {
          "^/class": "", // 重写路径
        },
      },
      "/crm": {
        target: "https://crm-api.landwave.cn/api/v1", // 目标服务器地址
        changeOrigin: true, // 是否改变源地址
        pathRewrite: {
          "^/crm": "", // 重写路径
        },
      },
    },
  },
});
