<template>
  <div class="param_modal">
    <div class="pm_container">

    </div>
    <a-modal
      :visible="visible"
      title="企业隐患筛选"
      @cancel="cancelHandler"
      @ok="okHandler"
      width="90vw"
      okText="查询"
      cancelText="取消"
      class="ant-modal-root"
      :getContainer="getContainer"
    >
      <div class="nav-search">
        <WindowBg />
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row>
              <a-col
                :md="5"
                :sm="24"
              >
                <a-form-item>
                  <a-select
                    v-model="queryParam.code"
                    placeholder="请选择街镇"
                  >
                    <a-select-option
                      v-for="(item,index) in townList"
                      :key="'town'+index"
                      :value="item.code"
                    >
                      {{ item.name}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :md="5"
                :sm="24"
              >
                <a-form-item>
                  <a-select
                    v-model="queryParam.hiddenTroublesLevel"
                    placeholder="请选择隐患类型"
                  >
                    <a-select-option value="">不限</a-select-option>

                    <a-select-option value="一般">一般</a-select-option>
                    <a-select-option value="低危">低危</a-select-option>
                    <a-select-option value="较大">较大</a-select-option>
                    <a-select-option value="重大">重大</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :md="5"
                :sm="24"
              >
                <a-form-item>
                  <a-select
                    v-model="queryParam.riskStatus"
                    placeholder="请选择处理情况"
                  >
                    <a-select-option value="">不限</a-select-option>
                    <a-select-option value="未处理">未处理</a-select-option>
                    <a-select-option value="处理中">处理中</a-select-option>
                    <!-- <a-select-option :value="3">处理完毕</a-select-option>
                    <a-select-option :value="4">已忽略</a-select-option> -->
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :md="5"
                :sm="24"
              >
                <a-form-item>
                  <a-select
                    v-model="queryParam.typeCode"
                    placeholder="请选择风险类型"
                  >
                    <a-select-option
                      v-for="(item,index) in riskList"
                      :key="'risk'+index"
                      :value="item.typeCode"
                    >
                      {{ item.typeName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :md="4"
                :sm="24"
              >
                <a-form-item>
                  <a-input
                    v-model="queryParam.companyName"
                    placeholder="企业名称"
                  />
                </a-form-item>
              </a-col>

            </a-row>
            <a-row>
              <a-col
                :md="10"
                :sm="24"
              >
                <a-form-item>
                  <a-range-picker
                    style="width:100%;"
                    :show-time="{ format: 'HH:mm' }"
                    format="YYYY-MM-DD HH:mm:ss"
                    @change="onChange"
                    :placeholder="['开始时间','结束时间']"
                    v-model="queryParam.data"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import WindowBg from "common/WindowBg";
import { getAllTown, getAllRisk } from "@/network/totalData";
import moment from "moment";
import "moment/locale/zh-cn";
export default {
  name: "ParamModal",
  props: {
    visible: {
      type: Boolean,
      reqiured: true,
    },
  },
  components: {
    WindowBg,
  },
  data() {
    return {
      queryParam: {},
      townList: [],
      riskList: [],
    };
  },
  methods: {
    /**
     * 获取所有城镇
     */
    getAllTown() {
      getAllTown().then((res) => {
        res.data.unshift({
          name: "全区",
          code: "",
        });
        this.townList = res.data;
      });
    },
    /**
     * 获取所有风险类型
     */
    getAllRisk() {
      getAllRisk().then((res) => {
        console.log(res.data, 0);
        res.data.unshift({
          typeName: "不限",
          typeCode: "",
        });
        this.riskList = res.data;
      });
    },
    /**
     * 选项时间
     */
    onChange(date) {
      this.queryParam.reportDateStart =
        date.length > 0 ? date[0].format("YYYY-MM-DD HH:mm:ss") : "";
      this.queryParam.reportDateEnd =
        date.length > 0 ? date[1].format("YYYY-MM-DD HH:mm:ss") : "";
    },
    cancelHandler() {
      this.$emit("update:visible", false);
    },
    okHandler() {
      this.$emit("update:visible", false);
      this.$emit("complete", this.queryParam);
    },
    getContainer() {
      return document.querySelector(".pm_container");
    },
  },
  created() {
    this.getAllTown();
    this.getAllRisk();
  },
};
</script>

<style scoped lang="less">
.param_modal {
  position: relative;
  // transform: translateX(1536px);
  .nav-search {
    // display: flex;
    // align-items: center;

    // padding: 15px;
    padding-bottom: 0;
    width: 100%;
    height: auto;
    // background: #FFF;
    margin: 0 auto;
    // margin-bottom: 20px;
    box-sizing: border-box;
    .ant-select-dropdown-menu::-webkit-scrollbar {
      display: none; /*隐藏滚动条*/
    }
  }
  .ant-modal-root {
    background-color: transparent;
    background: transparent;
    /deep/.ant-modal-content {
      .ant-modal-footer {
        border: none;
        padding: 0px 16px 3px 16px;
        > div {
          //撑开 footer 中按钮的容器高度
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>