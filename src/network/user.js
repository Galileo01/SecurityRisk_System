import { ins, errHandler } from './index';
import { getAllCompanyInfos } from './company';
import axios from 'axios';
const baseURL =
    (process.env.NODE_ENV === 'production' ? '/api' : '/server') +
    '/security/authUser';
//创建安全认证服务 的单独 axios 实例
const authIns = axios.create({
    baseURL,
    timeout: 5000,
});
authIns.interceptors.request.use((config) => {
    // console.log(config);
    config.headers.Authorization = localStorage.getItem('token');
    return config;
});

authIns.interceptors.response.use((res) => {
    return {
        ...res.data,
        status: res.status,
    };
});

export function getCheckCode() {
    return axios
        .get('http://sr.hqywork.top:9080/api/security/signin')
        .catch(errHandler);
}
export function login({ userName, passWord, checkCode }) {
    return authIns
        .post('/login', {
            userName,
            passWord,
            // checkCode,
        })
        .catch(errHandler);
}

export function updateUser({ id, passWord, phone, modifiedBy }) {
    return authIns
        .post('/updateUser', {
            id,
            passWord,
            phone,
            modifiedBy,
        })
        .catch(errHandler);
}

export function collectCompany(companyId) {
    return ins.post('/onePicture/focusCompany', {
        companyId,
    });
}

export function cancelCollectCompany(id) {
    return ins.post('/onePicture/cancelFocusCompany', {
        id,
    });
}
export function getFocuedCompany() {
    return ins.post('/onePicture/queryFocusCompany', {
        companyName: '',
    });
}
//获取 关注企业的 完整信息  结合获取所有 企业 接口
export async function getFocuedCompanyInfos() {
    const { data: allInfo, status: status1 } = await getAllCompanyInfos();
    if (status1 !== 200)
        return {
            status: status1,
        };
    const { data: focused, status: status2 } = await getFocuedCompany();
    if (status2 !== 200)
        return {
            status: status2,
        };
    return {
        status: 200,
        data: allInfo.filter((item) => focused.find((item2)=>item2.id === item.id)),
    };
}

//根据 token 获取 当前用户 的用户信息
export function queryUserInfo() {
    return authIns.get('/getUserInfo').catch(errHandler);
}
queryUserInfo();
