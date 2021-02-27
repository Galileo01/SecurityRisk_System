<template>
  <a-layout-header class="a_header">
    <div class="header_wapper">
      <div class="left">
        <div
          class="btn current"
          @click="btnClick(0)"
        >安全风险一张图</div>
        <!-- <div
          class="btn"
          @click="btnClick(1)"
        >统计分析1</div>
        <div
          class="btn"
          @click="btnClick(2)"
        >统计分析2</div> -->
      </div>
      <div class="title_wapper">
      </div>
      <div class="headerTitle">
        <h2>{{title}}</h2>
      </div>
      <div class="right">
        <div
          class="btn"
          @click="btnClick(1)"
        >安全风险一张表</div>
        <!-- <div
          class="btn"
          @click="btnClick(4)"
        >统计分析4</div>
        <div
          class="btn"
          @click="btnClick(5)"
        >统计分析5</div> -->
      </div>
    </div>
  </a-layout-header>

</template>

<script>
export default {
  name: "OneMapHeader",
  props: {
    title: {
      type: String,
      default: "永川区安全风险源动态管理系统",
    },
  },
  data() {
    return {
      btnElements: [],
    };
  },
  methods: {
    btnClick(index) {
      this.btnElements.forEach((ele, i) => {
        if (i !== index) {
          ele.classList.remove("current"); //先移除
        } else ele.classList.add("current");
      });
      if (index == 0) {
        // this.$router.push({ name: "OneMap" });
        this.$emit("headerChange", "OneMap");
      } else {
        // this.$router.push({ name: "OneChart" });
        this.$emit("headerChange", "OneChart");
      }
    },
  },
  mounted() {
    this.btnElements = document.querySelectorAll(".header_wapper .btn"); //获取元素
  },
};
</script>

<style scoped lang="less">
.a_header {
  padding: 0 30px;
  height: 80px;
  background: none;
}
.header_wapper {
  height: 100%;
  color: #fff;
  display: flex;
  justify-content: space-between;
  // background-image: url(../../assets/img/window/header.png);
  background-image: url(../../assets/img/window/header_other.png);
  
  background-size: 100% 14px;
  background-position: 0 10px;
  background-repeat: no-repeat;
  // border: 1px solid #93ebf8;
  @keyframes moves {
    0% {
      filter: brightness(100%);
    }
    100% {
      filter: brightness(230%);
    }
  }
  .title_wapper {
    background: transparent;
    width: 53%;
    text-shadow: 0px 0px 10px #f2cb61;
    // background-color: black;
    background: url(../../assets/img/window/headnew.png);
    // background-image: url(../../assets/img/window/danger.gif);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    animation: moves 1.5s infinite; /*animation 时间 播放次数*/
    text-align: center;
    background-color: black;
  }

  .headerTitle {
    display: block;
    margin: 0 auto;
    font-weight: 700;
    font-size: 15px;
    color: white;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    h2 {
      color: white;
      // font-size: ;
    }
  }

  .left,
  .right {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    // justify-content: space-between;

    margin-top: 30px;
    .btn {
      background-image: url(../../assets/img/buttons/header_btn.png);
      width: 150px;
      height: 40px;
      background-size: 100% 100%;
      // line-height:40px;
      line-height: 40px;
      cursor: pointer;
      // color:black;
    }
    .current {
      background-image: url(../../assets/img/buttons/header_btn_current.png);
      color: #f2cb61;
    }
  }
}
</style>