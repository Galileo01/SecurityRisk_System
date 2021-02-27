<template>
  <section
    class="window_bg"
    :style="styleVar"
  >
    <div class="header">
    </div>
    <div class="body" :style="{
      'background-color':isShowBgColor?'var(--window-color)':'transparent'
    }"></div>
    <div class="bottom"></div>
  </section>
</template>

<script>
export default {
  name: "WindowBg",
  props: {
    headerHeight: {
      type: Number,
      default: 30,
    },
    bottomHeight: {
      type: Number,
      default: 6,
    },
    isShowBgColor:{
      type:Boolean,
      default:false
    }
  },
  computed: {
    styleVar() {
      const bodyMarginTop = this.headerHeight * 0.25;
      const bodyheight = `calc(100% - ${this.headerHeight + "px"} - ${
        this.bottomHeight + "px"
      } + ${bodyMarginTop + "px"})`;
      return {
        "--body-margin-top": -bodyMarginTop + "px",
        "--header-height": this.headerHeight + "px",
        "--bottom-heght": this.bottomHeight + "px",
        "--body-height": bodyheight,
      };
    },
  },
};
</script>

<style lang="less">
.window_bg {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  div {
    background-repeat: no-repeat;
  }
  .header {
    height: var(--header-height);
    background-image: url(../../assets/img/window/w_header.png);
    background-size: 100% var(--header-height);
    z-index: 3;
    position: relative;
  }
  .bottom {
    height: var(--bottom-heght);
    background-image: url(../../assets/img/window/w_bottom.png);
    background-size: 100% var(--bottom-heght); //默认 高度20px
  }
  .body {
    background-image: url(../../assets/img/window/w_body.png);
    background-size: 100% 100%;
    margin-top: var(--body-margin-top);
    height: var(--body-height);
  }
}
</style>