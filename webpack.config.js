// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const clubsById = require('./generated/clubs.json')

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./src/scripts/index.ts",
  output: {
    path: path.resolve(__dirname, "public"),
  },
  devtool: "eval-source-map",
  plugins: [
    new MiniCssExtractPlugin({}),
    new HtmlWebpackHarddiskPlugin(),
    ...Object.entries(clubsById).map(
      ([id, club]) =>
        new HtmlWebpackPlugin({
          alwaysWriteToDisk: true,
          inject: false,
          title: club.name,
          filename: `./tt/${club.slug || id}.html`,
          template: `src/html/pages/template-club.hbs`,
          templateParameters: {
            id,
            club
          },
        })
    ),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|jpeg|gif|webp)$/i,
        type: "asset",
        generator: {
          filename: "[path][name][ext][query]",
        },
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader",
        options: {
          helperDirs: [path.join(__dirname, "./src/html/helpers")],
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
    config.devServer = {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      historyApiFallback: {
        rewrites: [{ from: /\/.*/, to: "/index.html" }],
      },
      port: 9000,
    };
  }
  return config;
};
