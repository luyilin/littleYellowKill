var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        bundle: './src/js/main'
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/dist/',
        filename: 'js/[name].js',
        chunkFilename: 'chunk/[chunkhash:8].chunk.js'
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
        })
    ]
};
