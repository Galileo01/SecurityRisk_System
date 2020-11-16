import axios from 'axios'
import { locations } from './tempData'
//获取永川区 的地图数据
//
//获取 永川区的
export function getYongchuanBoundary() {
    return axios.get('https://restapi.amap.com/v3/config/district?key=af0fcd0461c57dea44fb9ac3e4bf6693&keywords=永川&subdistrict=1&extensions=all').then(res => {
        console.log(res.data);
        const polyline = [];
        res.data.districts[0].polyline.split(';').forEach((str) => {
            console.log(str);
            console.log(str.split(','));
        })
        console.log(polyline);

        return res.data
    })
}

//计算 边界
function calBounds(locations) {
    const AMap = window.AMap;
    for (let i = 0; i < locations.length; i++) {
        locations[i].borders = [];//边界 位置
        //查找最大的多边形
        let c = 0;
        let maxIdx = 0;
        locations[i].locations.split("|").forEach((locs, idx) => {
            if (locs.length > c) {
                c = locs.length;
                maxIdx = idx;
            }
        });
        //获取整个边框
        if (i == 0) {
            let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
            locations[i].locations.split("|").forEach((locs, idx) => {
                if (locs == "") return;
                locs.split(";").forEach((p, j) => {
                    if (p == "") return;
                    var pp = p.split(",");//分割出 经纬度
                    let x = pp[0] * 1;//转换为 数字
                    let y = pp[1] * 1;
                    if (i == 0 && j == 0) {
                        x1 = x
                        x2 = x
                        y1 = y
                        y2 = y2

                    }
                    else {
                        x1 = Math.min(x1, x)
                        x2 = Math.max(x2, x)
                        y1 = Math.min(y1, y)
                        y2 = Math.max(y2, y)
                    }
                });

            });
            locations[0].Rect = { x1, x2, y1, y2 }
        }
        //TODO:获取每个区域的边框 和 center
        locations[i].locations.split("|").forEach((locs, idx) => {
            if (locs == "") return;
            var path = [];
            //TODO:计算
            locs.split(";").forEach(p => {
                if (p == "") return;
                var pp = p.split(",");
                path.push(new AMap.LngLat(pp[0] * 1, pp[1] * 1, true));//转换为经纬度
            });

            if (idx == maxIdx) {
                var l = path[0].lng;
                var t = path[0].lat;
                var r = l;
                var b = t;
                for (var j = 1; j < path.length; j++) {
                    if (l > path[j].lng) {
                        l = path[j].lng;
                    }
                    if (r < path[j].lng) {
                        r = path[j].lng;
                    }
                    if (b > path[j].lat) {
                        b = path[j].lat;
                    }
                    if (t < path[j].lat) {
                        t = path[j].lat;
                    }
                }
                locations[i].center = { x: (l + r) / 2, y: (b + t) / 2 };//计算得到 区域的中心
            }
            locations[i].borders.push(path);

        });
    }
    return locations;
}
//获取 全区 地图数据
export function GetLocations() {
    //根据 locations 提前计算边界
    const calculated = calBounds(locations);
    return calculated;
}

