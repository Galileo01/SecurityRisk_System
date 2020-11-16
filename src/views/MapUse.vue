<template>
  <div class="map_use">
    <a-row>
      <a-col :span="14">
        <div
          class="amap-wapper"
          id=""
        >
          <el-amap
            :plugin="plugins"
            vid="amap"
            :zoom="zoom"
            :events="Mapevents"
            :amapManager="amapManager"
            ref="map"
            :center="[105.926951,29.356384]"
            :mapStyle="mapStyle"
          >
            <el-amap-marker
              v-for="(m,index) in markers"
              :position="m.position"
              :events="m.events"
              :key="index"
              :draggable="m.draggable"
              :vid="'marker'+index"
            ></el-amap-marker>
            <!--圆形标记-->
            <el-amap-circle-marker
              v-for="(marker,index) in markers"
              :center="marker.position"
              :radius="radius"
              :fill-color="marker.fillColor"
              :fill-opacity="marker.fillOpacity"
              :events="circleMarkerEvents"
              :strokeWeight="strokeWeight"
              :strokeOpacity="0"
              :key="index"
              :vid="'circle-marker'+index"
              :extData="{index}"
            ></el-amap-circle-marker>
            <!--信息窗口-->
            <el-amap-info-window
              :position="currentWindow.position"
              :visible="isShowWindow"
              :events="windowsEvents"
              class="window-c"
            >
              <div class="window">
                <p>{{currentWindow.deviceName}}</p>
                <p>
                  风险等级:{{currentWindow.level}}
                  <span>高危</span>
                </p>
                <p
                  class="more"
                  @click="seeDetail"
                >查看详情</p>
              </div>
            </el-amap-info-window>
          </el-amap>
        </div>
      </a-col>
      <a-col :span="16">
        <div class="btns">
          <a-button type="danger">CLICK</a-button>
        </div>
      </a-col>
    </a-row>
    <a-modal
      :visible="modelVisible"
      title="Modal"
      ok-text="确认"
      cancel-text="取消"
      @ok="okHandler"
      @cancel="cancelHandler"
    >
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
    </a-modal>
  </div>
</template>

<script>
// import { AMapManager } from "vue-amap";
import { drawDistrictBorder } from "useModule/useMap";

export default {
  // name:'MapUse',
  data() {
    return {
      plugins: [
        // "AMap.PlaceSearch",
        "AMap.Scale",
        "AMap.OverView",
        "AMap.ToolBar",
        "AMap.MapType",
        // "AMap.PolyEditor",
        // "AMap.CircleEditor",
      ],
      zoom: 12,
      mapStyle: "amap://styles/9fce57c9bc3670d50f4b0f312a4111bf",
      //使用amapManager amap 管理器在任何地方都可以拿到Map 实例
      amapManager: new AMapManager(),
      Mapevents: {
        //init 事件的参数时 地图实例
        init: (o) => {
          // console.log(o);
          console.log(this);
          // console.log(o.getCenter());
          // console.log(this.$refs.map.$$getCenter()); //获取中心坐标
          // o.getCity((result) => {
          //   console.log(result);
          // });
        },
        click: (e) => {
          //点击获取点击位置 的经纬度 lat：经度 lng：纬度
          // alert("map clicked");
          const {
            lnglat: { lng, lat },
          } = e;
          console.log(e);
          console.log(lng, lat);
          this.$message.info(`点击了${lng},${lat}`);
          //设置
          // console.log(this.amapManager.getMap().setCenter([lng, lat]));
          // this.$refs.map.setCenter([lng,lat]);
        },
        //地图缩放 事件
        zoomChange() {},
      },
      radius: 10,
      strokeWeight: 0,
      //circleMarker事件对象
      circleMarkerEvents: {
        //使用箭头函数 this 指向定义时的 this 即：当前Vue 实例
        // click: (e) => {
        //   //  解构 获取 下标
        //   const {
        //     target: {
        //       w: {
        //         extData: { index },
        //       },
        //     },
        //   } = e;
        //   console.log(index);
        // },
        mouseover: (e) => {
          const {
            target: {
              w: {
                extData: { index },
              },
            },
          } = e;
          console.log(index);
          if (index != this.currentWindowIndex) this.currentWindowIndex = index;
          !this.isShowWindow && (this.isShowWindow = true);
        },
        dragend: (e) => {
          console.log("---event---: dragend");
          this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
        },
      },
      markers: [
        {
          position: [105.927251, 29.356384],
          visible: true,
          draggable: true,
          template: '<span class="test">HHHHHH</span>',
          fillColor: "#e74c3c",
        },
        {
          position: [105.906951, 29.356404],
          visible: true,
          draggable: true,
          template: "<span>1</span>",
          fillColor: "#f1c40f",
        },
      ],
      //窗体的 事件
      windowsEvents: {
        close: (e) => {
          console.log("close infowindow1");
          // console.log(e);
          this.isShowWindow = false;
          console.log(this);
        },
      },
      //高德地图只支持 显示一个 window，所以可以只用一个 变量来标识
      isShowWindow: false,
      windows: [
        {
          position: [105.927251, 29.356384],
          deviceName: "设备1",
          level: 1,
        },
        {
          position: [105.906951, 29.356404],
          deviceName: "设备2",
          level: 2,
        },
      ],
      //当前显示 窗口下标
      currentWindowIndex: -1,
      modelVisible: false,
    };
  },
  computed: {
    currentWindow() {
      if (this.currentWindowIndex < 0)
        return {
          position: [0, 0],
          deviceName: "",
          level: 0,
        };
      else return this.windows[this.currentWindowIndex];
    },
  },
  methods: {
    seeDetail() {
      this.modelVisible = true;
      console.log(this.amapManager.getMap());
    },
    okHandler() {},
    cancelHandler() {
      this.modelVisible = false;
    },
  },
  created() {},
  mounted() {
    // console.log(this.amapManager.getMap());
    // drawDistrictBorder(this.amapManager.getMap());
  },
  components: {},
};
</script>

<style lang="less" scoped>
.amap-wapper,
#wapper {
  height: 700px;
  width: 1000px;
  //   margin: 0 auto;
  margin: 10px;
}
.amap-wapper {
  .el-vue-amap-container /deep/ .amap-info-content {
    padding: 5px;
    .window {
      font-size: 13px;
      .more {
        font-size: 2px;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}
</style>