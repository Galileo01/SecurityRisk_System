//绘制永川区 的单独轮廓
import { GetLocations, getYongchuanBoundary } from 'network/map'
//使用
export function calRiskSourceBorder() {

}

//计算 风险源的中心和圆半径
export function calRiskSource(riskSource) {
    for (let i in riskSource) {
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;//记录最大最小的经纬度
        const checkPoints = riskSource[i].checkPoints;
        for (let j in checkPoints) {
            const [lon, lat] = checkPoints[j].position;
            if (j == 0)//初始化 
            {
                // console.log(j, lon, lat);
                x1 = x2 = lon;
                y1 = y2 = lat;
            }
            else {
                x1 = Math.min(x1, lon);
                x2 = Math.max(x2, lon);
                y1 = Math.min(y1, lat);
                y2 = Math.max(y2, lat);
            }
        }
        const r = Math.ceil(Math.max(x2 - x1, y2 - y1) / 2);//TODO:需要进一步调整计算半径 向上取整
        const center = new AMap.LngLat((x1 + x2) / 2, (y1 + y2) / 2);
        riskSource[i].center = center;
        riskSource[i].radius = r;
    }
    return riskSource;
}
