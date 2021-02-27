<template>
  <div class="risk_list_drawer">
    <WindowBg :bottomHeight="10" />
    <h3 class="h_title">隐患列表</h3>
    <div class="content">
      <a-row
        type="flex"
        justify="space-between"
      >
        <a-col :span="7">企业</a-col>
        <a-col :span="3">等级</a-col>
        <!-- <a-col :span="6">历史风险</a-col> -->
        <a-col :span="7">描述</a-col>
        <a-col :span="5">上报时间</a-col>
        <!-- <a-col :span="5">最后上报</a-col> -->
      </a-row>
      <section class="risk_list">

        <a-row
          class="risk_item"
          v-for="(item,index) in listData"
          :key="index"
          type="flex"
          justify="space-between"
          @click.native="$emit('risk-item-click',index)"
        >

          <a-col
            :span="7"
            style="font-size:12px"
          >
          <a-tooltip
              placement="top"
              :title="item.companyName"
            >
              {{item.companyName}}
            </a-tooltip>
          </a-col>
          <a-col :span="3">{{item.riskLevel}}</a-col>
          <!-- <a-col :span="6">{{item.riskCount}}</a-col> -->
          <a-col :span="7">{{item.specification}}</a-col>
          <a-col :span="5">{{item.reportTime}}</a-col>
          <!-- <a-col :span="5">{{item.updateTime}}</a-col> -->
        </a-row>
        <div
          class="default"
          v-if="listData.length===0"
        >结果为空</div>
      </section>
    </div>
    <a-icon
      type="close-circle"
      :style="{fontSize:'20px',}"
      class="close_btn"
      @click="$emit('close')"
    />
  </div>
</template>

<script>
import WindowBg from "common/WindowBg";
import { queryCompanyByKeyword } from "network/company";
import { formatDate } from "useModules/utils";
export default {
  name: "RiskList",
  components: {
    WindowBg,
  },
  data() {
    return {
      keyword: "",
    };
  },
  props: {
    listData: Array, //后台获取到的企业 查询结果
  },
  computed: {
    LevelTexts() {
      return this.$store.getters.LevelTexts;
    },
  },
  methods: {
    formatDate(stamp) {
      return formatDate(new Date(stamp).toString(), "yyyy-MM-dd");
    },
  },
};
</script>

<style scoped lang="less">
.risk_list_drawer {
  overflow: hidden;
  //设置 抽屉样式
  // background-image: url(../../assets/img/window/slide_in.png);
  background-size: 100% 100%;
  background-color: transparent;
  padding: 10px 0;
  width: 100%;
  height: 100%;
  // padding: 40px 20px 10px 20px;
  position: relative;
  padding-top: 30px;
  .h_title {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 700;
    font-size: 16px;
    font-weight: bold;
    line-height: 30px;
  }
  font-size: 7px;
  .content {
    position: relative;
    padding: 10px 10px 0 10px;
  }
  .risk_list {
    overflow-y: scroll;
    height: calc(100vh - 80px - 30px - 60px);
    .ant-col {
      text-align: center;
      font-size: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .title {
      margin: 10px 0;
      font-size: 13px;
    }
    .btns {
      display: flex;
      justify-content: space-around;
    }
    .default {
      margin-top: 40px;
      text-align: center;
    }
    .risk_item {
      //   display: flex;
      //   justify-content: space-around;
      text-align: center;
      align-items: center;
      // box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
      // box-shadow: 0 2px 6px 0 #93ebf8;
      border: 1px solid #fff;
      border-radius: 5px;
      height: 30px;
      //   width: 90%;
      margin: 10px auto 0 auto;
      padding: 0 2px;
      cursor: pointer;
      //   color: #fff;
    }
    .risk_item:hover {
      background-color: #fff;
      box-shadow: none;
      color: black;
    }
  }
  .risk_list::-webkit-scrollbar {
    width: 6px;
  }
  .risk_list::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #fff;
    -webkit-transition: 0.3s background-color;
    transition: 0.3s background-color;
  }

  .close_btn {
    position: absolute;
    top: 100vh / 722px * 5px;
    right: 10px;
    cursor: pointer;
  }
}
</style>