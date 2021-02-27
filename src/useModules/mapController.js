import convexHull from 'useModules/convexHull';
import { computeCenter } from 'useModules/utils';
const companyIcon = require('../assets/img/other/company.png'); //导入 自动转换为 base64

//echart 地图 控制器
export class echartMapController {
    echartsIns = null; //实例
    LevelColors = null;
    preOption = null; // 上衣一个option 用于 恢复上一个 状态
    preState = null; //之前的 状态
    constructor(echartsIns) {
        this.echartsIns = echartsIns;
    }
    init(LevelColors, preState) {
        this.LevelColors = LevelColors;
        this.preState = preState;
        this.drawBorder();
    }
    //绘制边界
    drawBorder() {
        const option = {
            geo: {
                map: 'yc',
                roam: true,
                zoom: 1.3,
                center: [105.896951, 29.256584],
                label: {
                    show: true,
                    textStyle: { color: '#fff' },
                },

                itemStyle: {
                    normal: {
                        borderColor: 'rgba(147, 235, 248, 1)',
                        borderWidth: 2,
                        areaColor: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(175,238,238, 0)', // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(   47,79,79, .2)', // 100% 处的颜色
                                },
                            ],
                            globalCoord: false, // 缺省为 false
                        },
                        shadowColor: 'rgba(128, 217, 248, 1)',
                        shadowOffsetX: -2,
                        shadowOffsetY: 2,
                        shadowBlur: 10,
                    },
                    //高亮状态下的 样式
                    emphasis: {
                        areaColor: '#389BB7',
                        borderWidth: 2,
                    },
                },
            },
        };
        //如果传递了  preState 参数 上一次 收藏的地图状态
        if (this.preState) {
            console.log('preState');
            const { center, zoom } = this.preState;
            option.geo.center = center;
            option.geo.zoom = zoom;
            // console.log(preState);
        }
        this.echartsIns.setOption(option);
    }
    //动态绘制风险
    //DEBUG:绘制有问题  会导致 GUI 占用过高
    drawRisk(risks, isClear = false, curState) {
        console.log('draw in echarts');
        const scatterProperyt = {
            // type: 'scatter',
            type: 'effectScatter',
            //MARK: echarts 的散点图 和底图一起在canvas 里绘制的 无法 使用获取并操作

            coordinateSystem: 'geo',
            encode: {
                value: 2, //指定元素的第三个元素值 作为值 映射
            },
            // label: {
            //     formatter: "<div>555 </div>",
            //     position: "right",
            //     show: true,
            //     backgroundColor: "#2e4639",
            //     color: "#fff",
            //     padding: 10,
            // },
            //   itemStyle: {
            //     color: "purple",
            //   },
            emphasis: {
                label: {
                    show: true,
                },
            },
            label: {
                show: false,
            },
        };
        //数据部分

        const series = [];
        risks.forEach((risk) => {
            const {
                checkpointName,
                checkpointId,
                longitude,
                latitude,
                maxLevel,
            } = risk;
            series.push({
                data: [
                    {
                        checkpointId,
                        name: checkpointName,
                        value: [longitude, latitude, maxLevel],
                    },
                ],
                itemStyle: {
                    color: this.LevelColors[maxLevel],
                },
                symbolSize: 10,
                ...scatterProperyt,
            });
        });

        const option = {
            series,
        };

        // console.log('option', option);
        if (isClear) {
            //清除之前的 其他的隐患数据
            this.echartsIns.clear();
            // console.log(curState);
            this.drawBorder(curState); //保持 地图中心和缩放 比例的不变
        }
        //清除之前的 再 显示
        //新数据不和 旧数据进行合并
        this.echartsIns.setOption(option, {
            notMerge: true,
        });
        this.drawBorder();
        this.preOption = this.echartsIns.getOption();
        console.log(this.preOption);
    }
    //移除 风险 点位
    removeRisk() {}

    //事件绑定器
    bindMakersEventHandler(eventType, target, handler) {
        if (target !== 'echart')
            //监听具体 每个图形的时间
            this.echartsIns.on(eventType, target, handler);
        else {
            //监听 echart 本身
            this.echartsIns.on(eventType, handler);
        }
    }
    setOptions(option) {
        this.echartsIns.setOption(option);
    }
    //设置地图中心
    setCenter(center) {
        this.setOptions({
            geo: {
                center,
            },
            animation: false, //直接移动 不采用动画
        });
    }
    //清除
    clear() {
        //先备份
        this.preOption = this.echartsIns.getOption();
        console.log(this.preOption);
        this.echartsIns.clear();
    }
    //清除 之后恢复 上一次的 option
    restore() {
        console.log(this.preOption);
        this.echartsIns.setOption(this.preOption, {
            notMerge: true,
        });
    }
}

