<template>
  <div class="page home">
    <a-layout>
      <Header
        ref="header"
        @headerChange="headerChange"
      />
      <!-- <keep-alive>
        <router-view></router-view>
      </keep-alive> -->
      <!-- <OneMap /> -->
      <a-layout-content>
        <section class="page_content">
          <div
            class="content_wapper"
            :style="{left}"
          >
            <OneMap ref="one_map" />
            <OneChart />
          </div>
        </section>
      </a-layout-content>
    </a-layout>
    <div class="side_bar">
      <div class="left_bar">
        <div
          class="left_btn side_btn"
          @click="pre"
        >
        </div>
      </div>
      <div class="right_bar">
        <div
          class="right_btn side_btn"
          @click="next"
        >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "common/Header";
const header_cover = require("../assets/img/window/header_cover.png");
import OneMap from "views/OneMap";
// const OneChart = () => import("views/OneChart2");
import OneChart from "views/OneChart2";
export default {
  components: {
    Header,
    OneMap,
    OneChart,
  },
  // mounted() {
  //   this.$router.push({ name: "OneMap" });//注释掉 因为跳转自身 会报错
  // },
  data() {
    return {
      currentPage: "OneMap",
      Width: 0,
      left: 0,
    };
  },
  methods: {
    headerChange(page) {
      if (page === "OneMap" && this.currentPage !== "OneMap") {
        this.pre();
      }
      if (page === "OneChart" && this.currentPage !== "OneChart") {
        this.next();
      }
    },
    changePage() {
      if (this.currentPage == "OneMap") {
        // this.$router.push({name:'OneChart'});
        this.currentPage = "OneChart";
        // this.$refs.header.btnClick(1);
      } else {
        // this.$router.push({name:'OneMap'});
        this.currentPage = "OneMap";
        this.$refs.header.btnClick(0);
      }
    },
    pre() {
      if (this.currentPage === "OneMap") return;
      this.left = "0px";
      this.currentPage = "OneMap";
      this.$refs.header.btnClick(0);
    },
    next() {
      if (this.currentPage === "OneChart") return;
      this.left = `-${this.Width}px`;
      this.currentPage = "OneChart";
      this.$refs.header.btnClick(1);
      this.$refs.one_map.closeRiskHover(); //关闭 risk_hover
    },
    //获取 页面的宽度
    getWidth() {
      this.Width = document.documentElement.clientWidth;
    },
  },
  mounted() {
    this.getWidth();
  },
};
</script>
<style lang="less" >
.home {
  height: 100%;
  overflow-x: hidden;
  color: #fff;
  background: url(../assets/img/window/bg.jpg);
  .ant-layout {
    background: none;
  }
  .page_content {
    width: 100vw;
    overflow: hidden;
    .content_wapper {
      display: flex;
      transition: left ease-in-out 0.5s;
      position: relative;
    }
  }

  //左右侧的 划出 按钮
  .side_bar {
    > div {
      width: 30px;
      height: 70vh;
      position: fixed;
      // background-color: red;
      display: grid; //快速居中
      place-items: center;
    }
    .left_bar,
    .right_bar {
      top: 50%;
      position: fixed;
      transform: translateY(-50%);
      background-size: 100% 100%;
      .side_btn {
        background-size: 100% 100%;
        height: 26px;
        width: 18px;
        cursor: pointer;
      }
      .left_btn,
      .right_btn {
        background-image: url(../assets/img/buttons/side_btn.png);
      }
      .left_btn:hover,
      .right_btn:hover {
        background-image: url(../assets/img/buttons/side_btn_hover.png);
      }
    }
    .left_bar {
      left: 0;
      background-image: url(../assets/img/window/left_side.png);
    }
    .right_bar {
      right: 0;
      background-image: url(../assets/img/window/right_side.png);
      .right_btn {
        transform: rotate(180deg);
      }
    }
  }
}
</style>