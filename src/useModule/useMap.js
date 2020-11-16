//绘制永川区 的单独轮廓
import { GetLocations, getYongchuanBoundary } from 'network/map'

export class mapController {
    mapIns = null;//地图实例
    locations = [];//每个 区域内的所有点的完整 经纬度
    AMap = null;
    checkmarkers = [];//地图上 checkPoints
    checkPointIcon = {
        type1: '<svg t="1605525573238" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11425" width="24" height="32"><path d="M512.036571 950.857143c-70.546286 0-365.714286-276.589714-365.714285-548.571429a365.714286 365.714286 0 0 1 731.428571 0c0 271.981714-295.168 548.571429-365.714286 548.571429z" fill="#d81e06" p-id="11426"></path><path d="M512.036571 1024c-77.604571 0-402.285714-309.796571-402.285714-614.4a402.285714 402.285714 0 1 1 804.571429 0c0 304.603429-324.681143 614.4-402.285715 614.4z m0-950.857143a329.142857 329.142857 0 0 0-329.142857 329.142857c0 229.778286 243.346286 512 329.142857 512 81.225143 0 329.142857-279.954286 329.142858-512a329.142857 329.142857 0 0 0-329.142858-329.142857z m0 438.857143a109.714286 109.714286 0 1 1 109.714286-109.714286 109.714286 109.714286 0 0 1-109.714286 109.714286z" fill="#d81e06" p-id="11427"></path></svg>'
        , type2: '<svg t="1605525573238" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11425" width="24" height="32"><path d="M512.036571 950.857143c-70.546286 0-365.714286-276.589714-365.714285-548.571429a365.714286 365.714286 0 0 1 731.428571 0c0 271.981714-295.168 548.571429-365.714286 548.571429z" fill="#f4ea2a" p-id="11426"></path><path d="M512.036571 1024c-77.604571 0-402.285714-309.796571-402.285714-614.4a402.285714 402.285714 0 1 1 804.571429 0c0 304.603429-324.681143 614.4-402.285715 614.4z m0-950.857143a329.142857 329.142857 0 0 0-329.142857 329.142857c0 229.778286 243.346286 512 329.142857 512 81.225143 0 329.142857-279.954286 329.142858-512a329.142857 329.142857 0 0 0-329.142858-329.142857z m0 438.857143a109.714286 109.714286 0 1 1 109.714286-109.714286 109.714286 109.714286 0 0 1-109.714286 109.714286z" fill="#f4ea2a" p-id="11427"></path></svg>'
        , type3: '<svg t="1605525573238" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11425" width="24" height="32"><path d="M512.036571 950.857143c-70.546286 0-365.714286-276.589714-365.714285-548.571429a365.714286 365.714286 0 0 1 731.428571 0c0 271.981714-295.168 548.571429-365.714286 548.571429z" fill="#1afa29" p-id="11426"></path><path d="M512.036571 1024c-77.604571 0-402.285714-309.796571-402.285714-614.4a402.285714 402.285714 0 1 1 804.571429 0c0 304.603429-324.681143 614.4-402.285715 614.4z m0-950.857143a329.142857 329.142857 0 0 0-329.142857 329.142857c0 229.778286 243.346286 512 329.142857 512 81.225143 0 329.142857-279.954286 329.142858-512a329.142857 329.142857 0 0 0-329.142858-329.142857z m0 438.857143a109.714286 109.714286 0 1 1 109.714286-109.714286 109.714286 109.714286 0 0 1-109.714286 109.714286z" fill="#1afa29" p-id="11427"></path></svg>'
        , type4: '<svg t="1605525573238" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11425" width="24" height="32"><path d="M512.036571 950.857143c-70.546286 0-365.714286-276.589714-365.714285-548.571429a365.714286 365.714286 0 0 1 731.428571 0c0 271.981714-295.168 548.571429-365.714286 548.571429z" fill="#1296db" p-id="11426"></path><path d="M512.036571 1024c-77.604571 0-402.285714-309.796571-402.285714-614.4a402.285714 402.285714 0 1 1 804.571429 0c0 304.603429-324.681143 614.4-402.285715 614.4z m0-950.857143a329.142857 329.142857 0 0 0-329.142857 329.142857c0 229.778286 243.346286 512 329.142857 512 81.225143 0 329.142857-279.954286 329.142858-512a329.142857 329.142857 0 0 0-329.142858-329.142857z m0 438.857143a109.714286 109.714286 0 1 1 109.714286-109.714286 109.714286 109.714286 0 0 1-109.714286 109.714286z" fill="#1296db" p-id="11427"></path></svg>'
    };
    constructor(AMap) {
        this.AMap = AMap;
    }
    init(mapIns, locations, checkPoints) {
        // this.Amap = window.Amap;
        // console.log( this.Amap);
        // console.log(mapIns, locations);
        this.mapIns = mapIns;
        this.locations = locations;
        this.drawBorder();
        this.drawCheckPoint(checkPoints);
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
            fillColor: "#eeeeee",
            fillOpacity: 1
        });
        // borderLayer.add(polygon)
        // console.log(borderLayer);
        polygon.setPath(pathArray);
        this.mapIns.add(polygon);
    }
    //绘制检查点
    drawCheckPoint(checkPoints) {
        const AMap = this.AMap;
        var icon = new AMap.Icon({
            size: new AMap.Size(20, 32),    // 图标尺寸
            image: '//webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png',  // Icon的图像
            // imageOffset: new AMap.Pixel(0, -60),  // 图像相对展示区域的偏移量，适于雪碧图等
            imageSize: new AMap.Size(40, 50)   // 根据所设置的大小拉伸或压缩图片
        });
        // console.log(icon);
        const markers = [];

        for (let type in checkPoints) {

            checkPoints[type].forEach((p, index) => {
                // console.log(type);
                const marker = new AMap.Marker({
                    position: [p.value[0], p.value[1]],// new AMap.LngLat(risk.lng, risk.lat),
                    content: this.checkPointIcon['type' + type],
                    //   // 以 icon 的 [center bottom] 为原点
                    offset: new AMap.Pixel(-12, -32),//设置 偏移 移动到底端
                    extData: {//额外的属性 用于 marker 的点击事件
                        name: p.name,
                        index
                    }
                })

                markers.push(marker);
            })
        }
        // console.log(markers);
        this.mapIns.add(markers);
        this.checkmarkers = markers;
    }
    //绑定 marker点击事件
    bindMakersEventHandler(eventType,handler) {
        this.checkmarkers.forEach((maker) => {
            maker.on(eventType, handler);
        })
    }
}