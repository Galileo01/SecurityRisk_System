<template>
  <div class="town_query">
    <!--容器-->
    <div class="tq_modal_container">
    </div>
    <div class="select_dropdown_wapper">
    </div>
    <a-modal
      :visible="visible"
      title="街镇筛选"
      @cancel="cancelHandler"
      @ok="queryData"
      width="1200px"
      okText="查询"
      cancelText="取消"
      class="ant-modal-root"
      :getContainer="getModalContainer"
    >
      <div class="modal_content">
        <WindowBg />
        <!-- <div class="header">
          <h3>街镇查询</h3>
        </div> -->
        <a-form layout="inline">
          <a-form-item>
            <a-select
              v-model="query.type"
              style="width: 150px"
              placeholder="选择风险类型"
              :options="riskTypes"
              :getPopupContainer="getPopupContainer"
              allowClear
            >
              <!-- <a-select-option
              :key="item.value"
              :value="item.value"
              v-for="item in riskTypes"
            >{{item.label}}</a-select-option> -->

            </a-select>

          </a-form-item>
          <a-form-item>
            <a-select
              v-model="query.level"
              style="width: 150px"
              placeholder="选择风险等级"
              :options="LevelData"
              :getPopupContainer="getPopupContainer"
              allowClear
            >
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-spin :spinning="spinning">
              <a-select
                v-model="query.town"
                style="width: 120px"
                placeholder="选择街镇"
                :getPopupContainer="getPopupContainer"
                :options="towns"
                allowClear
                @click.native="_getTownList"
              >
                <!-- <a-select-option
                v-for="(item,index) in towns"
                :key="index"
                :value="item.code"
              >
                {{item.name}}
              </a-select-option> -->
              </a-select>
            </a-spin>
          </a-form-item>
          <a-form-item>
            <a-spin :spinning="spinning">
              <a-select
                v-model="query.riskStatus"
                style="width: 150px"
                placeholder="选择处理状态"
                :getPopupContainer="getPopupContainer"
                :options="statusList"
                allowClear
              >
                <!-- <a-select-option
                v-for="(item,index) in towns"
                :key="index"
                :value="item.code"
              >
                {{item.name}}
              </a-select-option> -->
              </a-select>
            </a-spin>
          </a-form-item>
          <a-form-item>
            <a-month-picker
              placeholder="选择月份"
              v-model="dates"
              format="YYYY-MM-DD"
              @change="timeChange"
              v-if="isTimeLine"
            />
            <a-range-picker
              style="width:90%;"
              :show-time="{ format: 'HH:mm' }"
              format="YYYY-MM-DD"
              @change="timeChange"
              :placeholder="['开始时间','结束时间']"
              v-model="dates"
              :getCalendarContainer="getPopupContainer"
              v-else
            />

          </a-form-item>
        </a-form>
        <div class="custom_btn">
          <a-button @click="reset">重置所有</a-button>
        </div>
      </div>
    </a-modal>
  </div>

</template>

