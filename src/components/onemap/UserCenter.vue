<template>
  <div class="user_center">
    <!--容器-->
    <div class="uc_modal_container">
    </div>
    <a-modal
      :visible="visible"
      title="用户中心"
      @cancel="closeHandler"
      @ok="submitEdit"
      width="28vw"
      okText="提交"
      cancelText="取消"
      class="ant-modal-root"
      :getContainer="getContainer"
    >
      <div class="modal_content">
        <WindowBg />
        <a-form
          :label-col="{ span: 4,offset:5 }"
          :wrapper-col="{ span: 8 ,offset:2}"
        >
          <a-form-item label="用户名">
            <span>
              {{userInfo.username}}
            </span>
          </a-form-item>
          <a-form-item label="电话">
            <a-input
              type="text"
              size="small"
              v-model="newInfo.tel"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item label="密码">
            <a-input
              type="password"
              size="small"
              v-model="newInfo.password"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item
            label="密码确认"
            v-if="isPassEdited"
          >
            <a-input
              type="password"
              size="small"
              v-model="newInfo.passwordCon"
              allow-clear
            ></a-input>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script>
import WindowBg from "common/WindowBg";
import { updateUser } from "network/user";
export default {
  name: "UserCenter",
  props: {
    visible: {
      type: Boolean,
      reqiured: true,
    },
  },
  computed: {
    userInfo() {
      this.newInfo = { ...this.$store.state.userInfo, passwordCon: "" };
      return this.$store.state.userInfo;
    },
    //是否修改了密码
    isPassEdited() {
      return this.newInfo.password !== this.userInfo.password;
    },
  },
  components: {
    WindowBg,
  },
  data() {
    return {
      newInfo: { ...this.$store.state.userInfo, passwordCon: "" },
      passwordCon: "", //确认密码
    };
  },
  methods: {
    closeHandler() {
      this.$emit("update:visible", false);
    },
    async submitEdit() {
      const { password, tel } = this.userInfo;
      const { password: newPassword, tel: newTel, passwordCon } = this.newInfo;
      const isUpdated = password !== newPassword || tel !== newTel;
      if (!isUpdated) return this.$message.info("没有做出任何修改");
      console.log(newPassword, passwordCon);
      if (this.isPassEdited && newPassword !== passwordCon)
        return this.$message.warning("新密码和确认密码不一致");

      const { data, status, msg } = await updateUser({
        passWord: newPassword,
        phone: newTel,
        modifiedBy: this.userInfo.username,
      });
      if (status !== 200) {
        this.$emit("update:visible", false);
        this.$message.error("修改失败");
      } else {
        this.$message.success("修改成功");
        this.$store.commit("getUserInfo", this.newInfo);
        this.closeHandler();
      }
    },
    getContainer() {
      return document.querySelector(".uc_modal_container");
    },
  },
};
</script>

<style scoped lang="less">
.user_center {
  .ant-modal-root {
    /deep/ .ant-modal-footer {
      border: none;
      padding: 6px 16px;
      > div {
        //撑开 footer 中按钮的容器高度
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        button {
          margin: 0 20px;
        }
      }
    }
  }
}
</style>