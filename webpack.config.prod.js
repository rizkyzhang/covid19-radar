const path = require("path");
const glob = require("glob");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");

const commonConfig = require("./webpack.config.common");

const PATHS = {
  app: path.join(__dirname, "src"),
};

module.exports = merge(commonConfig, {
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new PurifyCSSPlugin({
      paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
      purifyOptions: {
        minify: true,
      },
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace("@", "")}`;
          },
        },
      },
    },
    runtimeChunk: { name: "manifest" },
  },
});
