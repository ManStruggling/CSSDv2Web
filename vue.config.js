let Version = '1127';
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ?
        '/' : '/',
    //打包过后的文件夹名
    outputDir: 'wwwroot',
    //设置打包后的静态资源的文件夹名
    assetsDir: 'web' + Version,
    //文件名是否添加hash值
    filenameHashing: true,

    //在多页模式下构建时，Webpack配置将包含不同的插件
    // (将有多个HTML Webpack插件和预加载Webpack插件实例).
    // 如果您试图修改这些插件的选项，请确保运行vue inspect。
    pages: {
        index: {
            // 入口文件
            'babel-polyfill': 'babel-polyfill',
            entry: 'src/main.js',

            // the source template
            template: 'src/pages/index/index.html',
            // 打包后的html文件名
            filename: 'index.html',
            // when using title option,
            // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: '首页',
            // chunks to include on this pages, by default includes
            //  默认情况下，要包含在此页上的块包括
            // extracted common chunks and vendor chunks.
            //  提取的公共块和供应商块
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
        // when using the entry-only string format,
        //  使用仅输入字符串格式时
        // template is inferred to be `public/subpage.html`
        //  模板被推断为'public/subpage.html`
        // and falls back to `public/index.html` if not found.
        //  如果找不到，则返回到“public/index.html”
        // Output filename is inferred to be `subpage.html`.
        //  输出文件名被推断为'subpage.html`
        // subpage: ''
    },

    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,

    // 是否使用包含运行时编译器的Vue核心的构建
    runtimeCompiler: false,

    // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
    transpileDependencies: [],

    // 生产环境 sourceMap
    productionSourceMap: false,

    // cors 相关 https://jakearchibald.com/2017/es-modules-in-browsers/#always-cors
    // corsUseCredentials: false,
    // webpack 配置，键值对象时会合并配置，为方法时会改写配置
    // https://cli.vuejs.org/guide/webpack.html#simple-configuration
    configureWebpack: {
        devtool: 'eval-source-map'
    },

    // webpack 链接 API，用于生成和修改 webapck 配置
    // https://github.com/mozilla-neutrino/webpack-chain
    chainWebpack: (config) => {
        // 因为是多页面，所以取消 chunks，每个页面只对应一个单独的 JS / CSS
        config.optimization
            .splitChunks({
                cacheGroups: {}
            });

        // 'src/lib' 目录下为外部库文件，不参与 eslint 检测
        config.module
            .rule('eslint')
            .exclude
            .add('/Users/maybexia/Downloads/FE/community_built-in/src/lib')
            .end()
    },

    // 配置高于chainWebpack中关于 css loader 的配置
    css: {
        // 是否开启支持 foo.module.css 样式
        modules: false,

        // 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
        extract: true,

        // 是否构建样式地图，false 将提高构建速度
        sourceMap: false,

        // css预设器配置项
        loaderOptions: {
            css: {
                // options here will be passed to css-loader
            },

            postcss: {
                // options here will be passed to postcss-loader
            }
        }
    },

    // 支持webpack dev server的所有选项
    // https://webpack.js.org/configuration/dev-server/
    devServer: {
        open: true,

        host: '127.0.0.1',
        hot: true,
        port: 9000,

        https: false,

        hotOnly: false,

        proxy: null,

        before: app => {}
    },
    // 构建时开启多进程处理 babel 编译
    parallel: require('os').cpus().length > 1,

    // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},

    // 第三方插件配置
    pluginOptions: {}
};