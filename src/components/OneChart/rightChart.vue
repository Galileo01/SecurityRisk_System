<template>
  <div class="right_chart">
    <WindowBg :headerHeight="32" />
    <a-tabs v-model="activeKey">
      <a-tab-pane
        key="1"
        tab="隐患情况"
      >
        <div class="table-info">
          <a-row
            type="flex"
            justify="end"
          >
            <a-col :span="3">
              <a-button
                class="out-btn"
                @click="exportCompanySituation"
              >导出excel</a-button>
            </a-col>
            <a-col :span="3">
              <a-button
                type="primary"
                @click="$emit('showParamModel')"
              >填写查询条件</a-button>
            </a-col>

          </a-row>
          <div class="table-content">
            <s-table
              ref="tableTrouble"
              size="small"
              rowKey="id"
              :columns="columnsTrouble"
              :data="loadDataTrouble"
              :alert="false"
              :scroll="{ y: tableHeight }"
            >
              <span
                slot="serial"
                slot-scope="text, record, index"
              >
                {{ index + 1 }}
              </span>
              <span
                slot="action"
                slot-scope="text, record"
              >
                <template>
                  <a>查看检查点</a>
                </template>
              </span>
            </s-table>
          </div>

        </div>
      </a-tab-pane>
      <a-tab-pane
        key="2"
        tab="企业情况"
        force-render
      >
        <div class="table-info">

          <a-row
            type="flex"
            justify="end"
          >
            <a-col :span="3">
              <a-button
                class="out-btn"
                @click="exportCompanySituation"
              >导出excel</a-button>
            </a-col>
            <a-col :span="3">
              <a-button
                type="primary"
                @click="$emit('showParamModel')"
              >填写查询条件</a-button>
            </a-col>

          </a-row>
          <div class="table-content">
            <s-table
              ref="infoTable"
              size="small"
              rowKey="id"
              :columns="columnsInfo"
              :data="loadDataInfo"
              :alert="false"
              :scroll="{ y: tableHeight }"
            >
              <span
                slot="serial"
                slot-scope="text, record, index"
              >
                {{ index + 1 }}
              </span>

              <span
                slot="action"
                slot-scope="text, record"
              >
                <template>
                  <a
                    @click="seePoint(record)"
                    class="operat-check"
                  >查看检查点</a>
                </template>
              </span>
            </s-table>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <div class="check_item_container">

    </div>
    <a-modal
      title="检查项"
      :visible="visible"
      @ok="visible=false"
      @cancel="visible=false"
      width="700px"
      class="ant-modal-root"
      :getContainer="getContainer"
    >
      <WindowBg />
      <a-collapse v-show="pointItemList.length>0">
        <a-collapse-panel
          v-for="(item,index) in pointItemList"
          :key="index"
          :header="item.checkPointName"
        >
          <a-collapse>
            <a-collapse-panel
              v-for="(itemItem,indexItem) in item.companyCheckItemList"
              :key="indexItem"
              :header="itemItem.checkItemName"
            >
              <div class="point-item">
                <div class="point-title">
                  <p>排查周期:</p>
                </div>
                <p class="content">
                  <span v-if="itemItem.needWeekly===1">周</span>
                  <span v-else-if="itemItem.needDaily===1">日</span>
                  <span v-else>月</span>
                </p>
              </div>
              <div class="point-item">
                <div class="point-title">
                  <p>分类名:</p>
                </div>
                <p class="content">{{itemItem.categoryName || '--'}}</p>
              </div>
              <div class="point-item">
                <div class="point-title">
                  <p>风险等级:</p>
                </div>
                <p class="content">{{itemItem.riskLevel || '--'}}</p>
              </div>

            </a-collapse-panel>
          </a-collapse>
        </a-collapse-panel>
      </a-collapse>
      <div
        class="empty"
        v-if="pointItemList.length===0"
      >
        无检查项
      </div>
    </a-modal>
  </div>