<script>
import WindowBg from "common/WindowBg";
import { getTownList } from "network/map";
import { getRiskTypes, queryByCondition } from "network/risk";
export default {
  name: "TownQueryModal",
  components: {
    WindowBg,
  },
  data() {
    return {
      riskTypes: [],
      towns: [],
      query: {
        type: undefined,
        level: undefined,
        town: undefined,
        riskStatus: "",
        dateStr: [],
      },
      statusList: [
        {
          label: "不限",
          value: "",
        },
        {
          label: "未处理",
          value: "未处理",
        },
        {
          label: "处理中",
          value: "处理中",
        },
      ],
      dates: null,
      spinning: false,
    };
  },
  props: {
    visible: {
      type: Boolean,
      rquired: true,
    },
    //是否处于时间轴功能  时间轴功能下 只能允许选择一个月份
    isTimeLine: {
      type: Boolean,
      rquired: true,
    },
  },
  computed: {
    LevelData() {
      const LevelData = [
        {
          label: "不限",
          value: "all",
        },
      ];
      LevelData.push(
        ...this.$store.state.LevelData.map((item, index) => {
          return {
            label: item.name,
            value: item.name,
          };
        })
      );
      console.log(LevelData);
      return LevelData;
    },
  },
  methods: {
    async _getRiskTypes() {
      const { status, data, msg } = await getRiskTypes();
      if (status !== 200) return this.$message.error(msg);
      // console.log(data);
      const riskTypes = [
        {
          value: "all",
          label: "不限",
        },
      ];
      riskTypes.push(
        ...data.map((item) => {
          return {
            value: item.typeCode,
            label: item.typeName,
          };
        })
      );
      // console.log(riskTypes);
      this.riskTypes = riskTypes;
    },
    async _getTownList() {
      //只请求一次
      if (this.towns.length > 0) return;
      this.spinning = true;
      const { status, data, msg } = await getTownList();
      // console.log(status, data);
      if (status !== 200) return this.$message.error(msg);
      this.spinning = false;
      const towns = [
        {
          value: "all",
          label: "全区",
        },
      ];
      towns.push(
        ...data.map((item) => {
          return {
            value: item.code,
            label: item.name,
          };
        })
      );
      this.towns = towns;
    },
    // 发送事件
    queryData() {
      //获取名称
      if (!this.query.town) return this.$message.warning("请选择街镇");

      const town = this.towns.find((item) => item.value === this.query.town)
        .label;
      this.$emit("choose", {
        riskTypeCode: this.query.type,
        hiddenTroublesLevel: this.query.level,
        smallTownCode: this.query.town,
        town,
        dateStr: this.query.dateStr,
        riskStatus: this.query.riskStatus,
      });
    },
    //在选择了 风险类型和风险等级 之后 异步获取 对应的 城镇列表
    //   @change="levelChangeHandler"
    queryTowns() {
      this.spinning = true;
      // console.log();
      let timer = setTimeout(() => {
        this.towns = [
          {
            label: "三教镇",
            value: "三教镇",
          },
          {
            label: "南大街街道",
            value: "南大街街道",
          },
          {
            label: "仙龙镇",
            value: "仙龙镇",
          },
          {
            label: "朱沱镇",
            value: "朱沱镇",
          },
        ];
        clearTimeout(timer);
        timer = null;
        this.spinning = false;
      }, 200);
    },
    cancelHandler() {
      this.$emit("close");
      // this.reset();
    },
    //关闭 modal 之后 重置所有的数据
    reset() {
      this.query = {
        type: undefined,
        level: undefined,
        town: undefined,
        dateStr: [],
        riskStatus: "",
      };
      this.towns = [];
    },
    //风险等级  选择更改事件处理器
    levelChangeHandler(value) {
      // console.log(value);
      if (this.query.type !== undefined && this.query.level !== undefined) {
        this.queryTowns();
      }
    },
    //时间选择
    timeChange(dates, dateStr) {
      if (dates instanceof Array) {
        //如果是数组
        const [start, end] = dateStr;
        this.query.dateStr = [start, end];
      } else this.query.dateStr = dateStr;
      console.log(dates, dateStr);
    },
    //获取  整个 模态框的 容器
    getModalContainer() {
      return document.querySelector(".tq_modal_container");
    },
    //获取 选择 下拉 的容器
    getPopupContainer() {
      return document.querySelector(".select_dropdown_wapper");
    },
  },
  created() {
    this._getRiskTypes();
  },
};
</script>

<style scoped lang="less">
.town_query {
  //下拉容器

  //模态框的根 div
  .ant-modal-root {
    background-color: transparent;
    background: transparent;
    /deep/.ant-modal-content {
      background: transparent;
      // background-image: url(../../assets/img/window/left1.png);
      background-size: 100% 100%;
      border: none; //隐藏 border
      .ant-modal-close .ant-modal-close-x {
        line-height: 30px;
      }
      .ant-modal-header {
        position: relative;
        z-index: 3;
        background: none;
        border: none;
        padding: 0 20px;
        .ant-modal-title {
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          line-height: 30px;
        }
      }
      .ant-modal-body {
        padding: 10px 15px;
      }
      .ant-modal-footer {
        border: none;
        padding: 6px 16px;
        > div {
          //撑开 footer 中按钮的容器高度
          margin-bottom: 30px;
        }
      }

      /deep/.ant-form-item {
        .ant-select-selection {
          background-color: var(--window-color);
          .ant-select-selection__placeholder,
          .ant-select-selection-selected-value {
            color: #fff !important;
          }
        }
      }
    }
    /deep/ .ant-calendar-picker-input {
      background-color: transparent;
      color: #bfbfbf;
    }
  }
  //模态框内容
  .modal_content {
    .custom_btn {
      position: absolute;
      bottom: 32px;
      left: 60px;
    }
    //select 下拉栏

    // .ant-form{
    //   .ant-form-item{
    //     .ant-btn{

    //     }
    //   }
    // }

    // .modal_content ::-webkit-scrollbar {
    //   width: 1px;
    // }

    // /* 滚动槽 */
    // .modal_content::-webkit-scrollbar-track {
    //   border-radius: 10px;
    // }

    // /* 滚动条滑块 */
    // .risk_list::-webkit-scrollbar-thumb {
    //   border-radius: inherit;
    //   background-color: rgba(144, 147, 153, 0.3);
    //   -webkit-transition: 0.3s background-color;
    //   transition: 0.3s background-color;
    // }
  }
}
</style>