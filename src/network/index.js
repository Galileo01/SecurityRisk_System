import axios from 'axios';
// const baseURL1 = 'http://sr.hqywork.top:3838';//接口根目录  部署url
const baseURL1 = 'http://sr.hqywork.top:9080/api/visualization/';
const baseURL2 = '/server/visualization/'; //开发环境 使用 跨域代理
const baseURL = process.env.NODE_ENV === 'production' ? baseURL1 : baseURL2;
const ins = axios.create({
    baseURL:baseURL2,
    timeout: 5000,
});
//添加拦截器
ins.interceptors.request.use((config) => {
    // console.log(config);
    config.headers.Authorization = localStorage.getItem('token');
    return config;
});

ins.interceptors.response.use((res) => {
    return {
        ...res.data,
        status: res.data.code === 0 ? res.status : res.data.code,
    };
});
//请求出错时 catch 的处理函数
const errHandler = (err) => {
    // window.$message.error('数据请求失败，请检查网络或重试');//全局输出
    console.log(err);
    return {
        status: err.response.status,
        msg: err,
    };
};

export { ins, errHandler };
