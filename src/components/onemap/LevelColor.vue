<template>
  <div class="type_box">

    <section
      class="risk_level"
      v-show="showDataType==='risk'"
    >
      <div
        class="type"
        v-for="(item,index) in LevelData"
        :key='"level"+index'
      >
        <div
          class="color"
          :style="{backgroundColor:item.color}"
        ></div>
        {{item.name}}
      </div>
    </section>
    <section
      class="other"
      v-show="showDataType!=='risk'"
    >
      <div
        class="type"
        v-for="(item,index) in otherColors"
        :key='"other"+index'
      >
        <div
          class="color"
          :style="{backgroundColor:item.color}"
        >
        </div>
        {{item.name}}
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "TypeColor",
  props: {
    //地图（高德） 当前展示 数据
    showDataType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      otherColors: [
        {
          name: "检查点",
          color: "#884898",
        },
        {
          name: "企业",
          color: "#5fb878",
        },
      ],
    };
  },
  computed: {
    LevelData() {
      return this.$store.state.LevelData;
    },
  },
};
</script>

<style scoped lang="less">
.type_box {
  width: 6vw;
  min-width: 60px;
  padding: 8px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 300;
  color: #111213;
  // background-color: #fff;
  background-color: #51565c;
  color: #fff;
  border-radius: 0.4rem;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
  position: absolute;
  top: 6%;
  right: 6%;
  .type:last-of-type {
    margin-bottom: 0px; //最后一个 取消 下边界
  }
  .type {
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;

    .color {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
  }
}
</style>