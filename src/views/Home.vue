<template>
  <div class="home">
    <a-spin
      :spinning="spinning"
      size="large"
    >
      <a-row
        type="flex"
        justify="space-between"
        class="wapper"
      >
        <a-col :span="4">左侧</a-col>
        <a-col :span="16">
          <div
            id="chart"
            v-show="mapType==='echarts'"
            class="map_container"
          >
          </div>
          <div
            id="gaodemap"
            v-show="mapType==='map'"
            class="map_container"
          >
          </div>
          <div class="type_box">
            <div class="type">
              <div class="color type1"></div>
              type1
            </div>
            <div class="type">
              <div class="color type2"></div>
              type2
            </div>
            <div class="type">
              <div class="color type3"></div>
              type3
            </div>
            <div class="type">
              <div class="color type4"></div>
              type4
            </div>
          </div>
          <div class="tool-bar">
            <a-button
              type=""
              size="small"
              @click="switchMapType"
              :disabled="mapType==='echarts'"
            >聚合</a-button>
            <a-button
              type=""
              size="small"
              :disabled="mapType==='map'"
              @click="switchMapType"
            >详细</a-button>
          </div>
        </a-col>
        <a-col :span="2">右侧</a-col>
      </a-row>
    </a-spin>

    <a-drawer
      title="Basic Drawer"
      placement="right"
      :mask="false"
      :visible="drawerVisible"
      :after-visible-change="afterVisibleChange"
      @close="closeDrawer"
      width="22vw"
    >
      <a-row>
        <a-col :span="8">检查点名称 </a-col>
        <a-col :span="16">{{drawerContent.name}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">检查点经纬度 </a-col>
        <a-col :span="16">{{drawerContent.position}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">检查点ID </a-col>
        <a-col :span="16">{{drawerContent.checkpointId}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">RFID </a-col>
        <a-col :span="16">{{drawerContent.RFID}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">所属区域 </a-col>
        <a-col :span="16">{{drawerContent.areaName}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">所属企业 </a-col>
        <a-col :span="16">{{drawerContent.companyName}}</a-col>
      </a-row>
    </a-drawer>
  </div>
</template>

<script>
import echarts from "echarts";
const yongchaunJson = require("../assets/map/yongchuan.json"); //导入永川区 地图json并转换为对象
const chinaJson = require("../assets/map/china.json");
const cqJson = require("../assets/map/chongqing.json");
// console.log(scatterData);
import { getYongchuanBoundary, GetLocations } from "network/map";
import { drawDistrictBorder, mapController } from "useModule/useMap";
import { echartMapController } from "useModule/useEchartsMap";
import { getCheckPoints } from "network/tempData.js";
export default {
  // name: "Home",
  data() {
    return {
      mapType: "echarts",
      spinning: true,
      chart: null, //echarts 实例
      emController: null, //echarts map控制器
      amap: null, //高德地图 实例
      mapController: null, //高德地图控制器
      mapCenter: [],
      //抽屉弹框
      drawerVisible: false,
      drawerContent: {
        name: "",
        position: [],
        //模拟数据 写死
        checkpointId: 1273281863665983488,
        RFID: "A01E3560",
        areaName: "矿山区域",
        companyName: "渝琥石英砂有限公司",
      },
      data: {
        checkPoints: [],
      },
    };
  },
  methods: {
    getData() {
      this.data.checkPoints = getCheckPoints();
    },
    switchMapType() {
      this.closeDrawer();
      this.mapType = this.mapType === "map" ? "echarts" : "map";
    },
    //初始化 并渲染地图
    echartsInit() {
      this.chart = echarts.init(document.querySelector("#chart"));
      //注册地图
      echarts.registerMap("cq", cqJson);
      echarts.registerMap("china", chinaJson);
      echarts.registerMap("yongchuan", yongchaunJson);
      this.emController = new echartMapController(this.chart);
      this.emController.init(this.data.checkPoints);
      this.echartsBindEventHandler();
    },
    // echarts 绑定点击事件
    echartsBindEventHandler() {
      this.emController.bindMakersEventHandler("click", "geo", (params) => {
        console.log(params);
        const { name } = params;
      });
      this.emController.bindMakersEventHandler(
        "click",
        "series.scatter",
        (params) => {
          console.log("click in scatter", params);
          const { name, value } = params;
          this.drawerContent.name = name;
          this.drawerContent.position = value;
          this.drawerVisible = true;
          console.log(params);
        }
      );
    },
    //绑定 高德地图上 markers 的点击事件
    bindMakersEventHandler() {
      const AMap = window.AMap;
      //高德地图 部分
      //绑定 点击事件，弹出右侧 抽屉
      this.mapController.bindMakersEventHandler("click", (e) => {
        // console.log(e, this);
        const { name, index } = e.target.getExtData();
        const position = e.target.getPosition();
        // console.log(name, index, position);
        this.drawerContent.name = name;
        this.drawerContent.position = position;
        this.drawerVisible = true;
      });

      //绑定 mouseover 事件，显示信息窗口
      this.mapController.bindMakersEventHandler("mouseover", (e) => {
        const { name, index } = e.target.getExtData();
        const position = e.target.getPosition();
        // console.log(name, index, position);
        //创建信息 窗体
        const infoWindow = new AMap.InfoWindow({
          content: `
          <div class="info_window">
          <p>${name}</p>
           <p>${position}</p>
          </div>
          `, //传入 dom 对象，或者 html 字符串
          anchor: "middle-left",
        });
        infoWindow.open(this.amap, position);
      });
      //鼠标离开 关闭信息
      this.mapController.bindMakersEventHandler("mouseout", (e) => {
        this.amap.clearInfoWindow(); //清除 信息窗体
      });
    },

    // 通过Vue 实例代理
    setOption(option) {
      this.chart.setOption(option);
    },
    closeDrawer() {
      this.drawerVisible = false;
    },
    afterVisibleChange() {},
    //高德地图初始化
    mapInit() {
      const AMap = window.AMap;
      this.amap = new AMap.Map("gaodemap", {
        zoom: 10.4,
        center: [105.896951, 29.256584],
        pitch: 0,
        // viewMode: "3D",
        //设置地图背景图
        // mapStyle: "amap://styles/40035571fa9fdd05a26fe1b05f48fdc9",
        plugins: [
          "AMap.Scale",
          "AMap.OverView",
          "AMap.MapType",
          "AMap.Geolocation",
        ],
      });

      AMap.plugin(["AMap.Scale", "AMap.HawkEye", "AMap.Geolocation"], () => {
        const scale = new AMap.Scale();
        // const HawkEye = new AMap.HawkEye();
        // const MapType = new AMap.MapType();
        // const Geolocation = new AMap.Geolocation();
        // this.amap.addControl(toolbar);
        this.amap.addControl(scale);
        // this.amap.addControl(HawkEye);
        // this.amap.addControl(MapType);
        // this.amap.addControl(Geolocation);
      });
      //土块加载完成
      this.amap.on("complete", () => {
        this.spinning = false;
      });
      const locations = GetLocations();

      // console.log(this.data.checkPoints);
      this.mapController = new mapController(AMap); //创建 高德地图的控制器
      this.mapController.init(this.amap, locations, this.data.checkPoints);
      this.bindMakersEventHandler();
    },
  },
  created() {
    this.getData();
  },
  mounted() {
    this.echartsInit();
    // this.echartsBindEventHandler();
    //等页面 加载文笔，指的是  高德地图的script脚本
    document.addEventListener("DOMContentLoaded", () => {
      this.mapInit();
    });
  },
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  // background:url(../assets/img/bg.jpg);
  /deep/.ant-spin-container {
    height: 100vh; //spin 组件默认称其 整屏
  }
  .wapper {
    height: 100%;
  }
  .map_container {
    height: calc(100% - 40px);
    margin: 0 auto;
    background-color: #eeeeee;
  }
  .tool-bar {
    // border: 1px solid red;
    height: 30px;
    display: flex;
    align-items: center;
    .anticon {
      cursor: pointer;
    }
  }
  .type_box {
    width: 100px;
    padding: 8px;
    font-size: 12px;
    line-height: 1.5;
    font-weight: 300;
    color: #111213;
    background-color: #fff;
    border-radius: 0.4rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
    position: absolute;
    top: 5px;
    right: 5px;
    .type:last-of-type {
      margin-bottom: 0px; //最后一个 取消 下边界
    }
    .type {
      margin-bottom: 5px;
      display: flex;
      justify-content: space-around;

      .color {
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }
      .type1 {
        background-color: #d81e06;
      }
      .type2 {
        background-color: #f4ea2a;
      }
      .type3 {
        background-color: #1afa29;
      }
      .type4 {
        background-color: #1296db;
      }
    }
  }
}
</style>