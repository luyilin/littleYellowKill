var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        bundle: './src/js/main' // 入口文件地址,不需写完,会自动查找或 entry: './src/js/main.js'
    },
    output: {
        path: __dirname + '/dist', // 打包文件存放的绝对路径。build的路径
        // publicPath: '/',
        publicPath: '/dist/',
        /**
         * 资源在server上的路径,配置该属性后打包文件中所有通过相对路径引用的资源都会被配置的路径替换
         * 该属性的好处在于当你配置了图片 CDN 的地址，本地开发时引用本地的图片资源，上线打包时就将资源全部指向 CDN 了。
         * 网站运行时的访问路径,require的路径
         * bazinga。。。要实现热加载必须加此参数,不然会一直报错 Uncaught TypeError: Cannot read property 'call' of undefined
         * 且运行webpack & webpack-dev-server --inline --hot 打包生成的chunk文件的hash值不一样,引用chunk文件一直404!路径出错!
         * 配置此项后无404错误,且因为webpack-dev-server的特性,资源存储在内存中,因此在目录内并未生成实际chunk文件但仍能正常引用!
         * 无需运行webpack,如果允许webpack chunk文件的hash值仍不一样。。。还不晓得为啥子。。。
         * 神坑啊。。看文档太不细心了。。找了半天
         */
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[chunkhash:8].chunk.js'
        /**
         * chunkhash仅在chunk改变时更改,弱化版本号的概念,chunk更新后名称改变无缓存影响
         */
    },
    module: {   // 加载器
        loaders: [
            {
                test: /\.css$/,
                // loader: 'style!css'
                /**
                 * test 表示匹配的资源类型,loader表示资源加载器
                 * 另一种格式['style', 'css'] 依旧是从右往左解析
                 * 此种方法加载css原理:在<head>标签内建立<style>标签并将css内容添加到<style>标签里
                 * 注意此处是loader而不是loaders
                 */
                loader: ExtractTextPlugin.extract("vue-style-loader", "css-loader")
                /**
                 * 将css单独编译输出并且打上hash指纹
                 * 插入link标签到head标签内
                 * webpack计算chunkhash原理，以main.js文件为编译入口，整个chunk的内容会将引入的js、css等都计算在内
                 * 因此不论修改js、css文件,整个chunk的内容都会改变,chunkhash也会改变,js、css共用相同的chunkhash
                 * 指纹解耦方案: 引入extract-text-webpack-plugin插件,为css文件添加单独的contenthash
                 */
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=img/[hash:8].[name].[ext]'
                /**
                 * 小于8k的背景图片被转化成了base64编码,减少http请求
                 * 大于8k的图片没有转化,但路径和文件名有变化,直接使用img导入的图没有进行base64转化
                 * 在大小限制后可以加上&name=img/[hash:8].[name].[ext],会将我们的文件生成在设定的文件夹img下
                 */
            },
            {
                test: /\.html$/,
                loader: 'html-withimg-loader'
            }
            /**
             * bazinga webpack 图片打包
             * webpack 对 html 的处理不太好，打包 HTML文件中的图片资源是相对来说最麻烦的。
             * 引用插件 html-withimg-loder, main.js中 require('../tpl/main.html');
             *
             * JS中的图片初用 webpack 进行项目开发的同学会发现：在 js 或者 react 中引用的图片都没有打包进 bundle 文件夹中。
             * 正确写法应该是通过模块化的方式引用图片路径，这样引用的图片就可以成功打包进 bundle 文件夹里了
             * js
             * var imgUrl = require('./images/bg.jpg'),
             * imgTempl = '<img src="'+imgUrl+'" />';document.body.innerHTML = imgTempl;
             *
             * react
             * render() {return (<img src={require('./images/bg.jpg')} />);}
             */
        ]
    },
    externals: {
        // 'vue': true
        /**
         * 使用externals,不被webpack打包,用<script>单独引入第三方库
         * 将vue分离，不打包到一起
         * 本项目打包到一起了
         */
    },
    devServer: {
        contentBase: './src/', // 目录  port: 8080, 端口默认8080,
        /**
         * bazinga,入口文件内引入bundle.js时需引入http://localhost:8080/bundle.js,这个才是webpack命令生成的js文件,
         * 若直接调用'bundle.js'则修改入口js文件不会自动刷新
         * 因为webpack-dev-server将资源存储在内存中,http://localhost:8080/webpack-dev-server访问打包的资源们
         * http://localhost:8080/webpack-dev-server 访问存储的静态资源
         */
        inline: true, 
        hot: true ,
        /**
         *
         * inline: true, 热加载,重新加载整个入口页面
         * hot: true 热替换,重新加载组件改变的部分,不重新加载整个页面, inline和hot两个参数都传入的时候,热替换失败后重新加载整个入口文件
         * bazinga,config参数里面inline和hot有时不能自动刷新,启动webServer时命令行输 webpack-dev-server --inline --hot
         */
        historyApiFallback: {
            index: './src/tpl/main'
        }
        /**
         * historyApiFallback 参数每当路径匹配的文件不存在时不出现404,historyApiFallback: true 默认index.html,
         * 配置显示`404s will fallback to ../src/tpl/main`
         * 有时迷之报错。。
         */
        },
    watch: true,
    plugins: [
        new ExtractTextPlugin('css/style.css?[contenthash]'),
        /**
         * 自动添加link标签加载css并设置路径、名称
         */
        new HtmlWebpackPlugin({
            filename: './tpl/main.html',
            template: './src/tpl/main.html',
            inject: 'body',
            hash: false,
            chunks: ['test2'], // chunks这个参数告诉插件要引用entry里面的哪几个入口
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
        /**
         * 编译生成html的配置,必须有, bazinga
         * filename 生成的html存放路径及名称,本例访问http://localhost:8080/dist/tpl/main.html
         * template html模版路径,原未引入css、js等的纯html文件
         * jnject js插入的位置 true对应head false对应body,自动引入js文件
         * bazinga html template中不需手动引入js、css等! 配置好后webpack会自动引入
         * hash 为静态资源生成hash值, 注意此处hash值是编译生成的bundle.js的hash值,css、js改变都会引起其变化,根据指纹解耦方案,此处false
         * chunks 需要引入的chunk,不配置就引入所有页面的资源
         * minify 压缩html文件 removeComments: true 移除html中的注释 collapseWhitespace: false 删除空白符与换行符
         */
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
        /**
         * webpack 自带压缩插件 UglifyJsPlugin
         */
    ]

    /**
     * 根目录下建立webpack的配置文档 webpack.config.js
     * 原先需要在要打包文件所在目录下js/运行 webpack main.js bundle.js
     * 配置后直接在项目根目录下运行webpack即可打包成功
     * entry 要打包文件的入口,可以有多个文件
     * path: __dirname, 当前目录
     * watch: true 自动检测文件变化并重新打包,监测entry文件,命令行任务不停止
     * webpack认为一切静态资源都是模块,包括html模版、js、css、字体等,webpack通过loader打包除js的资源
     * style-loader将css文件以<style></style>标签插入<head>头部
     * css-loader解读、加载css文件
     * 在main.js中添加`require('style!css!../css/style.css)` 一个文件可以经由多个loader依次处理,loader与loader之间,
     * loader与文件名之间用!分隔,如果使用多个loader数据流是从右向左的,style.css ➡️ css-loader ➡️ style-loader
     * require添加loader说明不够方便,也可在webpack.config.js中配置
     * webpack-dev-server 资源服务器 实现实时刷新页面
     */
};
