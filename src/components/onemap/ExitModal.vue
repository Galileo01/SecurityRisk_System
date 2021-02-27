<template>
  <div class="exitModel">
    <!--容器-->
    <div class="ex_modal_container">
    </div>
    <a-modal
      :visible="visible"
      title="安全退出"
      @cancel="cancelHandler"
      @ok="okHandler"
      width="40vw"
      okText="确认"
      cancelText="取消"
      class="ant-modal-root"
      :getContainer="getContainer"
    >
      <div class="modal_content">
        <WindowBg />
        <h3>
          此操作会退出当前用户，确认继续？
        </h3>
      </div>
    </a-modal>
  </div>
</template>

<script>
import WindowBg from "common/WindowBg";
export default {
  name: "ExitModal",
  props: {
    visible: {
      type: Boolean,
      reqiured: true,
    },
  },
  components: {
    WindowBg,
  },
  data() {
    return {};
  },
  methods: {
    cancelHandler() {
      this.$emit("update:visible", false);
    },
    okHandler() {
      this.$emit("update:visible", false);
      localStorage.setItem('token','');
      this.$store.commit('clearUserInfo');
      this.$emit("logout");
    },
    getContainer() {
      return document.querySelector(".ex_modal_container");
    },
  },
};
</script>

<style scoped lang="less">
.exitModel {
  .modal_content {
    h3 {
      position: relative;
      color: #fff;
    }
  }
}
</style>