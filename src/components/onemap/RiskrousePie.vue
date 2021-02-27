<template>
  <div class="risk_source">
    <WindowBg :headerHeight="36" />
    <div id="pie_container"></div>
  </div>
</template>

<script>
import WindowBg from "common/WindowBg";
import echarts from "echarts";
import { getLeveledRiskCount } from "network/risk";
export default {
  name: "RiskrousePie",
  data() {
    return {};
  },
  computed: {
    LevelData() {
      return this.$store.state.LevelData;
    },
  },
  methods: {
    //获取数据
    async getData() {
      const { status, data } = await getLeveledRiskCount();
      console.log(data);
      if (status !== 200) return this.$message.error("隐患数据请求失败");
      //根据 数据 生成 colors 和 legned
      // const colors=this.LevelColors.map(item)
      const colors = [];
      const legneds = [];
      const riskSource = data.map(({ count, risk_level }) => {
        const index = this.LevelData.findIndex(
          (item) => item.name === risk_level
        );
        const { color, name } = this.LevelData[index];
        colors.push(color);
        legneds.push(name);
        return {
          value: count,
          name: risk_level,
        };
      });
      console.log(riskSource);

      this.drawRiskSourcePie(riskSource,colors,legneds);
    },
    ////绘制 风险源 统计饼图
    drawRiskSourcePie(riskSource,colors,legneds) {
      // console.log(document.querySelector("#pie_container"));
      const pie = echarts.init(document.querySelector("#pie_container"));

      const option = {
        color: colors,
        title: {
          text: "全区风险源统计",
          left: "center",
          top: "7px",
          textStyle: {
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
          // top: "50",
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          left: "center",
          top: "20%",
          data: legneds,
          textStyle: {
            color: "#fff",
          },
        },
        series: {
          name: "风险",
          top: "5%",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: riskSource,
        },
      };
      pie.setOption(option);
    },
  },
  //保证元素 加载完毕 能够正常获取
  mounted() {
    this.drawRiskSourcePie();
  },
  created() {
    this.getData();
  },
  components: {
    WindowBg,
  },
};
</script>

<style scoped lang="less">
.risk_source {
  background-size: 100% 100%;
  height: 34%;
  padding-bottom: 15px;
  #pie_container {
    z-index: 3;
    height: 100%;
  }
  position: relative;
}
</style>