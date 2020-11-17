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
                    :key="item.companyID"
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
    <a-drawer
      title="检查点信息"
      placement="right"
      :visible="RSDrawerVisible"
      :after-visible-change="afterVisibleChange"
      @close="closeCheckPointDrawer"
      width="22vw"
    >
      <a-row>
        <a-col :span="8">检查点名称 </a-col>
        <a-col :span="16">{{RSdrawerContent.name}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">检查点经纬度 </a-col>
        <a-col :span="16">{{RSdrawerContent.position}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">检查点ID </a-col>
        <a-col :span="16">{{RSdrawerContent.checkpointId}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">RFID </a-col>
        <a-col :span="16">{{RSdrawerContent.RFID}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">所属区域 </a-col>
        <a-col :span="16">{{RSdrawerContent.areaName}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="8">所属企业 </a-col>
        <a-col :span="16">{{RSdrawerContent.companyName}}</a-col>
      </a-row>
    </a-drawer>
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
        <section>list</section>
      </div>
    </a-drawer>
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
import { getWeather } from "network/weather";
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
      RSDrawerVisible: false,
      //用户中心抽屉
      userDrawerVisible: false,
      //企业信息 抽屉
      CIDrawerVisible: false,
      //退出弹框
      exitModelVisible: false,
      //风险源 抽屉内容
      RSdrawerContent: {
        name: "",
        position: [],
        //模拟数据 写死
        checkpointId: 1273281863665983488,
        RFID: "A01E3560",
        areaName: "矿山区域",
        companyName: "渝琥石英砂有限公司",
      },
      //企业信息展示 抽屉内容
      CIdrawerContent: {
        info: {},
        checkPoints: [],
      },
      data: {
        checkPoints: [],
      },
    };
  },
  methods: {
    //获取 数据
    async getData() {
      //获取检查点数据
      this.data.checkPoints = getCheckPoints();
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
          companyID: 0,
        },
        {
          name: "渝琥石英砂有限公司",
          position: [105.865745, 29.25634],
          type: "建材",
          riskCount: 200,
          companyID: 1,
        },
        {
          name: "渝琥石英砂有限公司",
          position: [105.865745, 29.2634],
          type: "建材",
          riskCount: 200,
          companyID: 2,
        },
        {
          name: "渝琥石英砂有限公司",
          position: [105.87745, 29.245634],
          type: "建材",
          riskCount: 200,
          companyID: 3,
        },
        {
          name: "渝琥石英砂有限公司",
          position: [105.89745, 29.245634],
          type: "建材",
          riskCount: 200,
          companyID: 4,
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
    //初始化 并渲染地图
    echartsInit() {
      this.echartMap = echarts.init(document.querySelector("#chart"));
      //注册地图
      echarts.registerMap("cq", cqJson);
      echarts.registerMap("china", chinaJson);
      echarts.registerMap("yongchuan", yongchaunJson);
      this.emController = new echartMapController(this.echartMap);
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
          this.RSdrawerContent.name = name;
          this.RSdrawerContent.position = value;
          this.RSDrawerVisible = true;
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
        this.RSdrawerContent.name = name;
        this.RSdrawerContent.position = position;
        this.RSDrawerVisible = true;
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
          // textStyle:{
          //   fontSize:'24px',
          //   height:'50px',
          //   fontWeight:'bolder'
          // }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          left: "center",
          top: "20px",
          data: ["type1", "type2", "type3", "type4", "type5"],
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
      const { position, name } = info;
      console.log(position, index);
      this.CIdrawerContent.info = info;
      this.CIDrawerVisible = true;
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
      this.RSDrawerVisible = false;
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
      // console.log(this.data.checkPoints);
      this.mapController = new mapController(AMap); //创建 高德地图的控制器
      this.mapController.init(this.amap, locations, this.data.checkPoints);
      //绑定事件
      this.bindMakersEventHandler();
    },
  },
  created() {
    this.getData();
    //获取天气信息
    // this.getWeatherData();
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
  overflow-x: hidden;
  // background:url(../assets/img/bg.jpg);
  /deep/.ant-spin-container {
    height: calc(100vh - 64px - 20px); //spin 组件默认称其 整屏
  }
  .ant-layout {
    background-color: none;
  }
  .ant-layout-header .header_wapper {
    height: 100%;
    color: #fff;
    display: flex;
    justify-content: space-around;
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
      border: 1px solid black;
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
      }
      .list {
        overflow-y: scroll;
        overflow-x: hidden;
        height: calc(100% - 24px);
        .company_item {
          display: flex;
          justify-content: space-around;
          align-items: center;
          box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
          border-radius: 5px;
          height: 22%;
          width: 90%;
          margin: 10px auto 0 auto;
          cursor: pointer;
        }
        .company_item:hover {
          background-color: #eeeeee;
          box-shadow: none;
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
}
</style>