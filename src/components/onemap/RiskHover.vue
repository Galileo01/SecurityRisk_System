<template>
  <div
    class="risk_hover"
    v-show="visible"
    :style="{left:left+'px',top:top+'px'}"
  >
    <section
      class="list_content"
      v-show="listVisible"
      :style="{padding:listVisible?'10px':'0'}"
    >
      <h3>隐患信息</h3>
      <div class="risk_list">
        <a-row
          type="flex"
          justify="space-around"
        >
          <a-col :span="14">隐患描述</a-col>
          <a-col :span="6">位置</a-col>
          <a-col :span="4">隐患等级</a-col>

        </a-row>
        <a-row
          v-for="(item,index) in riskList"
          :key="index"
          class="risk_item"
          type="flex"
          justify="space-around"
          @click.native="riskItemClick(item,$event)"
        >
          <!--MARK:-->
          <a-col :span="14">
            <div class="desc text-overflow-one">
              {{item.specification}}
            </div>
          </a-col>
          <a-col :span="6">{{item.checkPointName}}</a-col>
          <a-col :span="4">{{item.riskLevel}}</a-col>

        </a-row>
      </div>
    </section>
    <a-icon
      class="rh_close"
      type="close-circle"
      v-show="listVisible"
      @click="closeIconCLick"
    ></a-icon>
    <section
      class="window_wapper"
      v-show="!listVisible"
      :style="{left:left+'px',top:top+'px'}"
    >

      <div
        class="line line1"
        :style="{width:lineWidth+'px',top:-1*lineTop+'px',left:lineLeft+'px'}"
      ></div>
      <div
        class="line line2"
        :style="{width:lineWidth+'px',top:1*lineTop+'px',left:lineLeft+'px'}"
      ></div>
      <!-- :style="{width:lineWidth+'px'}" -->
      <div
        class="line line3"
        :style="{width:lineWidth+'px',top:1*lineTop+'px',left:line3Left+'px'}"
      ></div>
      <div
        class="info_window"
        :style="{top:-2*lineTop+'px',left:windowLeft+'px'}"
        ref="info_window"
      >
        <a-icon
          type="close-circle"
          @click="closeIconCLick"
        ></a-icon>
        <a-row
          type="flex"
          justify="space-around"
        >
          <a-col :span="10">隐患描述</a-col>
          <a-col :span="14">{{showItem.specification}}</a-col>
        </a-row>
        <a-row
          type="flex"
          justify="space-around"
        >
          <a-col :span="10">位置</a-col>
          <a-col :span="14">{{showItem.checkPointName}}</a-col>
        </a-row>
        <a-row
          type="flex"
          justify="space-around"
        >
          <a-col :span="10">隐患等级</a-col>
          <a-col :span="14">{{showItem.riskLevel}}</a-col>
        </a-row>
        <a-row
          type="flex"
          justify="space-around"
        >
          <a-col :span="10">上报时间</a-col>
          <a-col :span="14">{{showItem.reportTime}}</a-col>
        </a-row>
        <a-row
          type="flex"
          justify="space-around"
        >
          <a-col :span="10">处理状态</a-col>
          <a-col :span="14">{{showItem.status}}</a-col>
        </a-row>
      </div>
      <div
        class="video_window"
        :style="{left:windowLeft+'px',top:2*lineTop+'px'}"
        v-show="showVideo"
      >
        <!-- :style="{left:windowLeft+'px'}" -->

        <video
          :src="'data:video/mp4;base64,'+showVideo.evidence_blob"
          controls
          style="width:100%;height:100%"
          ref="video"
        ></video>

        <a-icon
          type="close-circle"
          @click="closeIconCLick"
        ></a-icon>
      </div>
      <div
        class="empty_window"
        v-show="!showVideo"
        :style="{left:windowLeft+'px',top:2*lineTop+'px'}"
      >
        <p>没有隐患视频</p>
        <a-icon
          type="close-circle"
          @click="closeIconCLick"
        ></a-icon>
      </div>
      <div
        class="img_window"
        :style="{left:-1*imgWindowLeft+'px',top:2*lineTop+'px'}"
      >
        <a-carousel arrows>
          <div
            slot="prevArrow"
            class="custom-slick-arrow"
            style="left: 10px;zIndex: 1"
          >
            <a-icon
              type="left-circle"
              :style="{color:'black'}"
            />
          </div>
          <div
            slot="nextArrow"
            class="custom-slick-arrow"
            style="right: 10px"
          >
            <a-icon type="right-circle" />
          </div>
          <div
            class="img_item"
            v-for="(item,index) in showImgs"
            :key="'img_item'+index"
          >
            <img
              :src="'data:image/jpeg;base64,'+item.evidence_blob"
              alt=""
            >
          </div>

        </a-carousel>

        <a-icon
          type="close-circle"
          @click="closeIconCLick"
        ></a-icon>

      </div>
    </section>
  </div>
