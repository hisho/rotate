const webpack = require(`webpack`); //webpack本体
const path = require(`path`); // 安全にパスを解決する
const setting = require('./settings');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin'); //cssを取り出す
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");//不要なjsファイルを生成しない
//TSの型チェックを別スレッドで実行するのに必要
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env,argv) => {
  const MODE = argv.mode;
  const IS_DEVELOPMENT = argv.mode === `development`;//開発中
  const IS_PRODUCTION = argv.mode === `production`;//本番
  return {
    mode: MODE,
    devtool: IS_DEVELOPMENT ? 'inline-source-map' : 'eval',
    entry: {
      "docs/assets/js/main": "./src/js/main",
      "docs/assets/css/style": "./src/scss/style",
    },
    output: {
      filename: `[name].js`,
      path: path.join(__dirname)
    },
    resolve: {
      extensions: ['.ts','.tsx','.jsx','.js','.scss'],
    },
    module: {
      rules: [
        {
          // TypeScriptのバンドル
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
              }
            }
          ],
        }, 
        {
          // scssのバンドル
          test: /\.scss$/,
          // node_modules内のscssは除外
          exclude: /node_modules/,
          use: [
            {
              // cssを取り除く
              loader: ExtractCssChunks.loader,
            },
            {
              loader: "css-loader",
              options: {
                url: false,
                sourceMap: true,
              }
            }, 
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true,
                plugins: [
                  require("autoprefixer")({
                    grid: "autoplace"
                  })
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                //Dart SASSを使う
                implementation: require('sass', {
                  outputStyle : 'expanded',
                }),
                sassOptions: {
                  fiber: require('fibers'),
                },
              }
            },
            {
              loader: "import-glob-loader",
            },
          ],
        },
      ]
    },
    plugins: [
      new FixStyleOnlyEntriesPlugin(),
      new ExtractCssChunks({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new ForkTsCheckerWebpackPlugin(), //typeScriptの型チェックを別スレッドでする
      new webpack.ProgressPlugin(), //webpackの進捗をコンソールに表示する
    ],
  }
};
