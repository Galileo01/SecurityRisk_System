<template>
  <section
    class="weather"
    v-if="weatherData"
  >
    <WindowBg
      :headerHeight="30"
    />
    <section class="content">
      <div class="header">
        <h3 class="title">天气</h3>
      </div>
      <div class="baseinfo">
        <div class="tem_wapper">
          <span class="loction">永川区</span>
          <span class="tem">
            {{weatherData.tem}}
          </span>
          ℃
        </div>
        <div class="middle">
          <p><span>{{weatherData.wea}}</span></p>
          <p><span>{{weatherData.tem1}}-{{weatherData.tem2}}</span>℃</p>
        </div>
        <div class="other">
          <div>风向<span>{{weatherData.win}}{{weatherData.win_speed}}</span></div>
          <div>空气质量<span>{{weatherData.air_level}}</span></div>
          <div>湿度<span>{{weatherData.humidity}}</span></div>
        </div>
      </div>
    </section>

  </section>
</template>

<script>
import WindowBg from "common/WindowBg";
import { getWeather } from "network/weather";
export default {
  name: "Weather",
  data() {
    return {
      weatherData: null,
    };
  },
  methods: {
    async getData() {
      //获取 天气信息
      const res = await getWeather();
      if (!res.success) return this.$message.error("天气信息获取失败");
      // console.log(res.data);
      this.weatherData = res.data;
    },
  },
  created() {
    this.getData();
  },
  components: {
    WindowBg,
  },
};
</script>

<style scoped lang="less">
.weather {
  position: relative;
  display: grid;
  place-items: center;
  height: 20%;
  min-height: 100px;
  padding: 0px 5px 0px 5px;
  .content {
    z-index: 3;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .header {
      position: absolute;
      top: 0;
      .title {
        color: black;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        line-height: 30px;
      }
    }
  }
  .baseinfo {
    display: flex;
    justify-content: space-evenly;
    width: 90%;
    padding-top: 5px;
    .tem_wapper {
      // width: 50%;
      .loction {
        font-size: 11px;
      }
      .tem {
        font-size: 40px;
        line-height: 40px;
      }
    }
    .middle {
      // width: 40%;
      p {
        margin-bottom: 5px;
      }
    }
    .other {
      font-size: 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: flex-start;
    }
  }

  .time {
    font-size: 10px;
    text-align: middle;
    margin-top: 10px;
  }
}
</style>