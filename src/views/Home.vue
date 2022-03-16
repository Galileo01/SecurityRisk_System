<template>
  <div class="home">
    <a-layout>
      <a-layout-header>
        <div class="header_wapper">
          <div class="left">
            <a-button size="small">实时检测</a-button>
            <a-button size="small">统计分析1</a-button>
            <a-button size="small">统计分析2</a-button>
          </div>
          <p class="header">安全风险源动态管理系统</p>
          <div class="right">
            <a-button size="small">统计分析3</a-button>
            <a-button size="small">统计分析4</a-button>
            <a-button size="small">统计分析5</a-button>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content>
        <a-spin
          :spinning="spinning"
          size="large"
        >
          <a-row
            type="flex"
            justify="space-between"
            class="wapper"
          >
            <a-col
              :span="7"
              class="left_side"
            >
              <section
                class="weather"
                v-if="weatherData"
              >
                <div class="baseinfo">
                  <div class="tem_wapper">
                    <span class="tem">
                      {{weatherData.tem}}
                    </span>
                    ℃
                  </div>
                  <div class="right">
                    <p><span>{{weatherData.wea}}</span></p>
                    <p><span>{{weatherData.tem1}}-{{weatherData.tem2}}</span>℃</p>
                  </div>
                </div>
                <div class="other">
                  <div>风向<span>{{weatherData.win}}{{weatherData.win_speed}}</span></div>
                  <div>空气质量<span>{{weatherData.air_level}}</span></div>
                  <div>湿度<span>{{weatherData.humidity}}</span></div>
                </div>
                <p class="time">更新时间<span>2020-11-17 17:41:22</span></p>
              </section>
              <section
                class="risk_source"
                id="pie_container"
              >
              </section>
              <section class="company_list">
                <h3>重点关注企业列表</h3>
                <div class="list">
                  <div
                    class="company_item"
                    v-for="(item,index) in focusedComanyList"
                    :key="index"
                    @click="companyItemClick(index)"
                  >
                    <span> {{item.name}}</span> <span>{{item.type}}</span> <span>风险总数{{item.riskCount}}</span>
                  </div>
                </div>
              </section>

            </a-col>
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
            <!-- <a-col :span="1">右侧</a-col> -->
          </a-row>
          <div class="side_button">
            <div class="left_btn">
              <a-icon
                type="double-right"
                @click="userDrawerVisible=true"
              />
            </div>
            <div class="right_btn">
              <a-icon
                type="double-left"
                @click="exitModelVisible=true"
              />
            </div>
          </div>
        </a-spin>

      </a-layout-content>
    </a-layout>

    <!--检查点抽屉-->
    <!-- <a-drawer
      title="检查点信息"
      placement="right"
      :visible="RSHoverVisible"
      :after-visible-change="afterVisibleChange"
      @close="closeCheckPointDrawer"
      width="22vw"
    >
      <a-row>
        <a-col :span="8">检查点名称 </a-col>
        <a-col :span="16">{{RSHoverContent.companyName}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">检查点经纬度 </a-col>
        <a-col :span="16">{{RSHoverContent.position}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">检查点ID </a-col>
        <a-col :span="16">{{RSHoverContent.companyId}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">RFID </a-col>
        <a-col :span="16">{{RSHoverContent.RFID}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">所属区域 </a-col>
        <a-col :span="16">{{RSHoverContent.areaName}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">所属企业 </a-col>
        <a-col :span="16">{{RSHoverContent.companyName}}</a-col>
      </a-row>
    </a-drawer> -->
    <!--个人中心 抽屉-->
    <a-drawer
      title="个人中心"
      placement="left"
      :visible="userDrawerVisible"
      :after-visible-change="afterVisibleChange"
      @close="closeUserDrawer"
      width="20vw"
    ></a-drawer>
    <!--企业信息 抽屉-->
    <a-drawer
      title="企业信息"
      placement="right"
      :visible="CIDrawerVisible"
      :after-visible-change="afterVisibleChange"
      @close="closeCompanyDrawer"
      width="20vw"
    >
      <div
        class="content"
        v-if="CIDrawerVisible"
      >
        <a-row>
          <a-col :span="8">企业名称 </a-col>
          <a-col :span="16">{{CIdrawerContent.info.name}}</a-col>
        </a-row>
        <a-row>
          <a-col :span="8">企业经纬度 </a-col>
          <a-col :span="16">{{CIdrawerContent.info.position}}</a-col>
        </a-row>
        <a-row>
          <a-col :span="8">历史风险总数 </a-col>
          <a-col :span="16">{{CIdrawerContent.info.riskCount}}</a-col>
        </a-row>
        <p>检查点列表</p>
        <section>
          <p
            v-for="(item,index) in CIdrawerContent.checkPoints"
            :key="index"
          >{{item.checkpointName}}</p>
        </section>
      </div>
    </a-drawer>
    <!--退出model -->
    <a-modal
      :visible="exitModelVisible"
      title="安全退出"
      @ok="handleOk"
      @cancel="handleCancel"
    >

      <a-alert
        type="error"
        message=" 此操作会退出系统，是否继续"
        banner
      />
    </a-modal>
    <!---风险源 hover-->
    <!--MARK: hover效果的暂时版本-->
    <div
      class="risk_hover"
      ref="risk_hover"
      v-show="RSHoverVisible"
    >

      <div class="triangle"></div>
      <h3>风险详情</h3>
      <a-row>
        <a-col :span="8">企业名称 </a-col>
        <a-col :span="16">{{RSHoverContent.companyName}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">企业经纬度度 </a-col>
        <a-col :span="16">{{RSHoverContent.position[0]}},{{RSHoverContent.position[1]}}</a-col>
      </a-row>
      <p>未处理的隐患数据</p>
      <div>
        <p
          v-for="(item,index) in RSHoverContent.checkPoints"
          :key="index"
          class="checkpoint_item"
        >
          检查点名称:{{item.checkpointName}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
const yongchaunJson = require("../assets/map/yongchuan.json"); //导入永川区 地图json并转换为对象
const chinaJson = require("../assets/map/china.json");
const cqJson = require("../assets/map/chongqing.json");
// console.log(scatterData);
const YC = require("../assets/map/YC.json");
// const nanda = require("../assets/map/nanda2.json");
const zhongshan = require("../assets/map/zhongshan.json");
const weixinhu = require("../assets/map/weixinhu.json");
import {
  getYongchuanBoundary,
  GetLocations,
  getGeoJson,
  getGeoJson1,
} from "network/map";
import {
  drawDistrictBorder,
  mapController,
  echartMapController,
} from "useModule/mapController";
import { getCheckPoints, getRiskSource, getRisks } from "network/tempData.js";
import { getWeather } from "network/weather";
import { throttlen, debounce } from "useModule/utils";

const general = getGeoJson();
console.log(general);
export default {
  // name: "Home",
  data() {
    return {
      mapType: "echarts",
      spinning: true,
      echartMap: null, //echarts 实例
      emController: null, //echarts map控制器
      amap: null, //高德地图 实例
      mapController: null, //高德地图控制器
      mapCenter: [], //地图中心
      weatherData: null,
      focusedComanyList: [],
      //风险源 抽屉
      RSHoverVisible: false,
      //用户中心抽屉
      userDrawerVisible: false,
      //企业信息 抽屉
      CIDrawerVisible: false,
      //退出弹框
      exitModelVisible: false,
      //风险源 抽屉内容
      RSHoverContent: {
        position: [],
        //模拟数据 写死
        companyId: 1273281863665983488,
        RFID: "A01E3560",
        areaName: "矿山区域",
        companyName: "渝琥石英砂有限公司",
        checkPoints: [],
      },
      RSHover: {
        top: 0,
        left: 100,
      },
      //企业信息展示 抽屉内容
      CIdrawerContent: {
        info: {},
        checkPoints: [],
      },
      data: {
        riskSource: [],
        risks: [],
      },
    };
  },
  computed: {
    //动态计算 houver 弹出框的高度
    hoverHeight() {
      const clientHeight = document.body.clientHeight; //获取页面高度
      const height = 103 + this.RSHoverContent.checkPoints.length * 30 + "px";
      console.log(height);
      return height;
    },
  },
  methods: {
    //获取 数据
    async getData() {
      //获取检查点数据
      this.data.riskSource = getRiskSource();
      //获取 天气信息
      const res = await getWeather();
      if (!res.success) return this.$message.error("天气信息获取失败");
      console.log(res.data);
      this.weatherData = res.data;
      this.drawRiskSourcePie();
      //获取重点关注对象
      const temp = [
        {
          name: "渝琥石英砂有限公司",
          position: [105.865745, 29.245634],
          type: "建材",
          riskCount: 200,
          companyId: 1245492352970530816,
        },
        {
          name: "渝琥石英砂有限公司",
          position: [105.865745, 29.25634],
          type: "建材",
          riskCount: 200,
          companyId: 1245492352970530816,
        },
        {
          name: "渝琥石英砂有限公司",
          position: [105.865745, 29.2634],
          type: "建材",
          riskCount: 200,
          companyId: 1245491675644960768,
        },
        {
          name: "渝琥石英砂有限公司",
          position: [105.87745, 29.245634],
          type: "建材",
          riskCount: 200,
          companyId: 1245490314215825408,
        },
        {
          name: "渝琥石英砂有限公司",
          position: [105.89745, 29.245634],
          type: "建材",
          riskCount: 200,
          companyId: 1245489653562613760,
        },
      ];
      this.focusedComanyList = temp;
    },
    //获取天气信息
    async getWeatherData() {
      const res = await getWeather();
      if (!res.success) return this.$message.error("天气信息获取失败");
      console.log(res.data);
      this.weatherData = res.data;
      this.drawRiskSourcePie();
    },
    switchMapType() {
      this.closeCheckPointDrawer();
      this.mapType = this.mapType === "map" ? "echarts" : "map";
    },
    //自动刷新风险数数据 建议后期 改成 //TODOwebsocket
    startRefreshRisk() {
      // setInterval(() => {
      //   const risks = getRisks();
      //   console.log(risks);
      //   if (risks.length !== 0) {
      //     this.$message.warn("产生新的风险");
      //     this.mapController.drawRisk(risks);
      //   }
      // }, 1000);
      const risks = getRisks();
      console.log(risks);
      if (risks.length !== 0) {
        this.$message.warn("产生新的风险");
        this.mapController.drawRisk(risks);
        this.emController.drawRisk(risks);

        //添加闪烁
        const pathElements = document.querySelectorAll(".shinning");
        console.log(pathElements);
        //由于 style scoped 属性后 vue-loader 会给style 内的选择器加一个字符串，全部办成属性选择器，@keyframe 名称也会改变
        pathElements.forEach((ele) => {
          const checkpointid = ele.dataset.checkpointid;
          const risk = risks.find((item) => item.checkpointId == checkpointid);

          console.log(checkpointid);
          const timer = setInterval(() => {
            const pre = ele.style.fill;
            ele.style.fill = pre === "none" ? "#d81e06" : "none";
            this.data.risks.push();
          }, 1000);

          if (risk.timers) {
            risk.timers.push(timer);
          } else risk.timers = [timer];
          this.data.risks.push(risk); //保存 到Vue 实例，
        });
        console.log(risks);

        // setTimeout(() => {
        //   this.removeRisk();
        // }, 3000);
      }
    },
    //风险解决 取消 动态显示
    removeRisk() {
      const solved = this.data.risks;

      // this.mapController.removeRisk(solved);
      solved.forEach((item) => {
        const { timers, checkpointId } = this.data.risks.find(
          (i) => i.checkpointId == item.checkpointId
        );
        console.log(timers, checkpointId);
        this.$message.success(`id 为 ${checkpointId}的检查点风险解决`);
        timers.forEach((timer) => {
          clearInterval(timer);
        });
      });
    },

    //初始化 并渲染地图
    emapInit() {
      this.echartMap = echarts.init(document.querySelector("#chart"));
      //注册地图
      echarts.registerMap("cq", cqJson);
      echarts.registerMap("china", chinaJson);
      echarts.registerMap("yongchuan", yongchaunJson);
      echarts.registerMap("yc", general);
      echarts.registerMap("YC", YC);
      // echarts.registerMap("nanda", nanda);
      echarts.registerMap("zhongshan", zhongshan);
      echarts.registerMap("weixinhu", weixinhu);
      this.emController = new echartMapController(this.echartMap);
      this.emController.init(this.data.riskSource);
      this.echartsBindEventHandler();
    },
    // echarts 绑定点击事件
    echartsBindEventHandler() {
      // this.emController.bindMakersEventHandler("click", "geo", (params) => {
      //   console.log(params);
      //   const { name } = params;
      // });
      this.emController.bindMakersEventHandler(
        "click",
        "series.effectScatter",
        (params) => {
          console.log("click in scatter", params);
          const { name, value } = params;
          this.RSHoverContent.name = name;
          this.RSHoverContent.position = value;
          // this.RSHoverVisible = true;
          // console.log(params);
          this.setMapCenter(value);
          this.mapType = "map"; //切换到 高德地图
        }
      );
    },
    //绑定 高德地图上 markers 的点击事件
    bindMakersEventHandler() {
      const AMap = window.AMap;
      //高德地图 部分
      // //绑定 点击事件，弹出右侧 抽屉
      // this.mapController.bindMakersEventHandler("click", (e) => {
      //   // console.log(e, this);
      //   const { compnayName, companyId } = e.target.getExtData();
      //   const position = e.target.getCenter();
      //   console.log(companyName, companyId, position);
      //   this.RSHoverContent.companyName = companyName;
      //   this.RSHoverContent.position = position;
      //   this.RSHoverContent.checkPoints = this.data.riskSource.find(
      //     (item) => item.companyId === companyId
      //   ).checkPoints;
      //   this.RSHoverVisible = true;
      // });
      let trigger = "none"; //marker none content
      //风险源 houver 处理函数 ，箭头函数
      const mouseoverHandler = (e) => {
        // console.log('mouseover',trigger);
        // if (trigger !== "none") return;
        trigger = "marker";
        const { compnayName, companyId } = e.target.getExtData();
        const position = e.target.getCenter();
        //手动位移
        // const { clientX, clientY } = e.originEvent;
        // // console.log(clientX,clientY,e);
        // this.RSHover.top = clientY - 5;
        // this.RSHover.left = clientX + 10;
        console.log(compnayName, companyId, position);
        this.RSHoverContent.checkPoints = this.data.riskSource.find(
          (item) => item.companyId == companyId
        ).checkPoints;
        this.RSHoverContent.position = [position.lng, position.lat];
        this.RSHoverVisible = true;
        //等待 弹出框加载完毕
        this.$nextTick(() => {
          //创建信息 窗体
          const infoWindow = new AMap.InfoWindow({
            isCustom: true,
            content: this.$refs.risk_hover, //传入 dom 对象
            // anchor: "middle-left",
            // anchor: "bottom-left",
            anchor: "top-left",
            offset: new AMap.Pixel(10, -5),
          });
          infoWindow.open(this.amap, [position.lng, position.lat]);
        });
        // this.exitModelVisible=true;
      };
      //mouseout事件处理函数
      const mouseoutHandler = () => {
        // this.RSHoverVisible = false;
        //  console.log("mouseout",trigger);
        // if (trigger !== "marker") return;
        this.amap.clearInfoWindow(); //清除 信息窗体
        trigger = "none";
      };
      //绑定 mouseover 事件，显示信息窗口
      this.mapController.bindMakersEventHandler(
        "mouseover",
        debounce(mouseoverHandler, 200) //绑定节流函数
      );
      //绑定 mouseout 事件处理函数  使用防抖，在一段事件之后触发
      this.mapController.bindMakersEventHandler(
        "mouseout",
        debounce(mouseoutHandler, 200) //绑定节流函数
      );
      // const mapmoveHandler = () => {
      //   console.log("mapmove");
      // };
      // //绑定mapmove 事件

      // this.mapController.bindMapEventHandler("mapmove", mapmoveHandler);
      this.$refs.risk_hover.addEventListener("mouseover", () => {
        console.log("hover in ", trigger);
        trigger = "content";
        this.mapController.removeMakersEventHandler("mouseout"); //当鼠标 悬浮在内容中清除
        this.RSHoverVisible = true;
      });
      this.$refs.risk_hover.addEventListener("mouseleave", () => {
        console.log("leave hover in ", trigger);
        trigger = "none";
        // this.$refs.risk_hover.removeEventListener("mouseentter");
        this.RSHoverVisible = false;
        //重新绑定 marker 的mouseout 事件
        this.mapController.bindMakersEventHandler(
          "mouseout",
          debounce(mouseoutHandler, 200) //绑定节流函数
        );
      });
      //鼠标离开 之后一段时间才 关闭信息窗体
      // this.mapController.bindMakersEventHandler("mouseout", (e) => {
      //   setTimeout(() => {
      //     this.amap.clearInfoWindow(); //清除 信息窗体
      //   }, 500);
      // });
    },
    //绘制 风险源 统计饼图
    drawRiskSourcePie() {
      const riskSource = [
        { value: 335, name: "type1" },
        { value: 310, name: "type2" },
        { value: 234, name: "type3" },
        { value: 135, name: "type4" },
        { value: 1548, name: "type5" },
      ];
      const pie = echarts.init(document.querySelector("#pie_container"));
      const option = {
        title: {
          text: "全区风险源统计",
          left: "center",
          textStyle: {
            // fontSize:'24px',
            // height:'50px',
            // fontWeight:'bolder'
            color: "#fff",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          left: "center",
          top: "20px",
          data: ["type1", "type2", "type3", "type4", "type5"],
          textStyle: {
            color: "#fff",
          },
        },
        series: {
          name: "访问来源",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: riskSource,
        },
      };
      pie.setOption(option);
    },
    //重点关注 企业 点击 处理函数
    companyItemClick(index) {
      console.log(index);
      const info = this.focusedComanyList[index];
      const { position, name, companyId } = info;
      console.log(position, index);
      this.CIdrawerContent.info = info;
      this.CIdrawerContent.checkPoints = this.data.riskSource.find(
        (item) => item.companyId == companyId
      ).checkPoints;
      this.CIDrawerVisible = true;
      this.setMapCenter(position);
    },
    //同时 设置两个地图的中心 并放大地图
    setMapCenter(position) {
      //高德地图 设置中心位置
      this.amap.setCenter(position);
      this.amap.setZoom(14);
      //echart 地图 设置中心位置
      this.echartMap.setOption({
        geo: {
          center: position,
          zoom: 4,
        },
      });
    },
    //两个 地图同时设置 中心位置
    //关闭 检查点 信息抽屉
    closeCheckPointDrawer() {
      this.RSHoverVisible = false;
    },
    //关闭 个人中心信息抽屉
    closeUserDrawer() {
      this.userDrawerVisible = false;
    },
    //确认退出
    handleOk() {
      this.exitModelVisible = false;
      this.$message.success("退出成功");
    },
    handleCancel() {
      this.exitModelVisible = false;
    },
    closeCompanyDrawer() {
      this.CIDrawerVisible = false;
      this.CIdrawerContent = {
        info: {},
        checkPoints: [],
      };
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

      AMap.plugin(
        ["AMap.Scale", "AMap.HawkEye", "AMap.Geolocation", "AMap.Weather"],
        () => {
          const scale = new AMap.Scale();
          // const HawkEye = new AMap.HawkEye();
          // const MapType = new AMap.MapType();
          // const Geolocation = new AMap.Geolocation();
          // this.amap.addControl(toolbar);
          this.amap.addControl(scale);
          // this.amap.addControl(HawkEye);
          // this.amap.addControl(MapType);
          // this.amap.addControl(Geolocation);
        }
      );
      //土块加载完成
      this.amap.on("complete", () => {
        this.spinning = false;
      });
      this.mapInitedHandler();
    },
    //地图初始化完成
    mapInitedHandler() {
      //创建控制器
      const locations = GetLocations();
      const riskSource = getRiskSource();
      // console.log(locations);
      this.mapController = new mapController(AMap); //创建 高德地图的控制器
      this.mapController.init(this.amap, locations);
      this.mapController.drawRiskSource(riskSource);
      //绑定事件
      this.bindMakersEventHandler();
      this.startRefreshRisk();
    },
  },
  created() {
    this.getData();
    //获取天气信息
    // this.getWeatherData();
  },
  mounted() {
    this.emapInit();
    // this.echartsBindEventHandler();
    //等页面 加载文笔，指的是  高德地图的script脚本
    document.addEventListener("DOMContentLoaded", () => {
      this.mapInit();
    });
  },
  destroyed() {
    //清除所有定时器
    this.risks.forEach((item) => {
      const timers = item.timers;
      timers.forEach((timer) => {
        clearInterval(timer);
      });
    });
  },
};
</script>

<style lang="less" scoped>
//svg 闪烁动画

.home {
  height: 100%;
  overflow-x: hidden;

  color: #fff;
  background: url(../assets/img/bg.jpg);
  /deep/.ant-spin-container {
    height: calc(100vh - 64px - 20px); //spin 组件默认称其 整屏
  }
  .ant-layout {
    background: none;
  }
  .ant-layout-header .header_wapper {
    height: 100%;
    color: #fff;
    display: flex;
    justify-content: space-around;
    border: 1px solid #93ebf8;
    .left,
    .right {
      width: 30%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .ant-layout-content {
    padding: 10px 10px 10px 10px;
  }
  .left_side {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    > section {
      border: 1px solid #fff;
    }
    .weather {
      height: 20%;
      min-height: 140px;
      padding: 5px;
      .baseinfo {
        display: flex;
        // justify-content: space-around;
        .tem_wapper {
          width: 50%;
          .tem {
            font-size: 40px;
          }
        }
        .right {
          width: 40%;
        }
      }
      .other {
        font-size: 12px;
        display: flex;
        justify-content: space-evenly;
      }
      .time {
        font-size: 10px;
        text-align: right;
        margin-top: 10px;
      }
    }
    .risk_source {
      height: 40%;
      #pie_container {
        height: 100%;
      }
    }
    .company_list {
      height: 32%;

      // padding: 20px;
      // overflow-y: scroll;
      overflow: hidden;
      h3 {
        text-align: center;
        margin-bottom: 0;
        color: #fff;
      }
      .list {
        overflow-y: scroll;
        overflow-x: hidden;
        height: calc(100% - 24px);
        .company_item {
          display: flex;
          justify-content: space-around;
          align-items: center;
          // box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
          box-shadow: 0 2px 6px 0 #93ebf8;
          border-radius: 5px;
          height: 22%;
          width: 90%;
          margin: 10px auto 0 auto;
          cursor: pointer;
        }
        .company_item:hover {
          background-color: #eeeeee;
          box-shadow: none;
          color: black;
        }
      }
    }
  }

  .wapper {
    height: 100%;
  }
  .map_container {
    height: calc(100% - 40px);
    margin: 0 auto;
    // background-color: #eeeeee;//FIXME
    border: 1px solid #93ebf8;
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
    width: 7vw;
    min-width: 100px;
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
  //左右侧的 划出 按钮
  .side_button {
    > div {
      width: 20px;
      height: 20vh;
      position: fixed;
      background-color: red;
      display: grid; //快速居中
      place-items: center;
      .anticon {
        cursor: pointer;
        color: #fff;
      }
    }
    .left_btn {
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .right_btn {
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .risk_hover {
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
    padding: 10px;
    border-radius: 5px;
    background-color: #fff;
    font-size: 13px;
    // position: absolute;
    // top: 50px;
    // left: 100px;
    color: black;
    width: 17vw;
    // overflow: hidden;
    transition: height cubic-bezier(0.075, 0.82, 0.165, 1) 0.3s;
    margin-bottom: 5px;
    .triangle {
      width: 0;
      height: 0;
      border: 10px solid;
      border-color: transparent #fff transparent transparent;
      position: absolute;
      top: 5px;
      left: -20px;
    }
    .checkpoint_item {
      cursor: pointer;
      line-height: 30px;
    }
    p {
      margin-block-start: 0px;
      margin-block-end: 0px;
    }
  }
}
</style>