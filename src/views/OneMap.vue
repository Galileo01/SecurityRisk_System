<template>
  <div id="one_map">
    <a-layout>
      <a-layout-content>
        <a-spin
          :spinning="spinning"
          size="large"
        >
          <a-row
            type="flex"
            justify="space-between"
            class="main"
            :gutter="10"
          >
            <a-col
              :span="5"
              class="left_side"
            >
              <!--天气组件-->
              <Weather />
              <!--风险源饼图组件-->
              <RiskrousePie />
              <!--动态风险源 通知栏-->
              <RiskNotice @risk-query="showRiskList" />
            </a-col>
            <a-col
              :span="mapsWapperSpan"
              class="map_wapper_col"
            >
              <section class="maps_wapper">
                <div class="map_bg">
                  <div class="header">
                    <h3 class="title">实时地图</h3>
                  </div>
                  <div class="body"></div>
                </div>
                <div class="header_title">

                </div>
                <section class="unsolved_risk">
                  <p>当前位置: <span>{{UnsolvedRisk.town}}</span></p>
                  <p>未解决风险: <span>{{UnsolvedRisk.count}}</span></p>
                </section>
                <section class="left_btns">
                  <div class="angle angle_top"></div>
                  <div class="btns_wapper">
                    <div
                      class="btn"
                      @click="switchMapMode('standard')"
                      :class="{yellow:mapMode==='standard'}"
                    >

                      <a-tooltip
                        placement="left"
                        title="标准地图"
                      >
                        <i class="standard">

                        </i>

                      </a-tooltip>
                    </div>

                    <div
                      class="btn"
                      :class="{yellow:mapMode==='echart'}"
                      @click="switchMapMode('echart')"
                    >
                      <a-tooltip
                        placement="left"
                        title="聚合图"
                      >
                        <i class="together"></i>
                      </a-tooltip>
                    </div>
                    <div
                      class="btn"
                      @click="switchMapMode('satellite')"
                      :class="{yellow:mapMode==='satellite'}"
                    >
                      <a-tooltip
                        placement="left"
                        title="卫星图"
                      >
                        <i class="satellite"></i>
                      </a-tooltip>
                    </div>
                    <div
                      class="btn"
                      @click="resetMap"
                    >
                      <a-tooltip
                        placement="left"
                        title="复位"
                      >
                        <i class="undo"></i>
                      </a-tooltip>
                    </div>
                    <div
                      class="btn"
                      @click="showTownQuery"
                    >
                      <a-tooltip
                        placement="left"
                        title="街镇筛选"
                      >
                        <a-icon
                          type="search"
                          :style="{fontSize:'20px'}"
                        />
                      </a-tooltip>
                    </div>
                    <div
                      class="btn"
                      @click="showUserCenter"
                    >
                      <a-tooltip
                        placement="left"
                        title="个人中心"
                      >
                        <a-icon
                          type="user"
                          :style="{fontSize:'20px'}"
                        />
                      </a-tooltip>
                    </div>
                  </div>
                  <div class="angle angle_bottom"></div>
                </section>

                <section
                  class="map_wapper"
                  ref="map_wapper"
                >
                  <div
                    id="chart"
                    v-show="mapMode==='echart'"
                    class="map_container"
                  >

                  </div>
                  <div
                    id="gaodemap"
                    v-show="mapMode!=='echart'"
                    class="map_container"
                  >
                  </div>
                </section>
                <section class="right_btns">
                  <div class="angle angle_top rotate"></div>

                  <div class="btns_wapper">
                    <div
                      class="btn"
                      @click="collectMapState"
                    >
                      <a-tooltip
                        placement="left"
                        title="位置收藏"
                      >
                        <i class="collect"></i>
                      </a-tooltip>
                    </div>
                    <div
                      class="btn"
                      @click="showTimeLine"
                    >
                      <a-tooltip
                        placement="left"
                        title="时间轴"
                      >
                        <a-icon
                          type="clock-circle"
                          :style="{fontSize:'20px'}"
                        />
                      </a-tooltip>

                    </div>
                    <div
                      class="btn"
                      :class="{red:showDataType==='focus_company'}"
                      @click="showFocusedComponyClick($event)"
                    >
                      <a-tooltip
                        placement="left"
                        title="重点关注企业排查"
                      >
                        <i class="risk"></i>
                      </a-tooltip>
                    </div>
                    <div
                      class="btn"
                      @click="showAllCheckPointsClick"
                      :class="{red:showDataType==='all_cpoint'}"
                    >
                      <a-tooltip
                        placement="left"
                        title="企业风险区域排查"
                      >
                        <a-icon
                          type="check"
                          :style="{fontSize:'20px'}"
                        />
                      </a-tooltip>
                    </div>
                    <div
                      class="btn"
                      @click="showCQDrawer()"
                    >
                      <a-tooltip
                        placement="left"
                        title="企业筛选"
                      >
                        <a-icon
                          type="monitor"
                          :style="{fontSize:'20px'}"
                        />
                      </a-tooltip>
                    </div>
                    <div
                      class="btn"
                      @click="showExit"
                    >
                      <a-tooltip
                        placement="left"
                        title="安全退出"
                      >
                        <a-icon
                          type="poweroff"
                          :style="{fontSize:'20px'}"
                        />
                      </a-tooltip>
                    </div>
                  </div>
                  <div class="angle angle_bottom rotate"></div>
                </section>
                <!--时间轴-->
                <TimeLine
                  :visible.sync="timeLineVisible"
                  :choosedDate="choosedDate"
                  @chooseDate="timelineQuery"
                  @close="closeTimeLine"
                />
              </section>
              <!--颜色标注-->
              <LevelColor :showDataType="showDataType" />
            </a-col>
            <!--右侧抽屉内容-->
            <a-col :span="drawerSpan">
              <!--企业查询 抽屉-->
              <CompanyQuery
                @close="closeCompanyQuery"
                @company-choose="CompanyChoose"
                v-if="drawerType==='CQ'"
              ></CompanyQuery>
              <!--隐患信息展示列表 抽屉-->
              <RiskList
                v-if="drawerType==='RL'"
                :listData="data.RiskListData"
                @close="closeRiskList"
                @risk-item-click="riskItemClick"
              ></RiskList>

              <!--检查点检查项 列表-->
              <PItemList
                v-if="drawerType==='IL'"
                @close="closeRightDrawer"
                :checkPointId="query.checkPointId"
                @fetch-success="spinning=false"
              />
            </a-col>
          </a-row>
        </a-spin>

      </a-layout-content>
    </a-layout>
    <!---风险源 hover-->
    <!--MARK: hover效果的暂时版本-->
    <RiskHover
      :riskList="RSHoverContent.riskList"
      :position="RSHoverPosition"
      :visible="RSHoverVisible"
      :isShowDrawer="isShowDrawer"
      @close="closeRiskHover"
      @moveCenter='moveToCenter'
      ref="risk_hover"
    />
    <div class="risk_hover_modal_wapper">
    </div>
    <!--城镇 查询-->
    <TownQuery
      :visible="townQueryVisible"
      :isTimeLine="timeLineVisible"
      @close="closeTownQuery"
      @choose="townChoose"
    />
    <UserCenter
      :visible.sync="userCenterVisible"
      v-if="userCenterVisible"
    />
    <ExitModal
      v-if="exitModelVisible"
      :visible.sync="exitModelVisible"
      @logout="Logout"
    />
    <!-- <Login :visible.sync="LogVisible" /> -->
  </div>
