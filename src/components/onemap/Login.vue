<template>
  <div class="login_wapper">
    <!--容器-->
    <div class="lg_modal_container">
    </div>
    <a-modal
      :visible="visible"
      title="用户登录"
      width="30vw"
      class="ant-modal-root"
      :getContainer="getContainer"
      destroyOnClose
      :maskClosable="false"
      :closable="false"
    >
      <div class="modal_content">
        <WindowBg isShowBgColor />
        <a-form-model
          :label-col="{ span: 3,offset:5 }"
          :wrapper-col="{ span: 8 ,offset:2}"
          :rules="rules"
          :model="formData"
          ref="form"
          @keydown.enter.native="submit"
        >
          <a-form-model-item
            label="用户名"
            prop="username"
          >
            <a-input
              type="text"
              size="small"
              placeholder="请输入用户名"
              allow-clear
              v-model="formData.username"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="密码"
            prop="password"
          >
            <a-input-password
              type="password"
              size="small"
              placeholder="请输入密码"
              allow-clear
              v-model="formData.password"
            ></a-input-password>

          </a-form-model-item>
          <a-form-model-item
            label="验证码"
            :wrapper-col="{ span: 10 ,offset:2}"
            prop="checkCode"
          >
            <a-row
              class="check_code_item"
              type="flex"
              align="middle"
            >
              <a-col :span="14">
                <a-input
                  type="text"
                  size="small"
                  v-model="formData.checkCode"
                  placeholder="请输入验证码"
                ></a-input>

              </a-col>
              <a-col
                :span="8"
                offset="2"
              >
                <div
                  class="check_code"
                  v-if="checkCodeData"
                  @click="_getCheckCode"
                >
                  <img
                    :src="'data:image/jpeg;base64,'+checkCodeData.Code"
                    alt=""
                  >
                </div>
              </a-col>
            </a-row>
          </a-form-model-item>
        </a-form-model>
      </div>
      <template #footer>
        <div class="custom_footer">
          <a-button
            type="primary"
            @click="submit"
          >
            登录
          </a-button>
        </div>

      </template>
    </a-modal>
  </div>
</template>

<script>
import WindowBg from "common/WindowBg";
import { getCheckCode, login, queryUserInfo } from "network/user";
export default {
  name: "Login",
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
    return {
      checkCodeData: null,
      formData: {
        username: "Admin",
        password: "admin123",
        checkCode: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
        checkCode: [
          {
            required: true,
            message: "请输入图中验证码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async _getCheckCode() {
      const { data, status, msg } = await getCheckCode();
      if (status !== 200) {
        // console.log(msg);
        return this.$message.error("网络错误");
      }
      // console.log(data);
      this.checkCodeData = data;
    },
    //提交登录
    submit() {
      if (!this.formData.checkCode)
        return this.$message.warning("请输入验证码");
      this.$refs.form
        .validate()
        .then(async () => {
          const { data, status, msg } = await login({
            passWord: this.formData.password,
            userName: this.formData.username,
          });
          console.log(data, status);
          if (status !== 200) return this.$message.error("登录失败");
          else if (!data) return this.$message.error(msg);
          else this.$message.success("登录成功");
          // console.log(data);
          //保存 token
          localStorage.setItem("token", data);

          this.$emit("update:visible", false);
          this.$emit("login", this.formData);
          const {
            data: data1,
            status: status1,
            msg: msg1,
          } = await queryUserInfo();
          if (status1 !== 200) return this.$message.error("用户信息获取失败");
          console.log(data1);
          this.formData.tel = data1.phone;
          this.$store.commit("getUserInfo", this.formData);
        })
        .catch((err) => {
          console.log(err);
          return this.$message.warning("请检查  用户名和密码 是否输入");
        });
      //提交 登录请求
    },
    getContainer() {
      return document.querySelector(".lg_modal_container");
    },
  },
  created() {
    this._getCheckCode();
  },
};
</script>

<style scoped lang="less">
.login_wapper {
  .modal_content {
    .check_code_item {
      .check_code {
        height: 30px;
        width: 80px;
        line-height: 30px;
        img {
          height: 100%;
          border-radius: 5px;
        }
      }
    }
  }
  .ant-modal-root {
    background-color: transparent;
    background: transparent;
    /deep/.ant-modal-content {
      background: transparent;
      // background-image: url(../../assets/img/window/left1.png);
      background-size: 100% 100%;
      border: none; //隐藏 border
      .ant-modal-close .ant-modal-close-x {
        line-height: 30px;
      }
      .ant-modal-header {
        position: relative;
        z-index: 3;
        background: none;
        border: none;
        padding: 0 20px;
        .ant-modal-title {
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          line-height: 30px;
        }
      }
      .ant-modal-body {
        padding: 10px 15px;
      }
      .ant-modal-footer {
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

      /deep/.ant-form-item {
        .ant-form-item-label > label {
          color: #fff !important;
        }
        color: #fff !important;
      }
    }
  }
}
</style>