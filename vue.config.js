module.exports = {
    configureWebpack: config => {

        let configuration = {
            resolve: {
                alias: {   //@ 已经在 目录中被定义 ，定义为src
                    'assets': '@/assets',
                    'commonjs': '@/commonjs',
                    'components': '@/components',
                    'network': '@/network',
                    'views': '@/views',
                    'useModule': '@/useModule'
                }
            },
        };
        if (process.env.NODE_ENV === 'production')//打包时 使用外部资源
        {
            // configuration.entry = './src/main-prod.js';//生产环境下使用入口文件
            configuration.externals = {
                'vue': 'Vue',
                'axios': 'axios',
                'vue-router': 'VueRouter',
                'echarts':'echarts'
            }
        }
        return configuration;
    },
    css: { //开启 javascript 将 ant design 的less 转换为 css
        loaderOptions: {
            less: {
                lessOptions: {
                    javascriptEnabled: true,
                }
            }
        }
    },
    publicPath: "./",
    devServer: {

    }
}
