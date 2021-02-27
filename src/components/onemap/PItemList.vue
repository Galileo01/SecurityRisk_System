<template>
  <div class="item_list_drawer">
    <WindowBg :bottomHeight="10" />
    <h3 class="h_title">检查点信息</h3>
    <div class="content">
      <div class="title_w">
        <span class="title">
          检查点图片
        </span>
      </div>
      <div class="imgs">
        <a-carousel arrows>
          <img
            :src="'data:image/jpeg;base64,'+item.navi_image"
            :alt="'检查点图片'+index"
            v-for="(item,index) in imgList"
            :key="'img'+index"
            @click="showEnlarge(item.navi_image)"
          >
          <div
            slot="prevArrow"
            class="custom-slick-arrow"
            style="left: 10px;zIndex: 2"
          >
            <a-icon
              type="left-circle"
              :style="{color:'black',fontSize:'16px'}"
            />
          </div>
          <div
            slot="nextArrow"
            class="custom-slick-arrow"
            style="right: 10px"
          >
            <a-icon
              type="right-circle"
              :style="{color:'black',fontSize:'16px'}"
            />
          </div>
        </a-carousel>

      </div>
      <div class="title_w">
        <span class="title">
          检查项列表
        </span>
      </div>
      <a-row
        type="flex"
        justify="space-between"
      >
        <a-col :span="8">名称</a-col>
        <a-col :span="2">等级</a-col>
        <!-- <a-col :span="6">历史风险</a-col> -->
        <a-col :span="5">排查周期</a-col>
        <a-col :span="8">分类名称</a-col>
        <!-- <a-col :span="5">最少图片数量(符合)</a-col>
        <a-col :span="5">最少图片数量</a-col>
        <a-col :span="5">界面说明</a-col>
        <a-col :span="5">界面说明</a-col> -->
      </a-row>
      <section class="item_list">

        <a-row
          class="risk_item"
          v-for="(item,index) in listData"
          :key="index+'item'"
          type="flex"
          justify="space-between"
          @click.native="$emit('check-item-click',index)"
        >

          <a-col
            :span="8"
            style="font-size:12px"
          >
            <a-tooltip
              placement="left"
              :title="item.checkItemName"
            >
              {{item.checkItemName}}
            </a-tooltip>
          </a-col>
          <a-col :span="2">{{item.riskLevel}}</a-col>
          <a-col :span="2">{{calPeriod(item)}}</a-col>
          <a-col :span="8">
            <a-tooltip
              placement="right"
              :title="item.categoryName"
            >
              {{item.categoryName}}
            </a-tooltip>
          </a-col>

          <!-- <a-col :span="6">{{item.riskCount}}</a-col> -->
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
      @click="closeHandler"
    />
    <div class="enlarge_container"></div>
    <a-modal
      :visible="enlargeVisible"
      title="图片放大"
      :getContainer="getContainer"
      @cancel="closeEnlarge"
      width="50vw"
      :footer="null"
    >
      <div class="modal_content">
        <WindowBg :bottomHeight="10" />
        <section class="img">
          <img
            :src="enlargeSrc"
            alt="图片放大"
          >
        </section>
      </div>
    </a-modal>
  </div>
</template>

<script>
import WindowBg from "common/WindowBg";
import { getItemByPointID } from "network/company";
export default {
  name: "PItemList",
  components: {
    WindowBg,
  },
  data() {
    return {
      listData: [],
      imgList: [],
      enlargeVisible: false,
      enlargeSrc: "",
    };
  },
  props: {
    checkPointId: {
      type: String,
      required: true,
    },
  },
  computed: {
    LevelTexts() {
      return this.$store.getters.LevelTexts;
    },
  },
  watch:{
    //监听props id 变化 重新请求
    checkPointId(){
      this.getItems();
    }
  },
  methods: {
    async getItems() {
      const { data, status } = await getItemByPointID(this.checkPointId);
      console.log(data);
      const { checkItems, images } = data;
      this.$emit("fetch-success");
      if (status !== 200) return this.$message.error("数据请求失败");
      this.listData = checkItems;
      this.imgList = images;
    },
    closeHandler() {
      this.listData = [];
      this.imgSrc = [];
      this.$emit("close");
    },
    calPeriod(item) {
      if (item.needDaily === 1) return "日";
      else if (item.needMonthly === 1) return "月";
      else return "周";
    },
    showEnlarge(Imgbase64) {
      this.enlargeSrc = "data:image/jpeg;base64," + Imgbase64;
      this.enlargeVisible = true;
    },
    closeEnlarge() {
      this.enlargeVisible = false;
    },
    getContainer() {
      return document.querySelector(".enlarge_container");
    },
  },
  created(){
    this.getItems();
  }
};
</script>

<style scoped lang="less">
.item_list_drawer {
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
  font-size: 8px;
  .content {
    position: relative;
    padding: 10px 10px 0 10px;
    .title_w {
      height: 20px;
      .title {
        font-weight: 700;
        font-size: 14px;
      }
    }

    .imgs img {
      width: 100%;
      max-height: 200px;
      cursor: zoom-in; //放大
    }
  }
  .item_list {
    overflow-y: scroll;
    height: calc(100vh - 80px - 30px - 60px - 200px - 40px);
    .ant-col {
      text-align: center;
      font-size: 8px;
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
      height: 32px;
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
  .item_list::-webkit-scrollbar {
    width: 6px;
  }
  .item_list::-webkit-scrollbar-thumb {
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
  .modal_content {
    .img {
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>