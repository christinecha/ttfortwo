// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const pages = [
  { title: "Law Office of Wan Cha, Esq., LLC", filename: "index" },
  { title: "Team | Law Office of Wan Cha", filename: "team" },
  { title: "Practice | Law Office of Wan Cha", filename: "practice" },
  { title: "Contact | Law Office of Wan Cha", filename: "contact" },
];

const config = {
  entry: "./src/scripts/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "eval-source-map",
  plugins: [
    new MiniCssExtractPlugin({}),
    ...pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          inject: false,
          title: page.title,
          filename: `${page.filename}.html`,
          template: `src/html/${page.filename}.hbs`,
          templateParameters: {
            t: require("./src/content.json"),
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
