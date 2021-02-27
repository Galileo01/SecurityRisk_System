import { ins, errHandler } from './index';
import { computeCenter } from 'useModules/utils';
//获取企业/风险源的 位置信息 通过关键字搜搜
export async function queryCompanyByKeyword(companyName, isVague = true) {
    //是否是 模糊查询
    const { status, data, msg } = await ins.get(
        '/onePicture/selectCompanyPosition'
    ); //获取所有 企业信息
    if (status !== 200) return { status, data, msg };
    let filtered = null;
    if (!isVague) {
        //如果不是模糊查询，
        filtered = data.find((item) => item.companyName === companyName);
    } else
        filtered = data.filter((item) =>
            item.companyName.includes(companyName)
        ); //查找包含 该关键词的 企业
    return { status, data: filtered };
}

//获取
export async function getAllCompanyInfos() {
    const { status, data, msg } = await ins.get(
        '/onePicture/selectCompanyPosition'
    );
    if (status !== 200) return { status, data, msg };

    return {
        status,
        data: data.map((company) => {
            return {
                ...company,
                center:
                    company.checkPointBOList.length > 0
                        ? computeCenter(company.checkPointBOList)
                        : [],
            };
        }),
    };
}
//获取 所有的检查点
export async function getAllCheckPoints() {
    const { status, data, msg } = await getAllCompanyInfos();
    if (status !== 200) return { status, data, msg };
    const checkPoints = [];
    data.forEach(({ id, checkPointBOList, companyName }) => {
        checkPointBOList.forEach(
            ({ positionX, positionY, checkPointId, checkPointName }) => {
                checkPoints.push({
                    positionX,
                    positionY,
                    companyId: id,
                    companyName,
                    checkPointId,
                    checkPointName,
                });
            }
        );
    });
    return { status, data: checkPoints, msg };
}

//根据 id 获取 检查点 检查项
export function getItemByPointID(id) {
    return ins.get('/oneTable/getAllCheckItem/' + id).catch(errHandler);
}