</template>

<script>
import { formatDate } from "useModules/utils";
export default {
  name: "RiskHover",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    position: {
      type: Object,
      required: true,
    },
    riskList: {
      type: Array,
      default() {
        return [];
      },
    },
    isShowDrawer: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      listVisible: true,
      showItem: {
        desc: "",
        address: "",
        level: "",
        position: [],
      }, //当前正在展示的 一项
      riskStatuses: ["待处理", "处理中", "处理完毕", "已忽略"],
    };
  },
  computed: {
    LevelTexts() {
      return this.$store.getters.LevelTexts;
    },
    left() {
      const clientWidth = document.documentElement.clientWidth;
      return this.listVisible
        ? this.position.left
        : this.position.mapWapperWidth / 2 + this.position.mapWapperLeft;
      // return this.position.left;
    },
    top() {
      return this.listVisible
        ? this.position.top
        : this.position.mapWapperHeight / 2 + this.position.mapWapperTop;
      // return this.position.top;
    },
    //根据
    lineWidth() {
      const infoHeight = 180;
      const videoHeight = 450;
      const imgHeight = 300;
      //根据上下右边距 分别计算 宽度取最小的一个
      // const width1=this.position.offsetY*1.73;
      //使用距离 页面下边距 计算
      const clientWidth = document.documentElement.clientWidth;
      const totalWidth = this.isShowDrawer
        ? this.position.mapsWapperWidth
        : this.position.mapWapperWidth; //根据当前状态是否 要显示右侧 抽屉
      const width3 =
        (this.position.mapWapperHeight - this.position.offsetY - imgHeight) *
        1.73;

      //使用上边距 计算
      let width1 = (this.top - infoHeight) * 1.73;

      const windowWidth = clientWidth * 0.26; //每个信息窗口的宽度
      //使用左边距
      const width2 = (totalWidth - 250 - windowWidth) / 2;
      // this.position.mapWapperWidth - this.position.offsetX + 30 - windowWidth;
      console.log(width2, width3);
      const width = Math.min(width3, width2);
      // return width > 360 ? 360 : width; //最大狂赌 360
      return width;
    },
    lineTop() {
      return this.lineWidth / 4;
    },
    lineLeft() {
      return -this.lineWidth * 0.07;
    },
    windowLeft() {
      return this.lineWidth / 1.15 - 5;
    },
    //line3 的left 值
    line3Left() {
      return -1 * this.lineWidth * 0.865 + this.lineLeft;
    },
    imgWindowLeft() {
      const map_wapperCenterLeft =
        this.position.mapWapperWidth / 2 + this.position.mapWapperLeft;
      const windowWidth = document.documentElement.clientWidth * 0.27; //每个信息窗口的宽度
      return this.windowLeft + windowWidth - 10;
    },
    //展示的 图片
    showImgs() {
      const { companyActiveRiskImageVideoList } = this.showItem;
      if (!companyActiveRiskImageVideoList) return [];
      return companyActiveRiskImageVideoList.filter(
        (item) => item.evidence_type === 1
      );
    },
    //展示的视频
    showVideo() {
      const { companyActiveRiskImageVideoList } = this.showItem;
      if (!companyActiveRiskImageVideoList) return [];
      return (
        companyActiveRiskImageVideoList.find(
          (item) => item.evidence_type === 2
        ) || ""
      );
    },
  },
  methods: {
    //risk_hover 中 单个隐患的点击事件
    riskItemClick(risk, event) {
      this.$emit("moveCenter"); //强制移动到 地图中心
      this.showItem = risk;
      // console.log(risk);
      this.showWindows();
    },
    // 关闭 列表展示 展示 窗口
    showWindows() {
      this.listVisible = false;
    },
    closeAll() {
      this.pauseVideo();
      this.listVisible = true;
      // this.$emit("close");
    },
    closeIconCLick() {
      this.listVisible = true;
      this.closeAll();
      this.$emit("close");
    },
    pauseVideo() {
      this.$refs.video.pause();
      // console.log("paused", this.$refs.video.paused);
    },
    bindHandler() {},
    formatDate(stamp) {
      return formatDate(new Date(stamp).toString(), "yyyy-MM-dd hh:mm:ss");
    },
  },
};
</script>

