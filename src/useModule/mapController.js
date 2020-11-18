//处于风险源数据 用于echarts 的渲染 计算+分类
function compute(riskSource) {
    const computed = {
        type1: [],
        type2: [],
        type3: [],
        type4: []
    }

    riskSource.forEach((item) => {
        const { riskType, center, radius, compnayName, companyId } = item;
        // console.log(center);
        computed[riskType].push({
            compnayName: compnayName, //数据部分用于 点击事件的处理
            companyId,
            name: compnayName,
            value: [center.lng, center.lat, radius * 300]//value 字段用于echarts 散点图的渲染：lon,lat,radius
        })
    })
    return computed;
}
//echart 地图 控制器
export class echartMapController {
    echartsIns = null;//实例
    constructor(echartsIns) {
        this.echartsIns = echartsIns;
    }
    init(riskSource) {
        this.drawRiskSource(riskSource);
    }
    //绘制风险源
    drawRiskSource(riskSource) {
        //公共是属性 的抽取
        const computed = compute(riskSource);
        const scatterProperyt = {
            symbolSize: function (val) {
                return val[2] / 10;
            },
            encode: {
                value: 2, //指定元素的第三个元素值 作为值 映射
            },
            label: {
                formatter: "{b}:\n{c}",
                position: "right",
                show: false,
                backgroundColor: "#2e4639",
                color: "#fff",
                padding: 10,
            },
            //   itemStyle: {
            //     color: "purple",
            //   },
            emphasis: {
                label: {
                    show: true,
                },
            },
        };
        const option = {
            // legend: {
            //     right: 10,
            //     orient: "vertical",
            //     data: ["type1", "type2", "type3", "type4"],
            // },
            color: ["#d81e06", "#f4ea2a", "#1afa29", "#1296db"],
            geo: {
                map: "yongchuan",
                roam: true,
                zoom: 1.3,
                // itemStyle: {
                //   // 定义样式
                //   normal: {
                //     // 普通状态下的样式
                //     areaColor: "#323c48",
                //     borderColor: "#111",
                //   },
                //   emphasis: {
                //     // 高亮状态下的样式
                //     areaColor: "#2a333d",
                //   },
                // },
                label: {
                    show: true,
                },

                itemStyle: {
                    normal: {
                        borderColor: "rgba(147, 235, 248, 1)",
                        borderWidth: 2,
                        areaColor: {
                            type: "radial",
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: "rgba(175,238,238, 0)", // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: "rgba(   47,79,79, .2)", // 100% 处的颜色
                                },
                            ],
                            globalCoord: false, // 缺省为 false
                        },
                        shadowColor: "rgba(128, 217, 248, 1)",
                        shadowOffsetX: -2,
                        shadowOffsetY: 2,
                        shadowBlur: 10,
                    },
                    emphasis: {
                        areaColor: "#389BB7",
                        borderWidth: 0,
                    },
                },
            },
            //   backgroundColor: "transparent", // 图表背景色
            //模拟数据
            series: [
                {
                    name: "type1",
                    type: "scatter",
                    // symbol: "pin",
                    coordinateSystem: "geo",
                    data: computed.type1,
                    ...scatterProperyt,
                },
                {
                    name: "type2",
                    type: "scatter",
                    // symbol: "pin",
                    coordinateSystem: "geo",
                    data: computed.type2,
                    ...scatterProperyt,
                },
                {
                    name: "type3",
                    type: "scatter",
                    // symbol: "pin",
                    coordinateSystem: "geo",
                    data: computed.type3,
                    ...scatterProperyt,
                },
                {
                    name: "type4",
                    type: "scatter",
                    // symbol: "pin",
                    coordinateSystem: "geo",
                    data: computed.type4,
                    ...scatterProperyt,
                },
            ],
        };
        this.echartsIns.setOption(option);
    }
    //事件绑定器
    bindMakersEventHandler(eventType, target, handler) {
        this.echartsIns.on(eventType, target, handler);
    }
    setOptions(option) {
        this.echartsIns.setOption(option)
    }
}

