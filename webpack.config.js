var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var js_path = './src/js/';
var html_path = './src/tpl/';
module.exports = {
    entry: {
        component: path.resolve(js_path, 'component'),
        foldcontent_jquery: './foldcontent-jquery/foldcontent.js',
        foldcontent: './foldcontent-js/demo.js'
    },
    output: {
        path: path.join(__dirname + '/dist'),
        publicPath: '/',
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'chunk/[chunkhash:8].[id].chunk.js'
    },
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
    watch: true,
    devServer: {
        contentBase: './build',
        inline: true,
        hot: true,
        historyApiFallback: true
    },
    resolve: {
        alias: {
            vue: path.resolve(__dirname, './node_modules/vue'),
            jquery: path.resolve(js_path, 'lib/01-jquery-1.11.3.min.js')
        }
    },
    plugins: [
        // extractCss
        new ExtractTextPlugin('css/style.css?[contenthash]'),
        new HtmlWebpackPlugin({
            template: html_path + 'component.html', // 模块路径
            filename: 'tpl/component.html', // 生成的html文件名
            chunks: ['component'], // chunks 引用entry里面的哪几个入口
            inject: 'body' // 把模板注入到哪个标签后
        }),
        new HtmlWebpackPlugin({
            template: './foldcontent-jquery/jquery-webpack.html',
            filename: 'tpl/jquery-webpack.html',
            chunks: ['foldcontent_jquery'],
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            template: './foldcontent-js/demo.html',
            filename: 'tpl/demo.html',
            chunks: ['foldcontent'],
            inject: 'body'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery' // jquery暴露给所有模块，不用显式require('jquery')；只要模块的代码中出现了$，webpack就会自动将jQuery注入。
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
};