</template>
<script>
import WindowBg from "components/common/WindowBg";
import STable from "@/components/Table/index";
import {
  exportAllHiddenInfoByCondition,
  exportCompanySituation,
  companySituation,
  getAllCheckPoint,
  getAllCheckItem,
  getAllHiddenInfoByCondition,
  getAllCheckPointAndItem,
} from "@/network/totalData";
const columnsTrouble = [
  {
    title: "所属企业",
    dataIndex: "companyName",
    scopedSlots: { customRender: "describe" },
  },
  {
    title: "风险等级",
    children: [
      {
        title: "重大",
        dataIndex: "level4",
        scopedSlots: { customRender: "describe" },
      },
      {
        title: "较大",
        dataIndex: "level3",
        scopedSlots: { customRender: "describe" },
      },
      {
        title: "一般",
        dataIndex: "level2",
        scopedSlots: { customRender: "describe" },
      },
      {
        title: "低",
        dataIndex: "level1",
        scopedSlots: { customRender: "describe" },
      },
    ],
  },
  {
    title: "处理状态",
    children: [
      {
        title: "已处理",
        dataIndex: "status3",
        scopedSlots: { customRender: "description" },
      },
      {
        title: "未处理",
        dataIndex: "status1",
        scopedSlots: { customRender: "description" },
      },
      {
        title: "处理中",
        dataIndex: "status2",
        scopedSlots: { customRender: "description" },
      },
      {
        title: "已忽略",
        dataIndex: "status4",
        scopedSlots: { customRender: "description" },
      },
    ],
  },
  {
    title: "开始时间",
    dataIndex: "reportDateStart",
    scopedSlots: { customRender: "description" },
  },
  {
    title: "结束时间",
    dataIndex: "reportDateEnd",
    scopedSlots: { customRender: "description" },
  },
  {
    title: "所属街镇",
    dataIndex: "smallTownName",
    scopedSlots: { customRender: "description" },
  },
];
const columnsInfo = [
  {
    title: "企业名称",
    dataIndex: "companyName",
    scopedSlots: { customRender: "description" },
  },
  {
    title: "营业执照",
    dataIndex: "licenseCode",
    scopedSlots: { customRender: "description" },
  },
  {
    title: "检查点",
    dataIndex: "checkPointNum",
    scopedSlots: { customRender: "description" },
  },
  {
    title: "操作",
    dataIndex: "action",
    width: "150px",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  components: {
    STable,
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
    this.columnsTrouble = columnsTrouble;
    this.columnsInfo = columnsInfo;
    return {
      loadDataInfo: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return companySituation(requestParameters)
          .then((res) => {
            return res;
          })
          .catch((err) => {
            this.$message.error("请求失败");
          });
      },
      loadDataTrouble: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return getAllHiddenInfoByCondition(requestParameters)
          .then((res) => {
            return res;
          })
          .catch((err) => {
            this.$message.error("请求失败");
          });
      },
      visible: false,
      pointItemList: [],
      activeKey: "1",
      tableHeight: 0,
    };
  },
  methods: {
    exportTrouble() {
      exportAllHiddenInfoByCondition(this.queryParam)
        .then((res) => {
          const blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
          });
          const downloadElement = document.createElement("a");
          const href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          // 转换文件文字为中文
          downloadElement.download = decodeURI(
            res.headers["content-disposition"].split("=")[1]
          );
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch((err) => {
          this.$message.error("请求失败");
        });
    },
    exportCompanySituation() {
      exportCompanySituation(this.queryParam)
        .then((res) => {
          const blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
          });
          const downloadElement = document.createElement("a");
          const href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          // 转换文件文字为中文
          downloadElement.download = decodeURI(
            res.headers["content-disposition"].split("=")[1]
          );
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch((err) => {
          this.$message.error("请求失败");
        });
    },
    seePoint(record) {
      let { companyId } = { ...record };
      getAllCheckPointAndItem(companyId).then((res) => {
        if (res.code == 0) {
          this.visible = true;
          this.pointItemList = res.data;
        }
      });
    },
    calTabaleHeight() {
      const wapperHeight = parseInt(
        getComputedStyle(document.querySelector(".right_chart")).height
      );
      console.log(wapperHeight);
      this.tableHeight = wapperHeight * 0.66;
    },
    getContainer() {
      return document.querySelector(".check_item_container");
    },
  },
  mounted() {
    this.calTabaleHeight();
  },
};
</script>
<style lang="less" scoped>
.ant-spin-container {
  height: auto;
}
.out-btn {
  // float:right;
  margin-bottom: 10px;
  margin-right: 15px;
  cursor: pointer;
}
.point-item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 11px;
  .content {
    margin-left: 8px;
    flex: 1;
  }
  .point-title {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.table-info {
  position: relative;
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 0 10px;
  .table-content {
    height: 90%;
    padding-bottom: 20px;
    width: 100%;
  }
  /deep/ .ant-table-content {
    height: 90%;
  }
  .table-content::-webkit-scrollbar {
    display: none; /*隐藏滚动条*/
  }
  .title {
    color: black;
    font-size: 17px;
    font-weight: 600;
    text-align: center;
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
  }
  .operat-check {
    color: #fff;
    text-decoration: underline;
  }
}
</style>


<style lang="less" scoped>
.right_chart {
  height: 100%;
  /deep/ .ant-tabs {
    height: 100%;
    .ant-tabs-bar {
      border: none;
    }
    .ant-tabs-tab {
      font-weight: 600;
      padding: 4px 16px;
      font-size: 16px;
    }
  }
  /deep/ .ant-table {
    .ant-table-header-column {
      color: #fff;
    }
    .ant-table-header {
      margin-bottom: 0 !important;
    }
    .ant-table-body {
      background: transparent !important;

      .ant-table-row,
      .color {
        background: transparent !important;
      }
      .ant-table-row:hover {
        color: black !important;
        .operat-check {
          color: black !important;
        }
      }
    }
    .ant-table-thead > tr > th {
      font-weight: 800;
    }
  }
  .check_item_container {
    /deep/.ant-modal-root {
      .ant-collapse {
        background: transparent;
        position: relative;
        .ant-collapse-item {
          color: #fff !important;
          .ant-collapse-header,
          .ant-collapse-content {
            background: transparent;
            color: #fff !important;
          }
        }
        .ant-collapse-header {
          font-size: 13px;
        }
      }
    }
    .empty {
      position: relative;
      color: #fff;
    }
  }
}
</style>