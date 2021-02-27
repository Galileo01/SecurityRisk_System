<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <Home />
    </div>
  </a-config-provider>
</template>
<script>
import Home from "./views/home";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
export default {
  components: {
    Home,
  },
  data() {
    return {
      // 2.赋值
      locale: zhCN,
    };
  },
};
</script>
<style>
@import url(./assets/css/base.css);
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