<style scoped lang="less">
.risk_hover {
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
  border-radius: 5px;
  background-color: var(--window-color);
  color: #fff;
  font-size: 13px;
  position: fixed;
  z-index: 999;
  width: 24vw;
  transition: height cubic-bezier(0.075, 0.82, 0.165, 1) 0.3s;
  margin-bottom: 5px;
  .ant-col {
    text-align: start;
  }
  h3 {
    color: #fff;
  }
  //定义 透明度的 动画帧
  @keyframes mymove {
    from {
      /* width: 0px; */
      opacity: 0;
      /* top:0; */
    }

    to {
      /* width: 500px; */
      opacity: 1;
      /* top:178px; */
    }
  }
  .risk_list {
    max-height: 30vh;
    overflow-y: scroll;
    .risk_item {
      cursor: pointer;
      line-height: 30px;
      text-align: center;
      align-items: center;
      // box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
      // box-shadow: 0 2px 6px 0 #93ebf8;
      border: 1px solid #fff;
      border-radius: 5px;
      height: 30px;
      //   width: 90%;
      margin: 10px auto 0 auto;
      cursor: pointer;
    }
    .risk_item:hover {
      background-color: #fff;
      color: var(--window-color);
    }
  }
  //使用伪元素 隐藏滚动条
  .risk_list::-webkit-scrollbar {
    display: none;
  }
  .rh_close {
    position: absolute;
    top: 0px;
    right: 0;
  }
  .window_wapper {
    @lineWidth: 360px;
    @lineTop:@lineWidth /4;
    @lineLeft: -28px;
    @windowLeft: @lineWidth / 1.15 - 5px;
    position: fixed;
    // z-index: 10;
    .video_window,
    .img_window,
    .info_window ,
    .empty_window{
      font-size: 14px;
      padding: 10px;
      background-color: var(--window-color);
      box-shadow: 0 2px 6px 0 #93ebf8;
      color: #fff;
      transition: opacity 0.5s linear;
      animation: mymove 0.5s linear;
      position: absolute;
      // left: @windowLeft;
      // transform: translateY(-50%);
      background-color: #161c25;
      .anticon {
        position: absolute;
        top: 0px;
        right: 0;
      }
      width: 26vw;
    }
    .info_window {
      // top: -2 * @lineTop;
      transform: translateY(-100%);
      max-height: 300px;
    }
    .video_window {
      // top: 140px;
      transform: translateY(-50%);
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      video {
        width: 100%;
        height: 100%;
      }
    }
    .empty_window{
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .img_window {
      padding: 10px;
      transform: translateY(-50%);
      // top: 2 * @lineTop;
      // position: fixed;
      // top: 50%;
      // left: 50%+22vw;
      // right: 0px;
      // max-height: 210px;
      max-height: 300px;
      img {
        height: 100%;
        width: 100%;
        max-height: 280px;
      }
    }
    .line {
      width: @lineWidth;
      height: 1px;
      background-color: rgba(147, 235, 248, 1);
      transition: opacity 0.5s linear;
      // position: fixed;
      position: absolute;
      animation: mymove 0.5s linear;
    }
    .line1 {
      transform: rotate(-30deg);
      // top: -@lineTop;
      // left: 140px / 1.73 - 140px;
      // left: @lineLeft;
    }
    .line2 {
      //  top:@startTop;
      //  left:@startLeft;
      // left: 140px / 1.73 ;
      transform: rotate(30deg);
    }
    .line3 {
      transform: rotate(150deg);
      // top: 140px + 50px;
      // top: @lineTop;
      //  left:@startLeft;
      // left: @lineLeft;
    }
  }
  .ant-carousel {
    /deep/ .custom-slick-arrow {
      width: 25px;
      height: 25px;
      font-size: 25px;
      color: #fff;
      background-color: rgba(31, 45, 61, 0.11);
      opacity: 0.3;
    }
    //隐藏默认的 切换箭头
    .custom-slick-arrow:before {
      display: none;
    }
  }
}
</style>