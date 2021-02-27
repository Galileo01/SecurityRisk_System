import { ins, errHandler } from './index'
import axios from 'axios'
//获取所有城镇
export function getAllTown(data) {
    return ins.post('/smallTowns/getAll ', { data })
        .catch(errHandler)
}
//所有风险类型
export function getAllRisk(data) {
    return ins.post('/riskType/getAll ', { data })
        .catch(errHandler)
}
//企业信息表格
export function companySituation(data) {
    return ins.post('/oneTable/companySituation', data)
        .catch(errHandler)
}
//获取所有检查点
export function getAllCheckPoint(id) {
    return ins.get('/oneTable/getAllCheckPoint/' + id)
        .catch(errHandler)

}
//通过检查点获取检查项
export function getAllCheckItem(id) {
    return ins.get('/oneTable/getAllCheckItem/' + id)
        .catch(errHandler)
}
//获取所有隐患
export function getAllHiddenInfoByCondition(data) {
    return ins.post('/oneTable/getAllHiddenInfoByCondition', data)
        .catch(errHandler)
}
//获取电荷检查项
export function getAllCheckPointAndItem(id) {
    return ins.get('/oneTable/getAllCheckPointAndItem/' + id)
        .catch(errHandler)
}
//获取图标
export function countHiddenBySmallTowns(data) {
    return ins.post('/oneTable/countHiddenBySmallTowns', data)
        .catch(errHandler)
}

export function exportAllHiddenInfoByCondition(data) {
    return axios({
        method:'POST',
        url:'/api/oneTable/exportAllHiddenInfoByCondition',
        data:data,
        responseType:'blob'
    })
}
export function exportCompanySituation(data) {
    return axios({
        method:'POST',
        url:'/api/oneTable/exportCompanySituation',
        data:data,
        responseType:'blob'
    })
}