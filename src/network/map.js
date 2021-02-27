//获取 地理位置有关数据
import { ins, errHandler } from './index'

//获取 所有乡镇信息 用于 条件查询
export function getTownList() {
    return ins.get('/smallTowns/getAll')
        .catch(errHandler)
}