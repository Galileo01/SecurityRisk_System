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

//计算 地图边界 用于绘制 地图轮廓
function calBounds(locations) {
    const AMap = window.AMap;
    for (let i = 0; i < locations.length; i++) {
        locations[i].borders = [];//边界 位置
        locations[i].bounds = [];
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

        //TODO:获取每个区域的边框 和 center
        locations[i].locations.split("|").forEach((locs, idx) => {
            if (locs == "") return;
            const path = [];
            const bounds = [];//测试
            //TODO:计算
            locs.split(";").forEach(p => {
                if (p == "") return;
                var pp = p.split(",");
                path.push([pp[0] * 1, pp[1] * 1]);
                bounds.push([pp[0] * 1, pp[1] * 1]);
            });

            if (idx == maxIdx) {
                var l = path[0][0];
                var t = path[0][1];
                var r = l;
                var b = t;
                for (var j = 1; j < path.length; j++) {
                    if (l > path[j][0]) {
                        l = path[j][0];
                    }
                    if (r < path[j][0]) {
                        r = path[j][0];
                    }
                    if (b > path[j][1]) {
                        b = path[j][1];
                    }
                    if (t < path[j][1]) {
                        t = path[j][1];
                    }
                }
                locations[i].center = [(l + r) / 2, (b + t) / 2];//计算得到 区域的中心
                // console.log( locations[i].center);
            }
            locations[i].borders.push(path);
            locations[i].bounds.push(...bounds);//测试
            // locations[i].bounds.push(path);//测试
        });
    }
    return locations;
}
//获取 全区 地图数据
export function GetLocations() {
    //根据 locations 提前计算边界
    const calculated = calBounds(locations);
    console.log(calculated);
    return calculated;
}


//模拟获取 GeoJson对象
export function getGeoJson() {
    const locations = GetLocations();
    const geo = {
        type: "FeatureCollection",
        features: []
    };
    locations.forEach(item => {
        const { bounds, towner, center } = item;
        geo.features.push({
            properties: {
                name: towner,
                center
            },
            geometry: {
                coordinates: [[...bounds]],
                type: "Polygon"
            }
        })
    })
    return geo;
}
//test
export function getGeoJson1() {
    const locations = GetLocations();
    const geo = {
        type: "FeatureCollection",
        features: []
    };

    //第一个locations 记录的全区的数据
    geo.features.push({
        properties: {
            name: locations[0].towner,
            center: locations[0].center
        },
        geometry: {
            coordinates: [locations[0].bounds],
            type: "Polygon"
        }
    })
    // geo.features.push({
    //     properties: {
    //         name: locations[0].towner,
    //         center: locations[0].center
    //     },
    //     geometry: {
    //         coordinates: [[105.762299, 29.017061]
    //             , [105.761665, 29.016836]],
    //         type: "LineString"
    //     }
    // })
    // locations.forEach(item=>{
    //     console.log(item.towner);
    //     geo.features.push({
    //             properties: {
    //                 name: item.towner,
    //                 center: item.center
    //             },
    //             geometry: {
    //                 coordinates: [...item.borders[0]],
    //                 type: "LineString"
    //             }
    //         })
    // })
    for (let i = 1; i < locations.length; i++) {
        const { bounds, towner, center, borders } = locations[i];
        geo.features.push({
            properties: {
                name: towner,
                center
            },
            geometry: {
                // coordinates: [bounds],
                coordinates:  [bounds],
                type: "Polygon"
            }
        })

    }

    return geo;
}