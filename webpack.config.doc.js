module.exports = {
    entry: {
        bundle: './src/js/main' // 入口文件地址,不需写完,会自动查找或 entry: './src/js/main.js'
    },
    output: {
        path: __dirname + '/src/tpl', // 打包文件存放的绝对路径。bazinga,输出目录需要和入口文件在同一目录下
        publicPath: '/',
        /**
         * 网站运行时的访问路径
         * bazinga。。。要实现热加载必须加此参数,不然会一直报错 Uncaught TypeError: Cannot read property 'call' of undefined
         * 且运行webpack & webpack-dev-server --inline --hot 打包生成的chunk文件的hash值不一样,引用chunk文件一直404!
         * 配置此项后无404错误,且因为webpack-dev-server的特性,资源存储在内存中,因此在目录内并未生成实际chunk文件但仍能正常引用!
         * 无需运行webpack,如果允许webpack chunk文件的hash值仍不一样。。。还不晓得为啥子。。。
         * 神坑啊。。看文档太不细心了。。找了半天
         */
        filename: '[name].js',
        chunkFilename: '[chunkhash:8].chunk.js'
        /**
         * chunkhash仅在chunk改变时更改,弱化版本号的概念,chunk更新后名称改变无缓存影响
         */
    },
    module: {   // 加载器
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
                /**
                 * test 表示匹配的资源类型,loader表示资源加载器
                 * 另一种格式['style', 'css'] 依旧是从右往左解析
                 * webpack 加载css原理:在<head>标签内建立<style>标签并将css内容添加到<style>标签里
                 * 注意此处是loader而不是loaders
                 */
        },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
                /**
                 *小于8k的背景图片被转化成了base64编码,大于8k的图片没有转化,但路径和文件名有变化,直接使用img导入的图没有进行base64转化
                 */
            }
        ]
    },
    externals: {
        // 'vue': true
        /**
         * 不被webpack打包
         * 将vue分离，不打包到一起，使用externals。然后用<script>单独将vue引入
         * 本项目打包到一起了
         */
    },
    devServer: {
        contentBase: './src/', // 目录  port: 8080, 端口默认8080,
        /**
         * bazinga,入口文件内引入bundle.js时需引入http://localhost:8080/bundle.js,这个才是webpack命令生成的js文件,
         * 若直接调用'bundle.js'则修改入口js文件不会自动刷新,因为webpack-dev-server将资源存储在内存中
         * (ps修改html文件一直不会自动刷新。gulp watch优势)
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
         */
        },
    watch: true

    /**
     * 根目录下建立webpack的配置文档 webpack.config.js
     * 原先需要在要打包文件所在目录下js/运行 webpack main.js bundle.js
     * 配置后直接在项目根目录下运行webpack即可打包成功
     * entry 要打包文件的入口,可以有多个文件
     * path: __dirname, 当前目录
     * watch: true 自动检测文件变化并重新打包,监测entry文件,命令行任务不停止
     * webpack认为一切静态资源都是模块,包括html模版、js、css、字体等,webpack通过loader打包除js的资源
     * style-loader将css文件以<style></style>标签插入<head>头部,css-loader解读、加载css文件
     * 在main.js中添加`require('style!css!../css/style.css)` 一个文件可以经由多个loader依次处理,loader与loader之间,
     * loader与文件名之间用!分隔,如果使用多个loader数据流是从右向左的,style.css ➡️ css-loader ➡️ style-loader
     * require添加loader说明不够方便,也可在webpack.config.js中配置
     * webpack-dev-server 资源服务器 实现实时刷新页面
     */
};
