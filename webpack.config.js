var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var js_path = './src/js/';
var html_path = './src/tpl/';
module.exports = {
    entry: {
        bundle: js_path + 'main',
        // test: js_path + 'test',
        // 注意已经在主文件中require过的文件不要作为入口文件,否则会报错 a dependency to an entry point is not allowed
        test2: js_path + 'test2'
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/dist/',
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'chunk/[chunkhash:8].[id].chunk.js'
    },
    watch: true,
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("vue-style-loader", "css-loader")
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=img/[hash:8].[name].[ext]'
            },
            {
                test: /\.html$/,
                loader: 'html-withimg-loader'
            }
        ]
    },
    devServer: {
        contentBase: './dist/',
        inline: true,
        hot: true,
        historyApiFallback: {
            index: 'tpl/main'
        }
    },
    plugins: [
        // extractCss
        new ExtractTextPlugin('css/style.css?[contenthash]'),
        new HtmlWebpackPlugin({
            filename: 'tpl/main.html',
            template: './src/tpl/main.html',
            inject: 'body',
            hash: false,
            // chunks: [],
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
        new HtmlWebpackPlugin({
            title: 'Hello World app',
            template: html_path + 'test.html',
            filename: 'tpl/test.html',
            chunks: ['test2'], // chunks这个参数告诉插件要引用entry里面的哪几个入口
            inject: 'body'
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
};