//高德地图 实例控制对象
export class mapController {
    mapIns = null; //地图实例
    locations = []; //每个 区域内的所有点的完整 经纬度
    AMap = null;
    RSMarkers = []; //地图上 风险源/隐患
    riskMarkers = []; //动态的风险makers
    companyMakers = []; //企业 图标
    CPTexts = []; //检查点的 文本标记
    levelColor = [];
    RSLayer = null; //包含风险源的图层
    CPMarkerList = []; //检查点marker 列表
    CompanyLayer = null; //企业区域图层
    CompanyMarkerLayer = null; //企业icon  图层
    LabelsLayer = null; //容纳 所有labelmarker
    CPLayer = null; //checkpoint 图层
    isAllCPDrawed = false; //所有的检查点信息是是否已经 渲染了
    colorTownPolygon = null; //着色街镇 多边形
    constructor(AMap) {
        this.AMap = AMap;
    }
    init(mapIns, locations, LevelColors) {
        this.Amap = window.Amap;
        // console.log( this.Amap);
        // console.log(mapIns, locations);
        this.mapIns = mapIns;
        this.locations = locations;
        this.levelColor = LevelColors;
        this.drawGeneralBorder();
        this.drawTownBorder();
        //创建 图层  容纳所有的 labelMarker
        // this.LabelsLayer = new AMap.LabelsLayer({
        //     // allowCollision : true,
        //     collision: false, //关闭互相避让
        //     zIndex: 6,
        // });
        // this.mapIns.add(this.LabelsLayer);
    }
    //使用checkpointId 返回一个 带有数据的checkpointId
    getRiskIcon(checkpointId, color) {
        return `<svg t="1605525573238" data-checkpointId="${checkpointId}"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11425" width="24" height="32"><path data-checkpointId="${checkpointId}" class="shinning" style="transition: fill 0.5s ease-in-out;" d="M512.036571 950.857143c-70.546286 0-365.714286-276.589714-365.714285-548.571429a365.714286 365.714286 0 0 1 731.428571 0c0 271.981714-295.168 548.571429-365.714286 548.571429z" fill=${color} p-id="11426"></path><path class="shinning" data-checkpointId="${checkpointId}" style="transition: fill 0.5s ease-in-out;" d="M512.036571 1024c-77.604571 0-402.285714-309.796571-402.285714-614.4a402.285714 402.285714 0 1 1 804.571429 0c0 304.603429-324.681143 614.4-402.285715 614.4z m0-950.857143a329.142857 329.142857 0 0 0-329.142857 329.142857c0 229.778286 243.346286 512 329.142857 512 81.225143 0 329.142857-279.954286 329.142858-512a329.142857 329.142857 0 0 0-329.142858-329.142857z m0 438.857143a109.714286 109.714286 0 1 1 109.714286-109.714286 109.714286 109.714286 0 0 1-109.714286 109.714286z" fill=${color} p-id="11427"></path></svg>`;
    }
    //创建 polygon 绘制 永川区的便捷
    drawGeneralBorder() {
        const AMap = this.AMap;
        const locations = this.locations;
        const outer = [
            new AMap.LngLat(-360, 90, true),
            new AMap.LngLat(-360, -90, true),
            new AMap.LngLat(360, -90, true),
            new AMap.LngLat(360, 90, true),
        ];
        const holes = locations[0].borders[0]; //显示holes 内的地图

        const pathArray = [outer, holes];
        // pathArray.push.apply(pathArray, holes);
        // console.log(pathArray);
        //创建 矢量图层
        // const borderLayer = new AMap.VectorLayer();
        // this.mapIns.add(borderLayer);
        // console.log(borderLayer);
        //创建多边形
        const polygon = new AMap.Polygon({
            path: pathArray,
            strokeColor: '#00eeff',
            strokeWeight: 1,
            // fillColor: "#93ebf8",
            fillColor: '#06090e',
            fillOpacity: 1,

        });
        // borderLayer.add(polygon)
        // console.log(borderLayer);
        // polygon.setPath(pathArray);
        this.mapIns.add(polygon);
    }
    //绘制乡镇的 轮廓
    drawTownBorder() {
        const AMap = this.AMap;
        const len = this.locations.length;
        const borderLayer = new AMap.VectorLayer({
            zIndex: 10, //index 最大
        });
        // console.log(polygonLayer.add);
        this.mapIns.add(borderLayer);
        const locations = this.locations;
        const polylines = [];

        for (let i = 1; i < len; i++) {
            // console.log(locations[i]);
            //一段一段的 绘制边界
            locations[i].borders.forEach((path) => {
                //创建折线
                const polyline = new AMap.Polyline({
                    strokeWeight: 1,
                    path,
                    fillColor: 'transparent',
                    // fillOpacity: 0.2,
                    strokeColor: 'black', //#0000ff
                    extData: { towner: locations[i].towner },
                });
                polylines.push(polyline);
            });
            // const polyline = new AMap.Polyline({
            //     strokeWeight: 1,
            //     path: locations[i].bounds,
            //     fillColor: 'transparent',
            //     // fillOpacity: 0.2,
            //     strokeColor: 'black',//#0000ff
            //     extData: { towner: locations[i].towner }
            // });
            // polylines.push(polyline)
        }
        // console.log(polygonLayer.add);
        borderLayer.add(polylines);
    }
    //着色某个街镇
    colorTown(town) {
        // console.log(town);
        // console.log(this.locations);
        const borders = this.locations.find((item) => item.towner === town)
            .borders;
        console.log(borders);
        const polygon = new AMap.Polygon({
            path: borders,
            
            cursor:"pointer",
            fillColor: '#f6c3c3',
            fillOpacity: 0.3,
            zIndex: 4,
        });
        this.colorTownPolygon = polygon;
        this.mapIns.add(polygon);
        console.log(polygon);
    }
    //移除之前的 着色
    cancelColorTown() {
        if (!this.colorTownPolygon) return;
        this.mapIns.remove(this.colorTownPolygon);
        this.colorTownPolygon = null;
    }
    //凸包算法绘制 单个企业外轮廓
    drawCompanyArea(
        { checkPointBOList: checkPoints, center, companyName },
        isClear = false
    ) {
        // console.log(checkPoints);
        const AMap = this.AMap;
        if (!this.CompanyLayer) {
            const CompanyLayer = new AMap.VectorLayer({
                zIndex: 5, //index 大于卫星图：4
            });
            this.CompanyLayer = CompanyLayer;
            this.mapIns.add(this.CompanyLayer);
        }
        //判断是否要清除之前的图层 和企业图标
        if (isClear) {
            this.removeAllRisk(); //移除
            const CompanyLayer = new AMap.VectorLayer({
                zIndex: 5, //index 大于卫星图：4
            });
            //清除 多边形图层
            if (this.CompanyLayer) {
                this.mapIns.removeLayer(this.CompanyLayer); //移除之前的图层
                this.CompanyLayer = CompanyLayer;
                this.mapIns.add(this.CompanyLayer);
            }
            //清除之前的 图标
            if (this.companyMakers.length > 0) {
                this.mapIns.remove(this.companyMakers);
                this.mapIns.companyMakers = [];
            }
        }
        const marker = new AMap.Marker({
            icon: companyIcon, // 自定义点标记
            position: new AMap.LngLat(...center), // 基点位置
            offset: new AMap.Pixel(0, 0), // 设置点标记偏移量
            anchor: 'center', // 设置锚点方位
            title: companyName,
            extData: {
                companyName,
            },
            zIndex: 3,
        });
        this.mapIns.add(marker);
        this.companyMakers.push(marker);
        let slider = [];
        if (checkPoints.length === 2) {
            //检查点 个数为2 添加 中心点加入 绘制
            const center = computeCenter(checkPoints);
            slider = convexHull([
                ...checkPoints,
                new AMap.LngLat(center.positionX, center.positionX),
            ]); //计算凸包
        } else slider = convexHull(checkPoints); //计算凸包
        // console.log(slider);
        //创建多边形
        const polygon = new AMap.Polygon({
            path: slider,
            strokeColor: '#009900',
            strokeWeight: 1,
            // fillColor: "#93ebf8",
            fillColor: '#06090e',
            fillOpacity: 0,
        });
        // borderLayer.add(polygon)
        // console.log(borderLayer);
        this.CompanyLayer.add(polygon);
    }
    drawCompanyArea1(
        { checkPointBOList: checkPoints, center, companyName },
        isClear = false
    ) {
        // console.log(checkPoints);
        const AMap = this.AMap;
        if (!this.CompanyLayer) {
            this.CompanyLayer = new AMap.VectorLayer({
                zIndex: 5, //index 大于卫星图：4
            });
            this.mapIns.add(this.CompanyLayer);
        }
        //判断是否要清除之前的图层 和企业图标
        if (isClear) {
            this.removeAllRisk(); //移除
            const CompanyLayer = new AMap.VectorLayer({
                zIndex: 5, //index 大于卫星图：4
            });
            this.CompanyLayer = CompanyLayer;
            this.mapIns.add(this.CompanyLayer);
            //清除之前的 图标
            if (this.companyMakers.length > 0) {
                this.mapIns.remove(this.companyMakers);
                this.mapIns.companyMakers = [];
            }
        }
        const marker = new AMap.LabelMarker({
            // title: checkPointName,
            icon: {
                image:
                    'https://cdn.jsdelivr.net/gh/Galileo01/imgCloud@master/company.png',
                anchor: 'bottom-center',
                size: [20, 20],
                // clipOrigin: [459, 92],
                // clipSize: [50, 68]
            },
            position: center,
            extData: {
                companyName,
            },
        });
        this.companyMakers.push(marker);
        this.LabelsLayer.add(marker);

        let slider = [];
        if (checkPoints.length === 2) {
            //检查点 个数为2 添加 中心点加入 绘制
            const center = computeCenter(checkPoints);
            slider = convexHull([
                ...checkPoints,
                new AMap.LngLat(center.positionX, center.positionX),
            ]); //计算凸包
        } else slider = convexHull(checkPoints); //计算凸包
        // console.log(slider);
        //创建多边形
        const polygon = new AMap.Polygon({
            path: slider,
            strokeColor: '#009900',
            strokeWeight: 1,
            // fillColor: "#93ebf8",
            fillColor: '#06090e',
            fillOpacity: 0,
        });
        // borderLayer.add(polygon)
        // console.log(borderLayer);
        this.CompanyLayer.add(polygon);
    }
    //绘制检查点
    drawCheckPoints(checkPoints, isClear = false) {
        // this.removeAllRisk();
        // console.log(risks);
        // console.log(riskSource);
        const AMap = this.AMap;

        //清除之前的检查点图层
        if (isClear || !this.CPLayer) {
            //存在就移除
            this.mapIns.removeLayer(this.CPLayer); //移除之前的图层
            this.CPLayer == null;
            //清除 之前的文本标记
            if (this.CPTexts.length > 0) {
                this.mapIns.remove(this.CPTexts);
                this.CPTexts = [];
            }
            const CPLayer = new AMap.VectorLayer({
                zIndex: 5, //index 大于卫星图：4
            });
            this.CPLayer = CPLayer;
            this.mapIns.add(CPLayer);
        }
        const markers = [];
        const texts = [];
        //先绘制 圆形getRiskIcon
        for (let i in checkPoints) {
            const {
                compnayName,
                companyId,
                positionX,
                positionY,
                checkPointName,
                checkPointId,
            } = checkPoints[i];
            // console.log(riskType);
            if (positionY < 100) {
                //后台数据有问题

                // 使用 矢量 图形 CircleMarker不会 改变大小
                const circle = new AMap.CircleMarker({
                    center: new AMap.LngLat(positionX, positionY),
                    radius: 12, //单位 px
                    strokeColor: 'white',
                    strokeWeight: 2,
                    strokeOpacity: 0.5,
                    fillColor: '#884898', //检查点使用紫色
                    // fillColor:'red',
                    fillOpacity: 1,
                    zIndex: 10,
                    cursor: 'pointer',
                    extData: {
                        checkPointId,
                    },
                });
                //文本标记
                const text = new AMap.Text({
                    text: checkPointName,
                    anchor: 'bottom-left', // 设置文本标记锚点
                    cursor: 'pointer',
                    zIndex: 10,
                    style: {
                        padding: '2px',
                        // 'margin-bottom': '1rem',
                        'border-radius': '.25rem',
                        'background-color': 'white',
                        'border-width': 0,
                        // 'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                        'text-align': 'center',
                        'font-size': '12px',
                        color: 'black',
                    },
                    position: [positionX, positionY],
                    extData: {
                        checkPointId,
                    },
                });
                texts.push(text);
                // const marker = new AMap.Marker({
                //     position: center,
                // })
                markers.push(circle);
            }
        }
        this.CPLayer.add(markers);
        this.CPMarkerList = markers;
        this.mapIns.add(texts);
        this.CPTexts.push(...texts);
        // console.log(markers);
    }
    drawCheckPoints1(checkPoints, isClear = false) {
        // this.removeAllRisk();
        // console.log(risks);
        // console.log(riskSource);
        const AMap = this.AMap;

        //清除之前的检查点图层
        if (isClear || !this.CPLayer) {
            //存在就移除
            this.mapIns.removeLayer(this.CPLayer); //移除之前的图层
            this.CPLayer == null;
            //清除 之前的文本标记
            if (this.CPTexts.length > 0) {
                this.mapIns.remove(this.CPTexts);
                this.CPTexts = [];
            }
            const CPLayer = new AMap.LabelsLayer({
                // allowCollision : true,
                collision: false,
                zIndex: 6,
            });
            this.CPLayer = CPLayer;
            this.mapIns.add(CPLayer);
        }
        const markers = [];
        const texts = [];
        //先绘制 圆形getRiskIcon
        for (let i in checkPoints) {
            const {
                compnayName,
                companyId,
                positionX,
                positionY,
                checkPointName,
                checkPointId,
            } = checkPoints[i];
            // console.log(riskType);
            if (positionY < 100) {
                //后台数据有问题

                // // 使用 矢量 图形 CircleMarker不会 改变大小
                // const circle = new AMap.CircleMarker({
                //     center: new AMap.LngLat(positionX, positionY),
                //     radius: 12, //单位 px
                //     strokeColor: 'white',
                //     strokeWeight: 2,
                //     strokeOpacity: 0.5,
                //     fillColor: '#884898', //检查点使用紫色
                //     // fillColor:'red',
                //     fillOpacity: 1,
                //     zIndex: 10,
                //     cursor: 'pointer',
                //     extData: {
                //         checkPointId,
                //     },
                // });
                const marker = new AMap.LabelMarker({
                    // title: checkPointName,
                    zIndex: 2,
                    icon: {
                        image:
                            'https://cdn.jsdelivr.net/gh/Galileo01/imgCloud@master/checkpoint1.png',
                        anchor: 'bottom-center',
                        size: [20, 20],
                        // clipOrigin: [459, 92],
                        // clipSize: [50, 68]
                    },
                    position: [positionX, positionY],
                    extData: {
                        checkPointId,
                    },
                    text: {
                        content: checkPointName,
                        direction: 'right',
                        style: {
                            color: 'black',
                            backgroundColor: '#fff',
                        },
                    },
                });
                //文本标记
                // const text = new AMap.Text({
                //     text: checkPointName,
                //     anchor: 'bottom-left', // 设置文本标记锚点
                //     cursor: 'pointer',
                //     zIndex: 10,
                //     style: {
                //         padding: '2px',
                //         // 'margin-bottom': '1rem',
                //         'border-radius': '.25rem',
                //         'background-color': 'white',
                //         'border-width': 0,
                //         // 'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                //         'text-align': 'center',
                //         'font-size': '12px',
                //         color: 'black',
                //     },
                //     position: [positionX, positionY],
                //     extData: {
                //         checkPointId,
                //     },
                // });
                // texts.push(text);
                // const marker = new AMap.Marker({
                //     position: center,
                // })
                markers.push(marker);
            }
        }
        this.LabelsLayer.add(markers);
        this.CPMarkerList = markers;
        // this.mapIns.add(texts);
        // this.CPTexts.push(...texts);
        console.log(markers);
    }
    //展示所有检查点
    showAllCheckPoints() {
        this.CPLayer.show();
        this.CPTexts.forEach((item) => {
            item.show();
        });
    }
    //隐藏 当前所有的检查点
    hideAllCheckPoints() {
        this.CPLayer.hide();
        this.CPTexts.forEach((item) => {
            item.hide();
        });
    }
    //移除 所有的检查点
    removeAllCheckPoints() {
        if (this.CPLayer) {
            this.mapIns.remove(this.CPLayer); //移除 检查点 marker
            this.mapIns.remove(this.CPTexts); //移除  文字标注
            this.CPLayer = null;
        }
    }
    //绘制 动态产生的 风险
    //修改 ：TODO:
    drawRisk(risks, isClear = false) {
        console.log('risks', risks);
        const AMap = this.AMap;
        const markers = [];
        this.removeAllRisk();
        risks.forEach((risk, index) => {
            const {
                checkPointName,
                checkPointId,
                longitude,
                latitude,
                maxLevel,
            } = risk;
            const marker = new AMap.Marker({
                // title: checkPointName,
                position: new AMap.LngLat(longitude, latitude),
                content: this.getRiskIcon(
                    checkPointId,
                    this.levelColor[maxLevel]
                ), //根据等级创建icon
                //   // 以 icon 的 [center bottom] 为原点
                offset: new AMap.Pixel(-12, -32), //设置 偏移 移动到底端
                extData: {
                    //额外的属性 用于 marker 的点击事件
                    checkPointName: checkPointName,
                    checkpointId: checkPointId,
                    riskIndex: index,
                },
            });
            markers.push(marker);
        });
        this.mapIns.add(markers);
        this.riskMarkers.push(...markers); //追加到
    }
    drawRisk1(risks, isClear = false) {
        console.log('risks', risks);
        const AMap = this.AMap;
        const markers = [];
        this.removeAllRisk();

        const icon = {
            level0:
                'https://cdn.jsdelivr.net/gh/Galileo01/imgCloud@master/l0.png',
            level1:
                'https://cdn.jsdelivr.net/gh/Galileo01/imgCloud@master/l1.png',
            level2:
                'https://cdn.jsdelivr.net/gh/Galileo01/imgCloud@master/l2.png',
            level3:
                'https://cdn.jsdelivr.net/gh/Galileo01/imgCloud@master/l3.png',
        };

        risks.forEach((risk, index) => {
            const {
                checkPointName,
                checkPointId,
                longitude,
                latitude,
                maxLevel,
            } = risk;
            const marker = new AMap.LabelMarker({
                // title: checkPointName,
                zIndex: 2,
                icon: {
                    image: icon['level' + maxLevel],
                    anchor: 'bottom-center',
                    size: [25, 30],
                    // clipOrigin: [459, 92],
                    // clipSize: [50, 68]
                },
                position: [longitude, latitude],
                extData: {
                    //额外的属性 用于 marker 的点击事件
                    checkPointName: checkPointName,
                    checkpointId: checkPointId,
                    riskIndex: index,
                },
            });
            markers.push(marker);
            console.log(marker);
        });
        console.log(markers);
        this.LabelsLayer.add(markers);
    }
    //在地图上绘制 终点关注企业
    drawFocusedCompany(companyList) {
        this.hideAllRisk();
        console.log(companyList);
        // console.log(riskSource);
        const AMap = this.AMap;
        const RSLayer = new AMap.VectorLayer({
            zIndex: 5, //index 大于卫星图：4
        });
        //创建新的cicle 并 替换 原来的图层
        this.mapIns.removeLayer(this.RSLayer); //移除之前的图层
        this.RSLayer = RSLayer;
        this.mapIns.add(RSLayer);
        const markers = [];
        //先绘制 圆形
        for (let i in companyList) {
            const {
                center,
                radius,
                riskType,
                compnayName,
                companyId,
            } = companyList[i];
            // console.log(riskType);
            if (radius > 0) {
                const circle = new AMap.Circle({
                    center: center,
                    radius: radius * 1500, //单位 m
                    strokeColor: 'white',
                    strokeWeight: 2,
                    strokeOpacity: 0.5,
                    fillColor: this.levelColor[riskType],
                    // fillColor:'red',
                    fillOpacity: 1,
                    zIndex: 10,
                    cursor: 'pointer',
                    extData: {
                        compnayName,
                        companyId,
                    },
                });
                // const marker = new AMap.Marker({
                //     position: center,
                // })
                markers.push(circle);
            }
        }
        markers.length > 0 && RSLayer.add(markers);
        // this.RSMarkers = markers;
        // console.log(this.RSMarkers);
    }
    //移除动态的 风险
    //REMOVE:
    removeSolvedRisk(solved) {
        console.log(this.riskMarkers);
        solved.forEach((item) => {
            //DEBUG:相等却不返回
            // const index = this.riskMarkers.findIndex((maker) => {
            //     const { companyId } = maker.getExtData();
            //     console.log(companyId === item.companyId);
            //     return companyId === item.companyId;
            // }
            // );
            const index = this.riskMarkers.findIndex(
                (marker) => marker.getExtData().companyId === item.companyId
            );
            console.log(index);
            this.riskMarkers[index].remove(); //移除自身
            this.riskMarkers.splice(index, 1); //从列表中移除
        });
    }
    //移除所有的 隐患点位
    removeAllRisk() {
        this.mapIns.remove(this.riskMarkers);
        this.riskMarkers = [];
    }
    //隐藏地图上所有的 动态隐患
    hideAllRisk() {
        this.riskMarkers.forEach((marker) => {
            marker.hide(); //移除
        });
    }
    showAllRisk() {
        this.riskMarkers.forEach((marker) => {
            marker.show(); //移除
        });
    }
    //绑定  风险 marker点击事件
    bindRMakersEventHandler(eventType, handler) {
        this.riskMarkers.forEach((maker) => {
            maker.on(eventType, handler);
        });
    }
    //清除 makers 上的事件
    removeMakersEventHandler(eventType) {
        this.riskMarkers.forEach((maker) => {
            maker.clearEvents(eventType);
        });
    }
    //绑定 检查点
    bindPMakersEventHandler(eventType, handler) {
        this.CPMarkerList.forEach((maker) => {
            const { checkPointId } = maker.getExtData();
            // console.log(checkPointId,maker.getExtData());
            maker.on(eventType, handler(checkPointId));
            // console.log('bind');
        });
        this.CPTexts.forEach((maker) => {
            const { checkPointId } = maker.getExtData();
            // console.log(checkPointId,maker.getExtData());
            maker.on(eventType, handler(checkPointId));
            // console.log('bind');
        });
    }
    //地图绑定事件
    bindMapEventHandler(eventType, handler) {
        this.mapIns.on(eventType, handler);
    }
    //设置中心
    setCenter(position, immediately = false) {
        const AMap = this.AMap;
        if (!position instanceof AMap.LngLat) {
            //传入的 坐标不是AMap.LngLat 类对象
            position = new AMap.LngLat(position[0], position[1]);
            console.log('实例化');
        }
        if (!immediately) this.mapIns.setCenter(position, immediately, 10);
        else this.mapIns.setCenter(position, immediately);
    }
}
