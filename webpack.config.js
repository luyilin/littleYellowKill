module.exports = {
    entry: {
        bundle: './src/js/main'
    },
    output: {
        path: __dirname + '/src/tpl',
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[chunkhash:8].chunk.js'
    },
    watch: true,
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
        },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    },
    devServer: {
        contentBase: './src/',
        inline: true,
        hot: true,
        historyApiFallback: {
            index: './src/tpl/main'
        }
    }
};
