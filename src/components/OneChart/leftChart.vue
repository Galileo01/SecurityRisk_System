<template>
  <div class="left_chart">
    <div class="risk_type chart-head">
      <WindowBg :headerHeight="32" />
      <div class="title">
        <h3>隐患类型</h3>
      </div>
      <div
        ref="troubleChart"
        class="chart"
      >
      </div>
    </div>
    <div class="deal-status chart-head">
      <WindowBg :headerHeight="32" />
      <div class="title">
        <h3>处理情况</h3>
      </div>
      <div
        ref="dealChart"
        class="chart"
      >

      </div>
    </div>
    <div class="risk-tender chart-head">
      <WindowBg :headerHeight="32" />
      <div class="title">
        <h3>隐患趋势</h3>
      </div>
      <div
        ref="trendChart"
        class="chart"
      >

      </div>
    </div>
  </div>
</template>
<script>
import WindowBg from "components/common/WindowBg";
import { countHiddenBySmallTowns } from "@/network/totalData";
import echarts from "echarts";
export default {
  components: {
    WindowBg,
  },
  props: {
    queryParam: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      troubleChart: null,
      dealChart: null,
      trendChart: null,
      troubleData: {
        xAxis: [],
        bigData: [],
        thanData: [],
        normalData: [],
        downData: [],
      },
      dealData: {
        xAxis: [],
        willData: [],
        doingDeal: [],
        dealedlData: [],
        ignoreData: [],
      },
    };
  },
  mounted() {
    this.getData();
    window.addEventListener("resize", () => {
      this.troubleChart.resize();
      this.dealChart.resize();
      this.trendChart.resize();
    });
  },
  methods: {
    getData() {
      this.countHiddenBySmallTowns()
        .then(() => {
          this.initTroubleChart();
          this.initTrendChart();
        })
        .catch((err) => {
          this.$message.error("请求失败");
        });
      this.getStatusData()
        .then(() => {
          this.initDealChart();
        })
        .catch((err) => {
          this.$message.error("请求失败");
        });
    },
    countHiddenBySmallTowns() {
      var obj = Object.assign({}, this.queryParam);
      obj.type = "level";
      return new Promise((resolve, reject) => {
        this.troubleData.xAxis.length = 0;
        this.troubleData.bigData.length = 0;
        this.troubleData.thanData.length = 0;
        this.troubleData.normalData.length = 0;
        this.troubleData.downData.length = 0;
        countHiddenBySmallTowns(obj)
          .then((res) => {
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index];
              this.troubleData.xAxis.push(element.smallTownName);
              this.troubleData.bigData.push(element.level4);
              this.troubleData.thanData.push(element.level3);
              this.troubleData.normalData.push(element.level2);
              this.troubleData.downData.push(element.level1);
            }
            resolve("success");
          })
          .catch((err) => {
            this.$message.error("请求失败");
          });
      });
    },
    getStatusData() {
      var obj = Object.assign({}, this.queryParam);
      obj.type = "status";
      return new Promise((resolve, reject) => {
        countHiddenBySmallTowns(this.queryParam).then((res) => {
          this.dealData.xAxis.length = 0;
          this.dealData.willData.length = 0;
          this.dealData.doingDeal.length = 0;
          this.dealData.dealedlData.length = 0;
          this.dealData.ignoreData.length = 0;
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index];
            this.dealData.xAxis.push(element.smallTownName);
            this.dealData.willData.push(element.status1);
            this.dealData.doingDeal.push(element.status2);
            this.dealData.dealedlData.push(element.status3);
            this.dealData.ignoreData.push(element.status4);
          }
          resolve("success");
        });
      });
    },
    initTroubleChart() {
      this.troubleChart = echarts.init(this.$refs.troubleChart);
      var option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          itemWidth: 8,
          itemHeight: 8,
          data: ["重大", "较大", "一般", "低危"],
          textStyle: {
            color: "#bfbfbf",
          },
        },
        grid: {
          top: 20,
          bottom: 50,
        },
        xAxis: {
          data: this.troubleData.xAxis,
          splitLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: "white", //坐标值得具体的颜色,
              fontWeight: 600,
            },
          },
          axisLine: {
            lineStyle: {
              color: "#bfbfbf", //坐标值得具体的颜色
            },
          },
        },
        yAxis: {
          splitLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#bfbfbf", //坐标值得具体的颜色
            },
          },
          axisLine: {
            lineStyle: {
              color: "#bfbfbf", //坐标值得具体的颜色
            },
          },
        },
        series: [
          {
            name: "重大",
            type: "bar",
            stack: "使用情况",
            data: this.troubleData.bigData,
            itemStyle: {
              normal: { color: "rgb(252,9,21)" },
            },
          },
          {
            name: "较大",
            type: "bar",
            stack: "使用情况",
            data: this.troubleData.thanData,
            itemStyle: {
              normal: { color: "rgb(253,191,45)" },
            },
          },
          {
            name: "一般",
            type: "bar",
            stack: "使用情况",
            data: this.troubleData.normalData,
            itemStyle: {
              normal: { color: "rgb(255,253,56)" },
            },
          },
          {
            name: "低危",
            type: "bar",
            stack: "使用情况",
            data: this.troubleData.downData,
            itemStyle: {
              normal: { color: "rgb(16,114,189)" },
            },
          },
        ],
      };
      this.troubleChart.setOption(option, true);
    },
    initDealChart() {
      this.dealChart = echarts.init(this.$refs.dealChart);
      var option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          itemWidth: 8,
          itemHeight: 8,
          data: ["未处理", "处理中", "已处理", "已忽略"],
          textStyle: {
            color: ":#bfbfbf",
          },
        },
        grid: {
          top: 20,
          bottom: 50,
        },
        xAxis: {
          data: this.dealData.xAxis,
          splitLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: "white", //坐标值得具体的颜色,
              fontWeight: 600,
            },
          },
          axisLine: {
            lineStyle: {
              color: "#bfbfbf", //坐标值得具体的颜色
            },
          },
        },
        yAxis: {
          splitLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#bfbfbf", //坐标值得具体的颜色
            },
          },
          axisLine: {
            lineStyle: {
              color: "#bfbfbf", //坐标值得具体的颜色
            },
          },
        },
        series: [
          {
            name: "未处理",
            type: "bar",
            stack: "使用情况",
            data: this.dealData.willData,
            itemStyle: {
              normal: { color: "rgb(13,86,132)" },
            },
          },
          {
            name: "处理中",
            type: "bar",
            stack: "使用情况",
            data: this.dealData.doingDeal,
            itemStyle: {
              normal: { color: "rgb(253,145,57)" },
            },
          },
          {
            name: "已处理",
            type: "bar",
            stack: "使用情况",
            data: this.dealData.dealedlData,
            itemStyle: {
              normal: { color: "rgb(221,44,59)" },
            },
          },
          {
            name: "已忽略",
            type: "bar",
            stack: "使用情况",
            data: this.dealData.ignoreData,
            itemStyle: {
              normal: { color: "rgb(100,212,214)" },
            },
          },
        ],
      };
      this.dealChart.setOption(option, true);
    },
    initTrendChart() {
      this.trendChart = echarts.init(this.$refs.trendChart);
      var option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["重大", "较大", "一般", "低危"],
          textStyle: {
            color: ":#bfbfbf",
          },
        },
        grid: {
          top: 20,
          bottom: 50,
        },
        toolbox: {
          feature: {
            // saveAsImage: {}
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.troubleData.xAxis,
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: "white", //坐标值得具体的颜色,
              fontWeight: 600,
            },
          },
          axisLine: {
            lineStyle: {
              color: "#bfbfbf", //坐标值得具体的颜色
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "#bfbfbf", //坐标值得具体的颜色
            },
          },
          axisLine: {
            lineStyle: {
              color: "#bfbfbf", //坐标值得具体的颜色
            },
          },
        },
        series: [
          {
            name: "重大",
            type: "line",
            stack: "使用情况",
            data: this.troubleData.bigData,
            itemStyle: {
              normal: { color: "rgb(252,9,21)" },
            },
          },
          {
            name: "较大",
            type: "line",
            stack: "使用情况",
            data: this.troubleData.thanData,
            itemStyle: {
              normal: { color: "rgb(253,191,45)" },
            },
          },
          {
            name: "一般",
            type: "line",
            stack: "使用情况",
            data: this.troubleData.normalData,
            itemStyle: {
              normal: { color: "rgb(255,253,56)" },
            },
          },
          {
            name: "低危",
            type: "line",
            stack: "使用情况",
            data: this.troubleData.downData,
            itemStyle: {
              normal: { color: "rgb(16,114,189)" },
            },
          },
        ],
      };
      this.trendChart.setOption(option, true);
    },
  },
};
</script>
<style lang="less" scoped>
.left_chart {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .chart-head {
    position: relative;
    padding-top: 32px;
    height: 32%;
    width: 100%;
    // background-image: url(../../assets/img/window/left2.png);
    background-size: 100% 100%;
    border-radius: 8px;
    .title {
      position: absolute;
      top: 0px;
      left: 50%;
      
      transform: translateX(-50%);
      //   text-align: center;
      h3 {
        color: black;
        font-size: 17px;
        font-weight: 600;
        line-height: 32px;
        margin:0;
      }
    }
  }

  .chart {
    height: 100%;
    width: 100%;
  }
}
</style>