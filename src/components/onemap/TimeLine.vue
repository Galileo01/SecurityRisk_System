<template>
  <div
    class="time_line"
    v-if="visible"
  >
    <h3>选择日期</h3>
    <!-- <a-slider id="test" :default-value="30" :disabled="disabled" /> -->
    <a-slider
      :marks="marks"
      :max="max"
      :included="false"
      v-model="number"
      :tooltipVisible="false"
      @change="dateChangeHandler"
    ></a-slider>

    <a-row
      type="flex"
      justify="end"
      class="btns"
    >
      <a-col :span="3">
        <a-button @click="resetDate">重置</a-button>
      </a-col>
    </a-row>
    <a-icon
      type="close-circle"
      :style="{fontSize:'20px'}"
      class="close_btn"
      @click="chooseDate"
    />
  </div>
</template>

<script>
import { getMonthLength } from "useModules/utils";
import moment from "moment";
export default {
  name: "TimeLine",
  data() {
    return {
      marks: {},
      defalutValue: 0,
      max: 30,
      number: 0,
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    choosedDate: {
      type: Date,
      required: true,
    },
  },
  computed: {
    month() {
      return this.choosedDate.getMonth();
    },
  },
  watch: {
    //监听 choosedDate 变化重新
    month() {
      this.computeMarks();
    },
  },
  methods: {
    //根据日期初始化 marks
    computeMarks() {
      const date = this.choosedDate;
      const curMonth = date.getMonth() + 1;
      this.defalutValue = new Date().getDate() - 1;
      const curDayCount = getMonthLength(date);
      // console.log("curDayCount", curDayCount);
      this.max = curDayCount;
      this.number = Math.min(this.max, this.defalutValue);
      for (let i = 0; i < curDayCount; i++) {
        this.marks[i] = `${curMonth} ` + (i + 1);
      }
    },
    getTooltipPopupContainer() {
      return document.querySelector(".time_line");
    },
    //重置刻度
    resetDate() {
      this.dateChangeHandler(Math.min(this.max, this.defalutValue));
    },
    dateChangeHandler(number) {
      this.number = number;
      const date = this.choosedDate;
      date.setDate(number + 1);
      // console.log(date);
      // console.log('chooseDate');
      this.$emit("chooseDate", moment(date).format("YYYY-MM-DD"));
    },
    //向父元素 传递事件
    chooseDate() {
      this.$emit("close");
    },
  },
  created() {
    this.computeMarks();
  },
};
</script>

<style scoped lang="less">
.time_line {
  h3 {
    color: #fff;
    font-size: 19px;
  }
  height: 170px;
  width: 80%;
  left: 50%;
  padding: 10px 20px;
  transform: translateX(-50%);
  position: absolute;
  bottom: 5%;
  //   background-color: #fff;
  //   background-color: transparent;
  background-color: rgba(25, 25, 26, 0.5);
  border: 1px solid #fff;
  border-radius: 4px;
  .ant-slider {
    margin-top: 10px;
    /deep/ .ant-slider-mark-text {
      color: #fff !important;
      margin: 0 auto;
      display: block;
      width: 16px;
      word-wrap: break-word;
    }
  }
  .btns {
    padding-top: 30px;
  }
  .close_btn {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
}
</style>