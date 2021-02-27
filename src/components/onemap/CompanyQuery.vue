<template>
  <div class="cq_wapper">
    <WindowBg />
    <h3 class="h_title">企业筛选</h3>
    <div class="content">
      <a-input
        v-model="keyword"
        placeholder="输入关键词搜索企业名称"
        @search="searchCompany"
        allow-clear
        @keydown.enter="searchCompany"
      >
        <a-icon
          slot="suffix"
          type="search"
          :style="{color:'#fff'}"
          @click="searchCompany"
        />
      </a-input>
      <section class="company_list">
        <div class="title">搜索结果</div>
        <a-row
          type="flex"
          justify="space-between"
        >
          <a-col :span="4">名称</a-col>
          <a-col :span="10">执照ID</a-col>
          <!-- <a-col :span="6">历史风险</a-col> -->
          <a-col :span="3">操作</a-col>
        </a-row>
        <a-row
          class="company_item"
          v-for="(item,index) in companyList"
          :key="index"
          type="flex"
          justify="space-between"
        >
          <!-- <span> {{item.name}}</span> <span>{{item.companyId}}</span><span>{{item.type}}</span> <span>{{item.riskCount}}</span> -->
          <a-col
            :span="6"
            style="font-size:12px"
            class="companyName"
          >
            <div class="companyName text-overflow-more">
              {{item.companyName}}</div>
          </a-col>
          <a-col :span="10">{{item.licenseCode}}</a-col>
          <!-- <a-col :span="6">{{item.riskCount}}</a-col> -->
          <a-col
            :span="3"
            class="btns"
          >
            <a-icon
              type="environment"
              :style="{color:'#b59a51'}"
              @click="$emit('company-choose',item.companyName)"
            />
            <a-icon
              type="heart"
              theme="filled"
              :style="{color:item.focused?'red':'white'}"
              @click="focusClick(index)"
            />
          </a-col>
        </a-row>
        <div
          class="default"
          v-if="companyList.length===0"
        >结果为空</div>
      </section>
    </div>
    <a-icon
      type="close-circle"
      :style="{fontSize:'20px',}"
      class="close_btn"
      @click="$emit('close')"
    />
  </div>
</template>

<script>
import WindowBg from "common/WindowBg";
import { queryCompanyByKeyword } from "network/company";
import {
  getFocuedCompany,
  collectCompany,
  cancelCollectCompany,
} from "network/user";
export default {
  name: "CompanyQuery",
  components: {
    WindowBg,
  },
  data() {
    return {
      keyword: "",
      companyList: [], //后台获取到的企业 查询结果
      focused: [],
    };
  },
  props: {},
  methods: {
    async getData() {
      const { data, status, msg } = await getFocuedCompany();
      console.log(data);
      if (status !== 200) return this.$message.error("请求失败");
      this.focused = data;
    },
    closeHandler() {
      this.$emit("update:visible", false);
      this.companyList = []; //清空
    },
    async searchCompany() {
      if (this.keyword.length === 0)
        return this.$message.warning("请输入关键词");
      const { status, data, msg } = await queryCompanyByKeyword(this.keyword);
      // console.log(data);
      if (status !== 200) return this.$message.error("请求失败,请重试");
      this.$message.success("查询成功");
      //  console.log(data);
      this.companyList = data.map((company) => {
        return {
          ...company,
          focused: Boolean(this.focused.find((item) => item.id === company.id)), //是否存在于 关注列表里
        };
      });
      // this.companyList = temp;
    },
    //收藏/关注 企业
    async focusClick(index) {
      const { id, focused } = this.companyList[index];
      let oprate = focused
        ? {
            func: cancelCollectCompany,
            type: "取消收藏",
          }
        : {
            func: collectCompany,
            type: "收藏",
          };
      const { data, status, msg } = await oprate.func(id);
      console.log(data);
      if (status != 200) return this.$message.error(`${oprate.type}失败`);
      this.$message.success(`${oprate.type}成功`);
      this.companyList[index].focused = !focused;
    },
    //提交收藏 操作
    submitFocus() {},
  },
  created() {
    this.getData();
  },
};
</script>

<style scoped lang="less">
.cq_wapper {
  //设置 抽屉样式
  // background-image: url(../../assets/img/window/slide_in.png);
  background-size: 100% 100%;
  background-color: transparent;

  width: 100%;
  height: 100%;
  // padding: 20px;
  padding-top: 30px;
  position: relative;
  .h_title {
    position: absolute;
    z-index: 10;
    top: 0px;
    left: 50%;
    line-height: 30px;
    transform: translateX(-50%);
    font-weight: 700;
  }
  .content {
    // margin-top: 50px;
    padding: 10px;
    /deep/ .ant-input {
      background-color: var(--window-color);
      color: #fff;
    }
    .ant-input-clear-icon {
      color: #fff;
    }
  }
  .company_list {
    .ant-col {
      text-align: center;
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
    .company_item {
      //   display: flex;
      //   justify-content: space-around;
      text-align: center;
      align-items: center;
      // box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
      // box-shadow: 0 2px 6px 0 #93ebf8;
      border: 1px solid #fff;
      border-radius: 5px;
      height: 40px;
      //   width: 90%;
      margin: 10px auto 0 auto;
      cursor: pointer;
      //   color: #fff;
      .companyName {
        -webkit-line-clamp: 2;
      }
    }
    .company_item:hover {
      background-color: #eeeeee;
      box-shadow: none;
      color: black;
    }
    .company_list::-webkit-scrollbar {
      display: none;
    }
  }
  .close_btn {
    position: absolute;
    top: 100vh / 722px * 5px;
    right: 10px;
    cursor: pointer;
  }
}
</style>