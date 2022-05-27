module.exports = {
  runtimeCompiler: true,
  devServer: {
    disableHostCheck: true,
    port: 4000,
    public: "http://localhost:4000",
  },
  publicPath: "/",
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Muse Vue Ant Design - by Creative Tim";
      return args;
    });
  },
};
