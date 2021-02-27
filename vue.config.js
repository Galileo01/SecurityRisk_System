// const urlRun='http://sr.hqywork.top:3838';
const urlRun = 'http://sr.hqywork.top:9080/api/';
// const urlRun='http://sr.hqywork.top:9080/api/visualization/';
const urlDev = 'http://119.29.120.78:8080';
module.exports = {
    configureWebpack: (config) => {
        let configuration = {
            resolve: {
                alias: {
                    //@ 已经在 目录中被定义 ，定义为src
                    assets: '@/assets',
                    commonjs: '@/commonjs',
                    components: '@/components',
                    network: '@/network',
                    views: '@/views',
                    useModules: '@/useModules',
                    onemap: '@/components/onemap',
                    common: '@/components/common',
                },
            },
        };
        if (process.env.NODE_ENV === 'production') {
            //打包时 使用外部资源
            // configuration.entry = './src/main-prod.js';//生产环境下使用入口文件
            configuration.externals = {
                vue: 'Vue',
                axios: 'axios',
                'vue-router': 'VueRouter',
                echarts: 'echarts',
            };
        }
        return configuration;
    },
    css: {
        //开启 javascript 将 ant design 的less 转换为 css
        loaderOptions: {
            less: {
                lessOptions: {
                    javascriptEnabled: true,
                },
            },
        },
    },
    publicPath: './',
    devServer: {
        proxy: {// 开发代理
            '/server': {
                target: urlRun,
                changeOrigin: true,
                pathRewrite: {
                    '^/server': ''
                }
            },
            // '/security':
            // {

            // }
        },
        // proxy: {
        //     '/p1': {
        //         target: 'http://localhost:5000',
        //                 changeOrigin: true,
        //                 pathRewrite: {
        //                     '^/p1': ''
        //                 }
        //     },
        //     '/p2': {
        //         target: 'http://localhost:5001',
        //                 changeOrigin: true,
        //                 pathRewrite: {
        //                     '^/p2': ''
        //                 }
        //     },
        // },
        // proxy:urlRun// 将 没有匹配到静态文件的请求)代理到
    },
};
