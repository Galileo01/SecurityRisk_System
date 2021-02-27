import { ins, errHandler } from './index';
import axios from 'axios';
//获取全区隐患数量
export function getUnsolvedRiskCount(companyIds = []) {
    return ins
        .post('/onePicture/countHiddenTrouble', { companyIds })
        .catch(errHandler);
    // return axios.post('/api/onePicture/countHiddenTrouble');
}
//获取 隐患的详细信息
export function getRiskDetailInfo() {
    return ins.get('/onePicture/selectAllHiddenTroubleInfo ').catch(errHandler);
}
//获取按照 级别分类的 隐患统计数据
export function getLeveledRiskCount(companyIds = []) {
    return ins
        .post('/onePicture/countHiddenTroubleLevel', { companyIds })
        .catch(errHandler);
}
//获取隐患的 状态统计信息
export function getStatusRiskCount() {
    return ins.get('/onePicture/countHiddenTroubleStatus').catch(errHandler);
}

//通过多种 条件 查询隐患
export async function queryByCondition({
    riskTypeCode,
    smallTownCode,
    hiddenTroublesLevel,
    riskStatus,
    reportDateStart,
    reportDateEnd,
    reportDate,
}) {
    const { data, msg, status } = await ins.post(
        '/onePicture/queryHtByCondition',
        {
            riskTypeCode: riskTypeCode || null,
            smallTownCode: smallTownCode || null,
            hiddenTroublesLevel: hiddenTroublesLevel || null,
            riskStatus,
            reportDateStart: reportDateStart || '',
            reportDateEnd: reportDateEnd || '',
            reportDate: reportDate || '', //时间轴 查询
        }
    );
    if (status !== 200) return { status, msg };
    const levelNumber = {
        低危: 0,
        一般: 1,
        较大: 2,
        重大: 3,
    };
    data.forEach(({ companyActiveRiskBOList, checkPointName ,companyName}, index) => {
        let maxLevel = 0;
        companyActiveRiskBOList.forEach(({ riskLevel }, index2) => {
            const number = levelNumber[riskLevel];
            maxLevel = number > maxLevel ? number : maxLevel;
            companyActiveRiskBOList[index2].checkPointName = checkPointName;
            companyActiveRiskBOList[index2].companyName = companyName;
        });
        data[index].maxLevel = maxLevel;
    });
    return { data, status };
}

//通过id查询 隐患详情 包括 经纬度
export function getRiskDetailById(id) {
    return ins
        .get('/onePicture/selectHiddenDetailById/' + id)
        .catch(errHandler);
}
//获取 风险类型
export function getRiskTypes() {
    return ins.get('/riskType/getAll').catch(errHandler);
}

//修改 参数
export async function getUnsolvedRiskInfo() {
    const { data, msg, status } = await ins.get(
        '/onePicture/getAllActiveHiddenTroubles'
    );
    if (status !== 200) return { status, msg };
    //计算该检查点 相关隐患的 最大等级
    const levelNumber = {
        低危: 0,
        一般: 1,
        较大: 2,
        重大: 3,
    };
    data.forEach(({ companyActiveRiskBOList, checkPointName }, index) => {
        let maxLevel = 0;
        companyActiveRiskBOList.forEach(({ riskLevel }, index2) => {
            const number = levelNumber[riskLevel];
            maxLevel = number > maxLevel ? number : maxLevel;
            companyActiveRiskBOList[index2].checkPointName = checkPointName;
        });
        data[index].maxLevel = maxLevel;
    });
    return { data, status };
}

//获取某个等级的  未解决（未处理+处理中的）的 隐患数据列表
export async function getUnsolvedRiskInfoOfLevel(hiddenTroublesLevel) {
    try {
        //请求两个状态的 隐患
        const res = await Promise.all([
            queryByCondition({ hiddenTroublesLevel, riskStatus: '未处理' }),
            queryByCondition({ hiddenTroublesLevel, riskStatus: '处理中' }),
        ]);
        // console.log(res);
        //转为 一个数组
        return { status: 200, data: [...res[0].data, ...res[1].data] };
    } catch (err) {
        return { status: 500, msg: err };
    }
}