//高德地图 实例控制对象
export class mapController {
    mapIns = null;//地图实例
    locations = [];//每个 区域内的所有点的完整 经纬度
    AMap = null;
    riskMarkers = [];//地图上 风险源
    riskIcon = '<svg t="1605525573238" class="risk shinning" id="shinning" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11425" width="24" height="32"><path d="M512.036571 950.857143c-70.546286 0-365.714286-276.589714-365.714285-548.571429a365.714286 365.714286 0 0 1 731.428571 0c0 271.981714-295.168 548.571429-365.714286 548.571429z" fill="#d81e06" p-id="11426"></path><path d="M512.036571 1024c-77.604571 0-402.285714-309.796571-402.285714-614.4a402.285714 402.285714 0 1 1 804.571429 0c0 304.603429-324.681143 614.4-402.285715 614.4z m0-950.857143a329.142857 329.142857 0 0 0-329.142857 329.142857c0 229.778286 243.346286 512 329.142857 512 81.225143 0 329.142857-279.954286 329.142858-512a329.142857 329.142857 0 0 0-329.142858-329.142857z m0 438.857143a109.714286 109.714286 0 1 1 109.714286-109.714286 109.714286 109.714286 0 0 1-109.714286 109.714286z" fill="#d81e06" p-id="11427"></path></svg>';
    typeColor = {
        type1: "#d81e06",
        type2: "#f4ea2a",
        type3: "#1afa29",
        type4: "#1296db"
    }
    constructor(AMap) {
        this.AMap = AMap;
    }
    init(mapIns, locations) {
        // this.Amap = window.Amap;
        // console.log( this.Amap);
        // console.log(mapIns, locations);
        this.mapIns = mapIns;
        this.locations = locations;
        this.drawBorder();
    }

    //创建 polygon 绘制 永川区的便捷
    drawBorder() {
        const AMap = this.AMap;
        const locations = this.locations;
        const outer = [
            new AMap.LngLat(-360, 90, true),
            new AMap.LngLat(-360, -90, true),
            new AMap.LngLat(360, -90, true),
            new AMap.LngLat(360, 90, true),
        ];
        const holes = locations[0].borders[0];//显示holes 内的地图

        const pathArray = [
            outer,
            holes
        ];
        // pathArray.push.apply(pathArray, holes);
        // console.log(pathArray);
        //创建 矢量图层
        // const borderLayer = new AMap.VectorLayer();
        // this.mapIns.add(borderLayer);
        // console.log(borderLayer);
        //创建多边形  
        const polygon = new AMap.Polygon({
            path: pathArray,
            strokeColor: "#00eeff",
            strokeWeight: 0,
            fillColor: "#93ebf8",
            fillOpacity: 1
        });
        // borderLayer.add(polygon)
        // console.log(borderLayer);
        polygon.setPath(pathArray);
        this.mapIns.add(polygon);
    }
    //绘制 风险源
    drawRiskSource(riskSource) {
        // console.log(riskSource);
        const AMap = this.AMap;
        const markers = [];
        //先绘制 圆形
        for (let i in riskSource) {
            const { center, radius, riskType, compnayName, companyId } = riskSource[i];
            // console.log(riskType);
            if (radius > 0) {
                const circle = new AMap.Circle({
                    center: center,
                    radius: radius * 1500,//单位 m
                    strokeColor: 'white',
                    strokeWeight: 2,
                    strokeOpacity: 0.5,
                    fillColor: this.typeColor[riskType],
                    fillOpacity: 0.5,
                    zIndex: 10,
                    cursor: 'pointer',
                    extData: {
                        compnayName,
                        companyId
                    }
                })
                // const marker = new AMap.Marker({
                //     position: center,
                // })
                markers.push(circle);
            }
        }
        markers.length > 0 && this.mapIns.add(markers);
        this.riskMarkers = markers;
    }
    //动态 绘制风险
    drawRisk(risks) {
        const AMap = this.AMap;
        const markers = [];
        risks.forEach(item => {
            const { checkpointName, checkpointId, companyId, position } = item;
            const marker = new AMap.Marker({
                position: position,// new AMap.LngLat(risk.lng, risk.lat),
                content: this.riskIcon,
                //   // 以 icon 的 [center bottom] 为原点
                offset: new AMap.Pixel(-12, -32),//设置 偏移 移动到底端
                extData: {//额外的属性 用于 marker 的点击事件
                    name: checkpointName,
                    companyId
                }
            })
            markers.push(marker)
        })
        this.mapIns.add(markers);

    }
    removeRisk() {

    }
    //绑定 marker点击事件
    bindMakersEventHandler(eventType, handler) {
        this.riskMarkers.forEach((maker) => {
            maker.on(eventType, handler);
        })
    }
}