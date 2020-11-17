
export class echartMapController {
    echartsIns = null;//实例
    constructor(echartsIns) {
        this.echartsIns = echartsIns;
    }
    init(checkPoints) {
        this.drawCheckPoints(checkPoints);
    }
    //绘制检查点
    drawCheckPoints(checkPoints) {
        //公共是属性 的抽取
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
                    symbol: "pin",
                    coordinateSystem: "geo",
                    data: checkPoints[1],
                    ...scatterProperyt,
                },
                {
                    name: "type2",
                    type: "scatter",
                    symbol: "pin",
                    coordinateSystem: "geo",
                    data: checkPoints[2],
                    ...scatterProperyt,
                },
                {
                    name: "type3",
                    type: "scatter",
                    symbol: "pin",
                    coordinateSystem: "geo",
                    data: checkPoints[3],
                    ...scatterProperyt,
                },
                {
                    name: "type4",
                    type: "scatter",
                    symbol: "pin",
                    coordinateSystem: "geo",
                    data: checkPoints[4],
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
    setOptions(option){
        this.echartsIns.setOption(option)
    }
}