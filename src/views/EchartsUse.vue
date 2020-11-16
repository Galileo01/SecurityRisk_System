<template>
  <div class="echarts-use">

    <div id="chart">
    </div>
    <a-drawer
      title="Basic Drawer"
      placement="right"
      :mask="false"
      :visible="drawerVisible"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
    >
      <p>{{drawerContent.name}}</p>
      <p>{{drawerContent.value}}</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
  </div>
</template>

<script>
import echarts from "echarts";
import scatterData from "useModule/temp";
const yongchaunJson = require("../assets/map/yongchuan.json"); //导入永川区 地图json并转换为对象
const chinaJson = require("../assets/map/china.json");
const cqJson = require("../assets/map/chongqing.json");
// console.log(scatterData);
export default {
  name: "Echarts",
  data() {
    return {
      chart: null,
      drawerVisible: false,
      drawerContent: {
        name: "",
        value: [],
      },
    };
  },
  methods: {
    //初始化 并渲染地图
    init() {
      this.chart = echarts.init(document.querySelector("#chart"));
      //注册地图
      echarts.registerMap("cq", cqJson);
      echarts.registerMap("china", chinaJson);
      echarts.registerMap("yongchuan", yongchaunJson);
      //FIXME: 若要给不同的等级 显示lengend ，那么就必须按照等级设置不同series，
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
        legend: {
          right: 10,
          orient: "vertical",
          data: ["level1", "level2", "level3", "level4"],
        },
        color: ["red", "blue", "green", "greenyellow"],
        geo: {
          map: "china",
          roam: true,
          zoom: 1,
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
        //   backgroundColor: "#404a59", // 图表背景色
        series: [
          {
            name: "level1",
            type: "scatter",
            coordinateSystem: "geo",
            data: scatterData[0],
            ...scatterProperyt,
          },
          {
            name: "level2",
            type: "scatter",
            coordinateSystem: "geo",
            data: scatterData[1],
            ...scatterProperyt,
          },
          {
            name: "level3",
            type: "scatter",
            coordinateSystem: "geo",
            data: scatterData[2],
            ...scatterProperyt,
          },
          {
            name: "level4",
            type: "scatter",
            coordinateSystem: "geo",
            data: scatterData[3],
            ...scatterProperyt,
          },
        ],
      };
      this.chart.setOption(option);
    },
    //绑定事件
    bindEventHandler() {
      //点击地图
      this.chart.on("click", "geo", (params) => {
        console.log(params);
        const { name } = params;
      });
      //箭头函数 绑定当前 Vue 实例
      //点击 离散点 触发的事件
      this.chart.on("click", "series.scatter", (params) => {
        console.log("click in scatter");
        const { name, value } = params;
        this.drawerContent.name = name;
        this.drawerContent.value = value;
        this.drawerVisible = true;
        console.log(params);
      });
    },
    // 通过Vue 实例代理
    setOption(option) {
      this.chart.setOption(option);
    },
    onClose() {
      this.drawerVisible = false;
    },
    afterVisibleChange() {},
  },
  created() {},
  mounted() {
    this.init();
    this.bindEventHandler();
  },
};
</script>

<style lang="less" scoped>
.echarts-use {
  .ant-col {
    border: 1px solid black;
  }
  .tool-bar {
    border: 1px solid red;
    height: 30px;
    display: flex;
    align-items: center;
    .anticon {
      cursor: pointer;
    }
  }
}
#chart {
  //   width: 1000px;
  height: 600px;
  margin: 0 auto;
}
</style>