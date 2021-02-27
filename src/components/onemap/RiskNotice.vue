<template>
  <section class="risk_notice">
    <WindowBg :headerHeight="38" />
    <div class="header">
      <h3 class="title">隐患动态通知栏</h3>
    </div>
    <div class="notice_wapper">
      <a-row>
        <a-col :span="12">
          <div class="total">当前活动隐患: <span>{{total}}</span></div>
        </a-col>
        <a-col
          :span="6"
          :offset="2"
        >
          <a-switch
            checked-children="所有"
            un-checked-children="部分"
            default-checked
            :disabled="disabled"
            @click="emitEvent"
            v-model="isShowAll"
          />
        </a-col>
      </a-row>
      <a-row
        v-for="(item,index) in riskData"
        :key="index"
        type="flex"
        justify="space-between"
      >
        <a-col
          :span="4"
          @click="setCondition(index+1,'both')"
        >
          <div
            class="name"
            :style="{backgroundColor:LevelData[index].color}"
          >{{LevelData[index].name}}
          </div>
        </a-col>
        <a-col
          :span="14"
          v-if="item.unsolved===0&&item.solving===0"
        >[当前没有{{LevelData[index].name}}隐患]</a-col>
        <a-col
          :span="6"
          v-if="item.unsolved!==0||item.solving!==0"
          @click="setCondition(index+1,1)"
        >
          <div>待处理: {{item.unsolved}}</div>
        </a-col>
        <a-col
          :span="6"
          v-if="item.unsolved!==0||item.solving!==0"
          @click="setCondition(index+1,2)"
        >
          <div>处理中: {{item.solving}}</div>
        </a-col>
      </a-row>
    </div>
  </section>
</template>

<script>
import WindowBg from "common/WindowBg";
import { getStatusRiskCount } from "network/risk";
export default {
  name: "RiskNotice",
  data() {
    return {
      //当前 隐患的
      riskData: [],
      total: 0,
      condition: {
        //向 onemap 组件 发送的隐患查询条件
        hiddenTroublesLevel: "",
        riskStatus: "",
      },
      isShowAll: true, //开关的选中状态
    };
  },
  computed: {
    //等级颜色
    LevelData() {
      return this.$store.state.LevelData;
    },
    //开关禁用状态
    disabled() {
      return (
        this.condition.hiddenTroublesLevel === "" &&
        this.condition.riskStatus === ""
      );
    },
  },
  methods: {
    async getData() {
      const { status, data } = await getStatusRiskCount();
      if (status !== 200) return this.$message.error("数据请求失败，请重试");
      console.log(data);
      const level1 = data["低危"];
      const level2 = data["一般"];
      const level3 = data["较大"];
      const level4 = data["重大"];
      console.log(level1);
      const riskData = [
        {
          solving: level1[0] ? level1[0].count : 0,
          unsolved: level1[1] ? level1[1].count : 0,
        },
        {
          solving: level2[0] ? level2[0].count : 0,
          unsolved: level2[1] ? level2[1].count : 0,
        },
        {
          solving: level3[0] ? level3[0].count : 0,
          unsolved: level3[1] ? level3[1].count : 0,
        },
        {
          solving: level4[0] ? level4[0].count : 0,
          unsolved: level4[1] ? level4[1].count : 0,
        },
      ];
      const total = riskData.reduce((pre, cur) => {
        return pre + cur.unsolved + cur.solving;
      }, 0);
      // console.log(riskData);
      this.riskData = riskData;
      this.total = total;
    },
    //设置查询条件
    setCondition(level, status) {
      const statuses = ["未处理", "处理中"];
      this.condition.hiddenTroublesLevel = this.LevelData[level - 1].name;
      this.condition.riskStatus = statuses[status - 1];
      this.isShowAll = false;
      this.emitEvent();
    },
    //开关点击切换
    switchClick(checked) {
      console.log(checked);
      console.log(this.isShowAll);
    },
    //发送事件
    emitEvent() {
      this.$emit("risk-query", {
        condition: this.condition,
        isShowAll: this.isShowAll,
      });
    },
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
.risk_notice {
  height: 43%;
  background-size: 100% 100%;
  color: #fff;
  text-align: start;
  padding: 0 20px;
  display: grid;
  place-items: center;
  position: relative;

  .header {
    position: absolute;
    z-index: 3;
    top: 0;
    .title {
      line-height: 38px;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .notice_wapper {
    z-index: 4;
    font-size: 14px;
    width: 100%;
    .ant-row-flex {
      margin-top: 15px;
      .ant-col {
        text-align: end;
        cursor: pointer;
      }
    }
    .ant-row-flex:first-of-type {
      margin-top: 0;
    }
    .name {
      border-radius: 2px;
      padding: 2px;
      text-align: center;
      color: black;
    }
  }
}
</style>