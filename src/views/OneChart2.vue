<template>
  <div class="one_chart">
    <ParamModal
      :visible.sync="paramVisible"
      @complete="completeHandler"
    />
    <div class="content">
      <a-row
        type="flex"
        justify="space-between"
        :gutter="20"
      >
        <a-col :span="5">
          <left-chart
            ref="leftChart"
            :queryParam="queryParam"
          />
        </a-col>
        <a-col :span="19">
          <right-chart
            :queryParam="queryParam"
            ref="rightChart"
            @showParamModel="showParamModel"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import leftChart from "@/components/OneChart/leftChart";
import rightChart from "@/components/OneChart/rightChart";
import ParamModal from "@/components/OneChart/ParamModal";
export default {
  components: {
    leftChart,
    rightChart,
    ParamModal,
  },
  data() {
    return {
      queryParam: {},
      paramVisible: false, //条件 查询对话框 是否可见
    };
  },
  methods: {
    /**
     * 查询按钮
     */
    query() {
      this.$refs.rightChart.$refs.tableTrouble.refresh(true);
      this.$refs.rightChart.$refs.infoTable.refresh(true);
      this.$refs.leftChart.getData();
    },
    //查询阐述 填写完毕
    completeHandler(queryParam) {
      console.log(queryParam);
      this.queryParam = queryParam;
      this.query(); //刷新 数据
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
    showParamModel() {
      this.paramVisible = true;
      console.log(this.paramVisible);
    },
  },
};
</script>
<style lang="less" scoped>
.one_chart {
  box-sizing: border-box;
  // padding: 20px 20px 0 20px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  .content {
    // height: 100%;
    height: calc(100vh - 80px - 20px);
    // box-sizing: border-box;
    // padding: 10px 80px;
    padding: 5px 60px;
    .ant-row-flex {
      height: 100%;
    }
    // flex: 1;
  }
}
</style>
<style lang="less" >
.ant-select-dropdown-menu::-webkit-scrollbar {
  display: none; /*隐藏滚动条*/
}
.table-page-search-wrapper {
  width: 100%;
  // background-color: #fff;
  padding: 20px 0px;
  border-radius: 8px;
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin: 15px;
      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
        text-align: left;
      }
      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }
  .ant-select-selection {
    background-color: transparent;
  }
  .ant-select-selection-selected-value,
  .ant-select-arrow-icon {
    color: #bfbfbf;
  }
  .ant-input {
    background-color: transparent;
    color: #bfbfbf;
  }
}

.ant-btn,
.ant-btn:hover,
.ant-btn:active,
.ant-btn:focus {
  background-color: transparent;
  color: #bfbfbf;
}
.ant-table-pagination {
  display: none;
}
.color {
  background-color: rgba(1, 6, 29, 0.5);
  color: #bfbfbf;
}
//偶
.nocolor {
  background-color: rgba(1, 6, 29, 0);
  color: #bfbfbf;
}
.ant-calendar-range-picker-input {
  background-color: transparent;
  color: #bfbfbf;
}
.ant-select-dropdown {
  background-color: #19191a;
  .ant-select-dropdown-menu-item {
    color: #bfbfbf;
  }
  .ant-select-dropdown-menu-item:hover,
  .ant-select-dropdown-menu-item-active,
  .ant-select-dropdown-menu-item-selected {
    background-color: transparent;
  }
}
.ant-calendar {
  background-color: #19191a;
  color: #bfbfbf;
  .ant-calendar-ok-btn,
  .ant-calendar-time-picker-btn-disabled {
    background-color: transparent;
    color: #bfbfbf !important;
  }
  .ant-calendar-input {
    background-color: #19191a;
    color: #bfbfbf;
  }
  .ant-calendar-date {
    color: #bfbfbf;
  }
  .ant-calendar-date:hover {
    color: #bfbfbf;
  }
  .ant-calendar-header .ant-calendar-century-select,
  .ant-calendar-header .ant-calendar-decade-select,
  .ant-calendar-header .ant-calendar-year-select,
  .ant-calendar-header .ant-calendar-month-select {
    color: #bfbfbf;
  }
  .ant-calendar-range .ant-calendar-in-range-cell::before {
    color: #19191a !important;
  }
}
.ant-table-placeholder {
  background: transparent !important;
  .ant-empty-description {
    color: #bfbfbf;
  }
}
</style>