</template>

<script>
//组件引入
import echarts from "echarts";
import LevelColor from "onemap/LevelColor";
import Weather from "onemap/Weather";
import RiskrousePie from "onemap/RiskrousePie";
import RiskNotice from "onemap/RiskNotice";
import TownQuery from "onemap/TownQuery";
// const TownQuery=()=>import("onemap/TownQuery");
// import CompanyQuery from "onemap/CompanyQuery";
const CompanyQuery = () => import("onemap/CompanyQuery");
import TimeLine from "onemap/TimeLine";
import RiskHover from "onemap/RiskHover";
// import RiskList from "onemap/RiskList";
const RiskList = () => import("onemap/RiskList");
// import PItemList from "onemap/PItemList";
const PItemList = () => import("onemap/PItemList");
// import UserCenter from "onemap/UserCenter";
const UserCenter = () => import("onemap/UserCenter");
// import ExitModal from "onemap/ExitModal";
const ExitModal = () => import("onemap/ExitModal");
import Login from "onemap/Login";
//网络请求方法引入
import {
  drawDistrictBorder,
  mapController,
  echartMapController,
} from "useModules/mapController";
import { GetLocations, getGeoJson, getLocationCenter } from "network/staticMap";
import { getFocusedCompany } from "network/company";
import { getFocuedCompanyInfos } from "network/user";
import {
  getUnsolvedRiskCount,
  getRiskLeveled,
  queryByCondition,
  getUnsolvedRiskInfo,
  getUnsolvedRiskInfoOfLevel,
} from "network/risk";
import {
  getAllCheckPoints,
  queryCompanyByKeyword,
  getAllCompanyInfos,
} from "network/company";
//静态，文件工具
import { throttlen, debounce } from "useModules/utils";
import { isRisksToClose } from "useModules/useMap";
const general = getGeoJson();
const header_cover = require("../assets/img/window/header_cover.png");
const level0Icon = require("../assets/img/other/l0.png");
// console.log(level0Icon);
// console.log(general);
export default {
  // name: "Home",
  data() {
    return {
      mapMode: "echart", //地图模式
      spinning: true,
      echartMap: null, //echarts 实例
      emapController: null, //echarts map控制器
      amap: null, //高德地图 实例
      amapController: null, //高德地图控制器
      satelliteLayer: null, //高德地图 卫星图层
      AMapType: "standard", //高德地图的显示类型
      showDataType: "risk", //当前地图展示的地图信息 类型 risk 隐患/all_cpoint 所有检查点 focus_company 关注企业的检查点
      mapCenter: [], //地图中心
      focusedComanyList: [],
      //风险源 展示
      RSHoverVisible: false,
      //用户中心抽屉
      userCenterVisible: false,
      //退出弹框
      exitModelVisible: false,
      //登录框是否  课可见
      LogVisible: true, // 登录框 MARK:
      //街镇查询对话框 是否可见
      townQueryVisible: false,
      timeLineVisible: false,
      //地图内部 抽屉部分
      drawerType: "none", //右侧抽屉的类型
      query: {
        checkPointId: "", //检查点的id
      },
      //风险源 抽屉内容
      RSHoverContent: {
        position: [],
        //模拟数据 写死
        companyId: 1273281863665983488,
        RFID: "A01E3560",
        areaName: "矿山区域",
        companyName: "渝琥石英砂有限公司",
        riskList: [],
      },
      //RSHover 的位置信息
      RSHoverPosition: {
        top: 0,
        left: 0,
        offsetX: 0,
        offsetY: 0,
        mapWapperWidth: 0,
        mapWapperHeight: 0,
        mapWapperLeft: 0,
        mapWapperTop: 0,
        mapWapperRight: 0,
        mapsWapperHeight: 0,
        scatterPosition: [], //触发mouseover 的散列点/marker 所在的位置
      },
      RSHoverState: "none", //RSHover当前所处的状态 初始状态为 none
      //企业信息展示 抽屉内容
      CIdrawerContent: {
        info: {},
        checkPoints: [],
      },
      //unsolved_risk 框展示的 内容
      UnsolvedRisk: {
        town: "永川",
        count: 0,
      },
      //保存比较 大的数据部分
      data: {
        risks: [], //当前的 隐患数据
        townsLocations: [],
        companyInfos: [], //企业信息
        RiskListData: [], //RiskList 组件 的数据部分
        townQueryParams: {}, //街镇查询的  多个参数
      },
      header_cover,
      mapsWapperSpan: 19, //高德 echarts 地图的容器span
      drawerSpan: 0, //右侧 抽屉的 容器span
      handlers: {}, //保存 常用 的事件处理函数
      timers: [], //定时器 id 数组
      refreshTimer: null, //自动刷新计时器
      riskMouseoverTimer: null, //隐患点位 mouseover 一段时间才触发事件
    };
  },
  computed: {
    LevelData() {
      return this.$store.LevelData;
    },
    LevelColors() {
      return this.$store.getters.LevelColors;
    },
    //之前收藏的地图状态  当前用浏览器存储 模拟 后台获取
    preMapState() {
      return this.$store.state.preMapState;
    },
    //根据 span 计算 右侧抽屉是否展示
    isShowDrawer() {
      return this.drawerSpan !== 0;
    },
    //通过 townQuery 选择的 日期 计算月份
    choosedDate() {
      const { dateStr } = this.data.townQueryParams;
      let date = null;
      if (!dateStr || dateStr instanceof Array) date = new Date();
      else date = new Date(dateStr);
      console.log(date);
      return date;
    },
  },
  components: {
    LevelColor,
    Weather,
    RiskrousePie,
    RiskNotice,
    TownQuery,
    CompanyQuery,
    TimeLine,
    RiskHover,
    RiskList,
    PItemList,
    UserCenter,
    ExitModal,
    Login,
  },
  methods: {
    //获取 数据
    getData() {
      //获取检查点数据
      this.data.townsLocations = GetLocations();
      //统一请求
      Promise.all([getUnsolvedRiskCount(), getAllCompanyInfos()])
        .then((responses) => {
          // console.log(responses);
          this.UnsolvedRisk.count = responses[0].data;
          this.data.companyInfos = responses[1].data;
          //等页面 加载文笔，指的是  高德地图的script脚本
          this.$nextTick(() => {
            this.emapInit();

            this.mapInit();
          });
          this.spinning = false;
        })
        .catch((err) => {
          this.$message.error("数据请求失败");
          console.log(err);
          this.spinning = false;
          // this.startRefreshRisk();
        });
    },
    //初始化 并渲染地图
    emapInit() {
      this.echartMap = echarts.init(document.querySelector("#chart"));
      //注册地图
      echarts.registerMap("yc", general);
      this.emapController = new echartMapController(this.echartMap);

      //如果存在 地址收藏
      if (this.preMapState) {
        const { center, amapZoom, emapZoom } = this.preMapState;
        this.emapController.init(this.LevelColors, {
          center,
          zoom: emapZoom,
        });
      } else {
        this.emapController.init(this.LevelColors);
      }
      // console.log(this.echartMap.getOption());
      this.echartsBindEventHandler();
    },
    // echarts 绑定事件
    echartsBindEventHandler() {
      //先定义事件处理函数
      this.handlers.scatterMouseoverHandler = (params) => {
        // console.log("mouseover in scatter", params);
        //延迟 执行
        this.riskMouseoverTimer = setTimeout(() => {
          console.log(
            " trigger mouseover in delay timer:",
            this.riskMouseoverTimer,
            params
          );
          clearTimeout(this.riskMouseoverTimer);
          this.riskMouseoverTimer = null;

          if (this.RSHoverState !== "none") return;

          let {
            event: {
              event: { clientX, clientY, offsetX, offsetY },
            },
          } = params;
          console.log(params.event.event);
          let { height, width } = getComputedStyle(this.$refs.risk_hover.$el);
          height = parseInt(height);
          width = parseInt(width);
          const { clientWidth, clientHeight } = document.body;
          // console.log(height, clientHeight, clientY,height + clientY >= clientHeight);
          //判断是否出界
          clientY =
            height + clientY + 20 >= clientHeight
              ? clientHeight - height - 20
              : clientY;
          clientX =
            width + clientX >= clientWidth ? clientWidth - width : clientX;
          // console.log(clientY,clientX);

          this.RSHoverPosition.top = clientY;
          this.RSHoverPosition.left = clientX;
          this.RSHoverVisible = true;
          this.RSHoverPosition.scatterPosition = [
            params.value[0],
            params.value[1],
            params.seriesName,
          ];
          this.RSHoverContent.riskList = this.data.risks[
            params.seriesIndex
          ].companyActiveRiskBOList;
          console.log(this.RSHoverContent.riskList);
        }, 600); //延迟 500s

        // console.log("riskMouseoverTimer", this.riskMouseoverTimer);
      };

      //点击事件处理函数
      const scatterClickHandler = (params) => {
        console.log(params);
        const center = [params.value[0], params.value[1]];
        //切换到 高德地图 并设置 中心
        this.mapMode = "standard";
        this.RSHoverState = "s_hover";
        this.amapController.setCenter(center);
        this.amap.setZoom(14); //设置为合适的 比例
      };
      //鼠标移出 事件处理函数
      this.handlers.scatterMouseoutHandler = () => {
        console.log(this.riskMouseoverTimer);
        console.log(this.RSHoverState, "in mouseout in scatter");
        if (this.riskMouseoverTimer) {
          //如果500ms 没有过立即 清除定时器
          clearTimeout(this.riskMouseoverTimer);
          this.riskMouseoverTimer = null;
          console.log("clear timer before 500ms");
          //MARK:
        }
        if (this.RSHoverState === "click" || this.RSHoverState === "hover")
          return;

        this.RSHoverState = "none";
        setTimeout(() => {
          if (this.RSHoverState == "none") {
            console.log("mouseout");
            this.closeRiskHover(); //直接调用组件自身方法 关闭 连个弹框
          }
        }, 200);
      };
      //riskhoverList 事件处理函数 的定义
      this.handlers.RHMouseoutHandler = () => {
        console.log(this.RSHoverState, "in mouseout in Rhover");
        if (
          this.RSHoverState === "click" ||
          this.RSHoverState === "list_click"
        ) {
          console.log("return ");
          return;
        } //如果 risk_hover上触发了点击事件
        this.closeRiskHover();
        this.RSHoverState = "none";
        console.log(2, this.RSHoverVisible, this.RSHoverState);
        //重新 监听 mouover事件
        this.emapController.bindMakersEventHandler(
          "mouseover",
          "series.effectScatter",
          this.handlers.scatterMouseoverHandler
        );
      };
      //定义并保存 点击事件 事件处理函数
      this.handlers.RHClickHandler = () => {
        if (!this.RSHoverVisible) return;
        console.log("click", this.RSHoverState);
        if (this.RSHoverState === "click") return;
        this.RSHoverState = "click"; //更改state 组织echarts 在事件中 关闭
        console.log(this.RSHoverState);

        this.echartMap.off("mouseout"); //清除 关闭动作
        this.$refs.risk_hover.$el.removeEventListener(
          "mouseout",
          this.handlers.RHMouseoutHandler
        );
      };
      const RHMouseoverHandler = () => {
        console.log("RHhover", this.RSHoverState);
        this.RSHoverState = "hover"; //更改state 组织echarts 在事件中 关闭
        this.echartMap.off("mouseout"); //清除 关闭动作
        this.RSHoverVisible = true;
      };
      //保存处理函数
      //监听 click 事件
      this.emapController.bindMakersEventHandler(
        "click",
        "series.effectScatter",
        scatterClickHandler
      );
      //监听 mouover事件
      this.emapController.bindMakersEventHandler(
        "mouseover",
        "series.effectScatter",
        this.handlers.scatterMouseoverHandler
      );
      //监听 mouout事件
      this.emapController.bindMakersEventHandler(
        "mouseout",
        "series.effectScatter",
        this.handlers.scatterMouseoutHandler
      );
      // //监听 缩放  mousedown事件 关闭弹窗
      // this.emapController.bindMakersEventHandler("mousedown", "geo", () => {
      //   console.log("mousedown");
      //   this.RSHoverState = "none";

      //   this.closeRiskHover();
      // });

      this.$refs.risk_hover.$el.addEventListener(
        "mouseover",
        RHMouseoverHandler
      );
      //一旦触发点击事件  就要移除其他事件
      this.$refs.risk_hover.$el.addEventListener(
        "click",
        this.handlers.RHClickHandler
      );
      const emap = document.querySelector("#chart canvas");

      const mouseMove_WheelHandler = throttlen(() => {
        // console.log("trigger mousemove");
        if (this.RSHoverState === "none") return; //如果当前 窗体 并没有展示 直接退出
        // console.log("hide");
        this.RSHoverState = "none";
        this.closeRiskHover();
      }, 300);
      emap.addEventListener("mousedown", () => {
        if (this.RSHoverState === "none") return;
        emap.addEventListener("mousemove", mouseMove_WheelHandler);
      });
      emap.addEventListener("mouseup", () => {
        emap.removeEventListener("mousemove", mouseMove_WheelHandler);
      });
      emap.addEventListener(
        "mousewheel",
        //节流函数 减少触发次数
        mouseMove_WheelHandler
      );
      this.handlers.mouseMove_WheelHandler = mouseMove_WheelHandler;
    },
    // 关闭 riskHover 的时候 所有要完成的操作
    //1.恢复 里面的所有在状态
    //2.恢复事件
    //3.恢复RSHoverState
    closeRiskHover() {
      console.log("closeRiskHover");
      this.RSHoverVisible = false;
      this.$refs.risk_hover.closeAll();
      //重新绑定事件
      this.emapController.bindMakersEventHandler(
        "mouseout",
        "series.effectScatter",
        this.handlers.scatterMouseoutHandler
      );
      this.$refs.risk_hover.$el.addEventListener(
        "mouseout",
        this.handlers.RHMouseoutHandler
      );
      this.RSHoverState = "none";
    },

    //点击查看 具体 隐患 强制 把改 点位以到视觉中心
    moveToCenter() {
      if (this.mapMode === "echart")
        this.emapController.setCenter(this.RSHoverPosition.scatterPosition);
      else {
        this.amapController.setCenter(
          this.RSHoverPosition.scatterPosition,
          true
        ); //立即
      }
      console.log(this.RSHoverPosition.scatterPosition);
      //手动触发事件 定位
      // this.echartMap.dispatchAction({
      //   type: "mouseover",
      //   seriesName: this.RSHoverPosition.scatterPosition[2],
      // });
      // this.$refs.risk_hover.showWindows();
    },
    //绑定 高德地图上 事件
    bindRMakersEventHandler() {
      //定义事件处理函数
      this.handlers.markerMouseoverHandler = (params) => {
        // console.log("mouseover in scatter", params);
        //延迟 执行
        this.riskMouseoverTimer = setTimeout(() => {
          console.log(" trigger mouseover in delay", params);
          clearTimeout(this.riskMouseoverTimer);
          this.riskMouseoverTimer = null;
          if (this.RSHoverState !== "none") return;

          let {
            originEvent: { clientX, clientY, offsetX, offsetY, target },
            lnglat,
          } = params; //从params 解构参数

          console.log(clientX, clientY, offsetX, offsetY);
          let { height, width } = getComputedStyle(this.$refs.risk_hover.$el);
          height = parseInt(height);
          width = parseInt(width);
          const { clientWidth, clientHeight } = document.body;
          // console.log(height, clientHeight, clientY,height + clientY >= clientHeight);
          //判断是否出界
          clientY =
            height + clientY + 20 >= clientHeight
              ? clientHeight - height - 20
              : clientY;
          clientX =
            width + clientX >= clientWidth ? clientWidth - width : clientX;
          // console.log(clientY,clientX);

          this.RSHoverPosition.top = clientY;
          this.RSHoverPosition.left = clientX;
          this.RSHoverVisible = true;
          this.RSHoverPosition.scatterPosition = [
            lnglat.lng,
            lnglat.lat,
            params.seriesName,
          ];
          // const marker = this.amapController.getMarkerByPosition(
          //   lnglat.lng,
          //   lnglat.lat
          // );
          // console.log(marker);
          //查找 对应 检查点的 隐患列表
          const checkPointId = target.dataset.checkpointid;
          const risk = this.data.risks.find(
            (checkpoint) => checkpoint.checkPointId === checkPointId
          );
          console.log(target.dataset);
          this.RSHoverContent.riskList = risk.companyActiveRiskBOList;
          console.log(this.RSHoverContent.riskList);
        }, 500); //延迟 500s

        // console.log("riskMouseoverTimer", this.riskMouseoverTimer);
      };
      //绑定 缩放和 拖动 取消显示
      this.amapController.bindRMakersEventHandler(
        "mouseover",
        this.handlers.markerMouseoverHandler
      );
      this.amap.on("mousedown", () => {
        console.log("mousedown in amap");
        this.amap.on("mousemove", this.handlers.mouseMove_WheelHandler);
      });
      this.amap.on("mouseup", () => {
        console.log("mouseup in amap");
        this.amap.off("mousemove", this.handlers.mouseMove_WheelHandler);
      });
      this.amap.on("mousewheel", this.handlers.mouseMove_WheelHandler);
      //检查点 点击事件 处理函数
      //使用高阶函数 传入 checkpointId
      this.handlers.PMarkerClickHandler = (checkPointId) => {
        return () => {
          // console.log(this);
          this.query.checkPointId = checkPointId;
          console.log("checkPointId", checkPointId);
          this.showPItemList(); //展示 抽屉
        };
      };
      // console.log(
      //   " this.handlers.PMarkerClickHandler ",
      //   this.handlers.PMarkerClickHandler
      // );
    },
    //高德地图 绑定 检查点的 点击事件 展开 右侧抽屉
    bindCPClickHandler() {
      //绑定所有 检查点的 点击事件
      this.amapController.bindPMakersEventHandler(
        "click",
        this.handlers.PMarkerClickHandler
      );
    },
    //高德地图初始化 触发
    mapInit() {
      const AMap = window.AMap;
      let center = [105.896951, 29.256584];
      let zoom = 10.2;

      if (this.preMapState) {
        center = this.preMapState.center;
        zoom = this.preMapState.amapZoom;
      }

      this.amap = new AMap.Map("gaodemap", {
        zoom,
        center,
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
        jogEnable: false,
        animateEnable: false,
      });

      AMap.plugin(
        [
          "AMap.Scale",
          "AMap.HawkEye",
          "AMap.Geolocation",
          "AMap.Weather",
          "AMap.MapType",
        ],
        () => {
          const scale = new AMap.Scale();
          // const HawkEye = new AMap.HawkEye();
          // const MapType = new AMap.MapType();
          // const Geolocation = new AMap.Geolocation();
          // this.amap.addControl(toolbar);
          this.amap.addControl(scale);
          // this.amap.addControl(HawkEye);
          // this.amap.addControl(MapType);
        }
      );
      //土块加载完成
      this.amap.on("complete", () => {
        this.spinning = false;
        this.mapInitedHandler();
      });
    },
    //地图初始化完成
    mapInitedHandler() {
      //创建控制器
      const locations = this.data.townsLocations;
      // console.log(locations);
      this.data.townsLocations = [];
      this.amapController = new mapController(AMap); //创建 高德地图的控制器
      this.amapController.init(this.amap, locations, this.LevelColors);
      // this.amapController.drawRiskSource1(riskSource);
      // console.log(this.data.companyInfos);
      this.drawAllCompanyArea();
      // 开始 获取隐患数据
      this.startRefreshRisk();
    },
    //绘制企业轮廓
    drawAllCompanyArea() {
      //遍历绘制企业区域
      for (let [index, company] of this.data.companyInfos.entries()) {
        // console.log(center);
        if (company.center.length === 0) continue;
        if (index === 0)
          //第一个 区域绘制之前先 清除之前的
          //   this.amapController.drawCompanyArea1(company, true);
          // else this.amapController.drawCompanyArea1(company);
          this.amapController.drawCompanyArea(company, true);
        else this.amapController.drawCompanyArea(company);
      }
    },
    //切换地图模式
    switchMapMode(mode) {
      // this.syncMapState(mode); //先同步 地图状态
      this.closeRiskHover();
      // if (mode === "standard" || mode === "echart") {
      //   if (this.satelliteLayer) this.satelliteLayer.hide(); //隐藏地图层
      // } else if (this.satelliteLayer) {
      //   this.satelliteLayer.show();
      // } else {
      //   this.satelliteLayer = new AMap.TileLayer.Satellite();
      //   this.amap.add(this.satelliteLayer);
      // }
      // if (mode !== "echart") this.$refs.risk_hover.closeAll(); //关闭风险源显示
      // this.mapMode = mode;
      // if (mode === "standard" || mode === "satellite") {
      //   this.echartMap.clear();
      // }
      const preMode = this.mapMode;
      if (mode === "standard") {
        if (this.satelliteLayer) this.satelliteLayer.hide(); //隐藏地图层
        this.amapController.cancelColorTown();
      } else if (mode === "satellite") {
        if (this.satelliteLayer) {
          //卫星图层已经存在 直接显示
          this.satelliteLayer.show();
        } else {
          this.satelliteLayer = new AMap.TileLayer.Satellite();
          this.amap.add(this.satelliteLayer);
        }
      }

      //echart 地图状态的 清除和回复
      //从echart 切换
      if (preMode === "echart" && mode !== "chart") {
        //清除 echarts
        this.emapController.clear();
      }
      //切换到 echart
      if (mode === "echart" && preMode !== "echart") {
        this.emapController.restore(); //恢复上一次的 option
        console.log("restore");
        //秦楚之前的 街镇着色
        // this.amapController.cancelColorTown();
      }

      this.mapMode = mode;
      //TODO: 显示高德地图 时销毁 echarts 实例 ，切换回来时再 重新渲染
    },
    //重置当前地图模式  的 缩放比例和 中心
    resetMap() {
      if (this.mapMode === "echart") {
        //DEBUG:
        this.emapController.setOptions({
          geo: {
            zoom: 1.3,
            map: "yc",
            center: null, //不指定中心
          },
        });
      } else {
        this.amap.setZoom(10.2);
        this.amapController.setCenter([105.896951, 29.256584]);
        this.amapController.showAllRisk(); //恢复 隐患展示
      }
      // this.startRefreshRisk(); //重新获取 隐患数据
    },
    //展示 城镇筛选 模态框
    showTownQuery() {
      this.townQueryVisible = true;
    },
    //筛选 条件选择完毕  结果返回
    townChoose(params) {
      console.log(params);
      this.data.townQueryParams = params;
      const center = getLocationCenter(params.town);
      this.switchMapMode("standard");
      if (params.smallTownCode !== "all") {
        this.amapController.setCenter(center, true);
        this.amap.setZoom(14, true); //设置为合适的 比例
      }
      //如果当前处于 时间轴 得模式
      if (this.timeLineVisible) {
        console.log("时间轴功能");
        console.log(params.dateStr);
      } else {
        //不处于 时间轴的 模式 就触发查询

        this.queryTowns();
      }
      this.townQueryVisible = false;
    },
    //根据TownQuery组件 传递的参数来 查询对应条件的隐患
    async queryTowns() {
      const {
        riskTypeCode,
        hiddenTroublesLevel,
        smallTownCode,
        town,
        riskStatus,
        dateStr,
      } = this.data.townQueryParams;
      this.spinning = true;

      console.log(dateStr);
      //判断是否 填 选了 all： 不限
      const params = {
        riskTypeCode: riskTypeCode === "all" ? null : riskTypeCode,
        hiddenTroublesLevel:
          hiddenTroublesLevel === "all" ? null : hiddenTroublesLevel,
        smallTownCode: smallTownCode === "all" ? null : smallTownCode,
        riskStatus,
      };
      //选择得是 时间范围
      if (dateStr instanceof Array) {
        params.reportDateStart = dateStr[0];
        params.reportDateEnd = dateStr[1];
      } else {
        params.reportDate = dateStr;
      }
      const { status, data, msg } = await queryByCondition(params);
      this.spinning = false;
      if (status !== 200) return this.$message.error(msg);
      console.log(data);
      if (data.length === 0) this.$message.info("隐患个数为零");

      this.amapController.drawRisk(data, true);
      this.bindRMakersEventHandler();
      //着色该街镇
      this.amapController.colorTown(town);
    },
    //关闭
    closeTownQuery() {
      this.townQueryVisible = false;
      if (this.timeLineVisible) this.timeLineVisible = false; //同时关闭时间轴
    },
    //展示 企业查询 抽屉
    showCQDrawer() {
      this.drawerType = "CQ";
      this.openRightDrawer();
    },
    //展示 企业筛选窗体
    openRightDrawer() {
      // this.addBtnYellow(e);
      if (this.townQueryVisible) this.closeTownQuery();
      this.closeRiskHover();
      if (this.timeLineVisible) this.closeTimeLine();
      this.mapsWapperSpan = 13;
      this.drawerSpan = 6;
      // 在dom 更新之后手动重新绘制
      this.$nextTick(() => {
        //容器改变 手动触发 重新绘制

        this.$nextTick(() => {
          //容器改变 手动触发 重新绘制
          let ele = null;
          if (this.mapMode !== "echart")
            //如果当前 不是 echart 模式
            ele = document.querySelector("#gaodemap");
          else ele = document.querySelector("#chart");
          const { width, height } = getComputedStyle(ele);
          this.echartMap.resize({
            width: parseInt(width),
            height: parseInt(height),
          });
          console.log("width modify");
          this.getMapWapperSize();
        });
      });

      const callback = () => {
        if (this.mapsWapperSpan > 13) {
          this.mapsWapperSpan -= 3;
          this.drawerSpan += 3;
          this.$nextTick(() => {
            //容器改变 手动触发 重新绘制
            this.echartMap.resize();
          });
          console.log(requestID);
        } else {
          cancelAnimationFrame(requestID);
        }
        console.log(requestID);
      };
      //使用 AnimationFrame动画帧绘制 动画
      // const requestID = requestAnimationFrame(callback);
    },
    //关闭 右侧抽屉
    closeRightDrawer() {
      // this.companyQueryVisible = false;
      this.drawerType = "none";
      this.mapsWapperSpan = 19;
      this.drawerSpan = 0;
      this.$nextTick(() => {
        //容器改变 手动触发 重新绘制
        let ele = null;
        if (this.mapMode !== "echart")
          //如果当前 不是 echart 模式
          ele = document.querySelector("#gaodemap");
        else ele = document.querySelector("#chart");
        const { width, height } = getComputedStyle(ele);
        this.echartMap.resize({
          width: parseInt(width),
          height: parseInt(height),
        });
        this.getMapWapperSize(); //重新计算 大小
        console.log("width increase ");
      });
    },
    //收藏 当前的地图状态  中心+缩放比例
    collectMapState() {
      const mapState = {
        center: [],
        amapZoom: this.amap.getZoom(),
        emapZoom: 0,
      };
      if (this.mapMode === "echart") {
        const { center } = this.echartMap.getOption().geo[0];
        mapState.center = center;
      } else {
        const center = this.amap.getCenter();
        mapState.center = [center.lng, center.lat];
      }
      //根据 当前地图类型 获取option
      const option =
        this.mapMode === "echart"
          ? this.echartMap.getOption()
          : this.emapController.preOption;
      const { zoom } = option.geo[0]; //获取 echarts缩放比例
      mapState.amapZoom = this.amap.getZoom();
      mapState.emapZoom = zoom;
      console.log(mapState);
      localStorage.setItem("mapState", JSON.stringify(mapState));
      this.$message.success("收藏成功");
    },
    //企业 查询 抽屉 选中一个 企业为中心
    //MARK: 移动中心 渲染企业检查点
    CompanyChoose(companyName) {
      console.log(companyName);
      const company = this.data.companyInfos.find(
        (item) => item.companyName === companyName
      );
      const { checkPointBOList, center } = company;

      console.log("query", checkPointBOList, center);
      // this.amapController.drawCompanyArea(
      //   { checkPointBOList, center, companyName },
      //   true
      // );
      //隐藏所有的 隐患
      // this.amapController.hideAllRisk();
      //渲染单个企业的 所有检查点
      this.amapController.drawCheckPoints(checkPointBOList);
      //绑定所有 检查点的 点击事件
      this.bindCPClickHandler();
      this.switchMapMode("standard"); //切换到 标准地图
      this.amap.setZoom(14, true); //设置为合适的 比例
      this.amapController.setCenter(center, true);
    },
    //关闭企业查询抽屉
    closeCompanyQuery() {
      //显示所有的 隐患
      this.amapController.showAllRisk();
      this.amapController.removeAllCheckPoints(); //移除显示的所有
      this.resetMap();
      this.closeRightDrawer();
      this.startRefreshRisk(); //重新获取 隐患数据
    },
    //重点关注企业排查 按钮点击 展示重点关注企业分布情况
    async showFocusedComponyClick(e) {
      if (this.showDataType === "focus_company") {
        this.amapController.removeAllCheckPoints(); //隐藏检查点
        this.drawAllCompanyArea(); //绘制 所有 企业
        this.showDataType = "risk"; //恢复 默认的 risk
        this.startRefreshRisk(); //获取 risk 数据并渲染
        return;
      }
      if (this.showDataType === "risk") {
        this.switchMapMode("standard");
      }
      //移除之前的 所有的risk  检查点
      this.amapController.removeAllRisk();
      this.amapController.removeAllCheckPoints();

      const { data, status } = await getFocuedCompanyInfos();
      if (status !== 200) return this.$message.error("请求失败");
      console.log(data);
      data.forEach(({ checkPointBOList, center, companyName }, index) => {
        //绘制 企业的检查点
        this.amapController.drawCheckPoints(checkPointBOList);
        if (index === 0) {
          //第一个企业清除 之前的
          this.amapController.drawCompanyArea(
            {
              checkPointBOList,
              center,
              companyName,
            },
            true
          );
        } else {
          this.amapController.drawCompanyArea({
            checkPointBOList,
            center,
            companyName,
          });
        }
      });
      // this.$message.info("展示重点关注企业");
      this.showDataType = "focus_company";
      this.bindCPClickHandler();
    },
    //展示所有企业的所有检查点
    async showAllCheckPointsClick() {
      if (this.showDataType === "all_cpoint") {
        this.amapController.removeAllCheckPoints(); //直接移除
        this.showDataType = "risk";
        this.startRefreshRisk(); //获取 risk 数据并渲染
        return;
      }
      if (this.showDataType === "risk") {
        this.switchMapMode("standard");
      }
      this.amapController.removeAllRisk();
      this.spinning = true;
      const { status, data, msg } = await getAllCheckPoints();
      if (status !== 200)
        return this.$message.error("数据请求失败，请检查网络");
      // console.log(data);
      // this.$message.info("显示所有的检查点");
      this.resetMap();
      // this.amapController.drawCheckPoints(data);
      this.amapController.drawCheckPoints(data);
      this.showDataType = "all_cpoint";
      //绑定所有 检查点的 点击事件
      this.spinning = false;
      this.bindCPClickHandler();
    },
    //关闭所有弹出框
    closeAllPupup() {
      if (this.townQueryVisible) this.closeTownQuery();
      if (this.drawerSpan !== 0) this.closeRightDrawer();
      if (this.RSHoverVisible) this.$refs.risk_hover.closeAll();
    },
    //显示 时间轴
    showTimeLine() {
      this.timeLineVisible = true;
      this.closeAllPupup();
      console.log(this.timeLineVisible);
      this.showTownQuery();
      console.log(this.timeLineVisible);
      // this.timeLineVisible = true;
    },
    //关闭时间轴
    closeTimeLine() {
      this.timeLineVisible = false;
      this.resetMap();
      console.log("close");
      this.startRefreshRisk(); //重新获取 隐患数据
    },
    //根据时间请求
    timelineQuery(date) {
      console.log(date);
      //更改查询条件
      this.data.townQueryParams.dateStr = date;
      this.queryTowns();
    },
    //给按钮添加 active黄色
    addBtnYellow(e) {
      console.log(e);
    },
    //在切换 地图显示模式时 保持 echarts 和 高德地图的 缩放比例和 一致
    syncMapState(toMode) {
      if (toMode === "echart") {
        //切换到 echart
        const amapZoom = this.amap.getZoom();
        const centerObj = this.amap.getCenter();
        const center = [centerObj.lng, centerObj.lat];
        console.log(center);
        const zoom = (amapZoom / 10.2) * 1.3;
        console.log(center, zoom, amapZoom);
        this.emapController.setCenter(center);
        console.log("sync to echart");
      } else {
        const { zoom: echartZoom, center } = this.echartMap.getOption().geo[0];
        const zoom = (echartZoom / 1.3) * 10.2;

        console.log(center, zoom, echartZoom);
        // this.amap.setZoom(zoom, true); //立即 过渡
        this.amapController.setCenter(center, true);
        console.log("sync to amap");
      }
    },
    //自动刷新风险数数据 建议后期 改成 //TODOwebsocket
    //TODO: 设置定时器  每个一段时间 进行请求 ，和之前的隐患信息 进行比较查看是否有新的隐患出现
    async startRefreshRisk() {
      // setInterval(() => {
      //   const risks = getRisks();
      //   console.log(risks);
      //   if (risks.length !== 0) {
      //     this.$message.warn("产生新的风险");
      //     this.amapController.drawRisk(risks);
      //   }
      // }, 1000);

      // console.log("risks", risks);
      // this.emapController.drawRisk(risks);
      // if (risks.length !== 0) {
      //   this.$message.warn("产生新的风险");
      //   // this.amapController.drawRisk(risks);
      //   this.emapController.drawRisk(risks);

      //   //添加闪烁
      //   const pathElements = document.querySelectorAll(".shinning");
      //   console.log(pathElements);
      //   //由于 style scoped 属性后 vue-loader 会给style 内的选择器加一个字符串，全部办成属性选择器，@keyframe 名称也会改变
      //   pathElements.forEach((ele) => {
      //     const checkpointid = ele.dataset.checkpointid;
      //     const risk = risks.find((item) => item.checkpointId == checkpointid);

      //     console.log(checkpointid);
      //     const timer = setInterval(() => {
      //       const pre = ele.style.fill;
      //       ele.style.fill = pre === "none" ? "#d81e06" : "none";
      //       this.data.risks.push();
      //     }, 1000);

      //     if (risk.timers) {
      //       risk.timers.push(timer);
      //     } else risk.timers = [timer];
      //     this.data.risks.push(risk); //保存 到Vue 实例，
      //   });
      //   console.log(risks);

      //   // setTimeout(() => {
      //   //   this.removeRisk();
      //   // }, 3000);
      // }

      // return ;
      const { data, status, msg } = await getUnsolvedRiskInfo();
      if (status !== 200) return this.$message.error("隐患信息请求失败");
      // console.log(data);
      this.data.risks = data;
      const istoClose = isRisksToClose(data);
      //存在两个风险点的位置距离太近
      if (istoClose) this.$message.warning("风险源 距离太近请放大之后查看");
      console.log("risks", data);
      if (data.length === 0) {
        this.$message.info("当前没有活跃的隐患");
      }
      this.drawRiskGlobal(data);
      //移除 之前的 街镇着色
      this.amapController.cancelColorTown();
    },
    // 全局 统一 绘制 隐患点位
    drawRiskGlobal(data) {
      this.emapController.drawRisk(data); //绘制隐患
      this.amapController.drawRisk(data);
      // this.amapController.drawRisk1(data);
      //绑定 两个地图风险 的事件
      //高德地图 每次都需要重新绑定 maker 事件处理函数  maker 要在 点位绘制之后才能 进行 事件绑定
      this.bindRMakersEventHandler();
    },
    //停止定时请求 隐患数据
    stopRefreshRisk() {
      // test
    },
    //风险解决 取消 动态显示
    removeRisk() {
      const solved = this.data.risks;

      // this.amapController.removeRisk(solved);
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
    //同时 设置两个地图的中心 并放大地图
    setBothMapCenter(position) {
      //高德地图 设置中心位置
      this.amapController.setCenter(position);
      this.amap.setZoom(14); //设置为合适的 比例
      //echart 地图 设置中心位置
      this.emapController.setCenter(position);
    },
    //展示右侧的 隐患信息展示 抽屉
    async showRiskList({ condition, isShowAll }) {
      if (isShowAll) {
        // this.closeRiskList();
        this.startRefreshRisk(); //显示全部 隐患数据
        return this.$message.info("显示所有隐患");
      }
      this.drawerType = "RL";
      this.spinning = true;
      console.log(condition);
      let res;
      if (condition.riskStatus !== "both") {
        //如果点击得视 等级标签 需要请求两个状态的 隐患数据
        res = await queryByCondition(condition);
        if (res.status !== 200) return this.$message.error("网络请求失败");
        console.log(res);
      } else {
        res = await getUnsolvedRiskInfoOfLevel(condition.hiddenTroublesLevel);
        // console.log(res);
      }
      console.log("res", res);
      const riskList = [];
      const data = res.data;
      data.forEach(
        ({ checkPointId, companyActiveRiskBOList, longitude, latitude }) => {
          riskList.push(
            ...companyActiveRiskBOList.map((risk) => {
              return {
                ...risk,
                checkPointId,
                position: [longitude, latitude],
              };
            })
          );
        }
      );
      console.log(riskList);
      this.data.RiskListData = riskList;
      this.spinning = false;
      this.openRightDrawer();
      this.drawRiskGlobal(data);
      // console.log(this.emapController.echartsIns.getOption());
      this.$message.info("对应的隐患加载成功");
    },
    //关闭 隐患列表抽屉
    closeRiskList() {
      this.data.RiskListData = []; //回收内存
      this.closeRightDrawer();
      //dom 更新了才 开始渲染
      this.$nextTick(() => {
        this.startRefreshRisk(); //重新开始 定时请求
      });
    },
    //隐患列表 item 的点击事件
    riskItemClick(index) {
      console.log(index);
      const { checkPointId, position } = this.data.RiskListData[index];
      console.log(checkPointId, position);
      this.RSHoverPosition.scatterPosition = position;
      this.RSHoverContent.riskList = this.data.risks.find(
        (checkpoint) => checkpoint.checkPointId === checkPointId
      ).hiddenTroubleList;

      //手动调用risk_hover 的函数 展示 三个窗体
      this.RSHoverVisible = true;
      this.$refs.risk_hover.riskItemClick(this.data.RiskListData[index]);
      // this.moveToCenter(); //将 scatterPosition 所处位置移动到 视图中心
      // console.log("riskItemClick");
      //更改state 组织echarts 在事件中 关闭
      // this.RSHoverState = "list_click";
      //手动调用 click 事件处理函数模拟 点击
      this.handlers.RHClickHandler();
    },
    showPItemList() {
      this.drawerType = "IL";
      this.openRightDrawer();
    },
    // closePItemList() {
    //   this.closeRightDrawer();
    // },
    //获取 $refs.map_wapper 的长宽
    getMapWapperSize() {
      //计算 maps_wapper 相对于视口的位置信息
      const {
        top: mapWapperTop,
        left: mapWapperLeft,
        right: mapWapperRight,
      } = this.$refs.map_wapper.getBoundingClientRect();
      this.RSHoverPosition.mapWapperTop = mapWapperTop;
      this.RSHoverPosition.mapWapperLeft = mapWapperLeft;
      this.RSHoverPosition.mapWapperRight = mapWapperRight;
      this.RSHoverPosition.mapWapperWidth = this.$refs.map_wapper.clientWidth;
      this.RSHoverPosition.mapWapperHeight = this.$refs.map_wapper.clientHeight;
    },
    //关闭 个人中心信息抽屉
    showUserCenter() {
      this.userCenterVisible = true;
    },
    //确认退出
    showExit() {
      this.exitModelVisible = true;
    },
    //登录
    //登出
    Logout() {
      this.$message.info("退出成功");
    },
    afterVisibleChange() {},
    //高德地图初始化
    // 弹框 popup的父元素
  },
  created() {
    this.getData();
    //获取天气信息
    // this.getWeatherData();
  },
  mounted() {
    // console.log("mounted");
    this.getMapWapperSize();
    const mapsWapperELe = document.querySelector(".maps_wapper");
    this.RSHoverPosition.mapsWapperWidth = mapsWapperELe.clientWidth; //只计算一次
  },
  //当前不活跃
  deactivated() {
    //清除所有定时器
    // console.log(this.risks, 0);
    // this.risks.forEach((item) => {
    //   const timers = item.timers;
    //   timers.forEach((timer) => {
    //     clearInterval(timer);
    //   });
    // });
  },
};
</script>

<style lang="less" scoped>
#one_map {
  //   height: 100%;
  overflow-x: hidden;
  flex-shrink: 0;
  width: 100%;
  color: #fff !important;
  background: url(../assets/img/window/bg.jpg);
  .ant-layout {
    background: none;
    .ant-layout-content {
      //  width: 96vw;
      //   margin: 10px auto;
      padding: 5px 80px;
      // margin:0 20px;
      /deep/ .ant-spin-container {
        height: calc(100vh - 80px - 20px); //spin 组件默认称其 整屏
      }
    }
  }

  .main {
    height: 100%;
    .maps_wapper {
      // background-image: url(../assets/img/window/bg4.png);
      background-size: 100% 100%;
      @maxHeight: 36px;
      @minHeight:@maxHeight* 23 /36;
      background-repeat: no-repeat;
      padding: @minHeight 0;
      box-sizing: border-box;
      height: 100%;
      display: flex;
      // margin-left: 20px;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      .map_bg {
        position: absolute;
        // z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        @marginTop:@minHeight - @maxHeight;
        @bodyheight:calc(100% - @minHeight - @marginTop); //MARK:
        .header {
          background-image: url(../assets/img/window/header_cover.png);
          height: @maxHeight;
          background-size: 102% @maxHeight;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
          z-index: 9;
          .title {
            font-weight: bold;
            font-size: 16px;
          }
        }
        .body {
          background-image: url(../assets/img/window/window_03.png);
          // margin
          height: @bodyheight;
          background-size: 100% @bodyheight;
          background-repeat: no-repeat;
          margin-top: @marginTop;
        }
      }
      #gaodemap {
        background-color: transparent !important;
        /deep/ .amap-markers {
          .amap-icon img {
            position: static;
          }
          .amap-marker-label {
            background-color: transparent;
            color: black;
          }
        }
      }
      .map_container {
        height: 100%;
        // width: calc(100% - 80px - 10px);
        width: 99%;
        margin: 0 auto;
        // background-color: #eeeeee;//FIXME
        // border: 1px solid #93ebf8;
      }
      .map_wapper {
        width: 94%;
        height: 100%;
      }
      .left_btns,
      .right_btns {
        position: relative;
        z-index: 9;
        width: 3%;
        // height: calc(100% - 208px - 10px);
        // height: 300px;
        height: 100%;
        margin: auto 0;
        // border: 1px solid #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .anticon {
          cursor: pointer;
        }
        @width: 100% - 10px; //定义 btn angle 的宽度
        //角
        .angle {
          // position: absolute;
          // height: 104px;
          width: @width;
          height: calc(100% - 266px - 50px - 25px - 150px); //高度响应式
          background-size: 100% 100%;
        }
        .angle_top {
          margin: 20px 0 4px 0;
        }
        .angle_bottom {
          margin: 4px 0 30px 0;
        }
        //旋转之前的图像
        .rotate {
          transform: rotate(180deg);
        }
        .btns_wapper {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          //
          width: @width;
          .btn {
            // width: @width;
            height: 50px;
            display: grid;
            margin-bottom: 4px;
            place-items: center;
            background-image: url(../assets/img/buttons/btn_bg.png);
            background-size: 100% 100%;
            cursor: pointer;
            i {
              background-size: 100% 100%;
              background-repeat: no-repeat;
              height: 20px;
              width: 20px;
              cursor: pointer;
            }
          }
          //取消最后一个btn 的下边距
          .btn:last-of-type {
            margin-bottom: 0px;
          }
          .red {
            background-image: url(../assets/img/buttons/btn_red.png);
          }
          .yellow {
            background-image: url(../assets/img/buttons/btn_yellow.png);
          }
        }
      }
      .left_btns {
        align-items: flex-start;
        .angle_top {
          background-image: url(../assets/img/window/left_top.png);
        }
        .angle_bottom {
          background-image: url(../assets/img/window/left_bottom.png);
        }
        .standard {
          // font-size: 18px;
          background-image: url(../assets/img/buttons/standard.png);
          // background-size: contain;
        }
        .together {
          background-image: url(../assets/img/buttons/together.png);
        }
        .undo {
          background-image: url(../assets/img/buttons/reset.png);
        }
        .satellite {
          background-image: url(../assets/img/buttons/satellite.png);
        }
      }
      .right_btns {
        align-items: flex-end;
        .angle_top {
          background-image: url(../assets/img/window/left_bottom.png);
        }
        .angle_bottom {
          background-image: url(../assets/img/window/left_top.png);
        }
        .collect {
          background-image: url(../assets/img/buttons/collect.png);
        }
        .risk {
          background-image: url(../assets/img/buttons/risk.png);
        }
      }
      /deep/.ant-tooltip-inner {
        background-color: #fff;
        color: black;
      }
      .unsolved_risk {
        // height: 50px;
        width: 150px;
        // border: 1px solid #fff;
        position: absolute;
        top: 6%;
        left: 50px;
        font-size: 14px;
        z-index: 9;
        padding-left: 20px;
        text-align: left;
      }
    }
    .left_side {
      display: flex;
      flex-direction: column;
      flex-grow: 0;
      // width:400px;
      justify-content: space-between;
      > section {
        // border: 1px solid #fff;
      }
    }
  }
  //左右侧的 划出 按钮
  .side_bar {
    > div {
      width: 30px;
      height: 70vh;
      position: fixed;
      // background-color: red;
      display: grid; //快速居中
      place-items: center;
    }
    .left_bar,
    .right_bar {
      top: 50%;
      position: fixed;
      transform: translateY(-50%);
      background-size: 100% 100%;
      .side_btn {
        background-size: 100% 100%;
        height: 26px;
        width: 18px;
        cursor: pointer;
      }
      .left_btn,
      .right_btn {
        background-image: url(../assets/img/buttons/side_btn.png);
      }
      .left_btn:hover,
      .right_btn:hover {
        background-image: url(../assets/img/buttons/side_btn_hover.png);
      }
    }
    .left_bar {
      left: 0;
      background-image: url(../assets/img/window/left_side.png);
    }
    .right_bar {
      right: 0;
      background-image: url(../assets/img/window/right_side.png);
      .right_btn {
        transform: rotate(180deg);
      }
    }
  }
  .risk_hover_modal_wapper {
  }
}
</style>