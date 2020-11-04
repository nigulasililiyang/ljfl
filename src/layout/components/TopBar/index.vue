<template>
  <div class="navbar">
    <div class="left-box">
      <div class="router-item">
        <div class="span"><router-link to="/import/index">导入数据</router-link></div>
      </div>
    </div>
    <router-link to="/" class="home-router">
        <img
          src="../../../assets/logo/logo.png"
          :style="{
            display: 'inline-block',
            'vertical-align': 'middle',
          }"
        />
        <div class="router-title">基于层次化和需求化的生活垃圾分类评价系统</div>
        <div class="clock">更新于{{ currentTime }}时</div>
    </router-link>
    <div class="right-box">
      <div class="router-item"><div class="span"><router-link to="/export/index">导出数据</router-link></div></div>
      <div style class="right-menu">
        <el-dropdown
          @command="handleCommand"
          class="avatar-container right-menu-item hover-effect fr"
          trigger="click"
        >
          <div class="avatar-wrapper">
            <img :src="avatar" class="user-avatar" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/user/profile">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <div @click="helpCenter">
              <el-dropdown-item>使用帮助</el-dropdown-item>
            </div>
            <el-dropdown-item divided command="logout"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger";
import TopbarItem from "./TopbarItem";
import variables from "@/assets/styles/variables.scss";

export default {
  components: {
    Hamburger,
    TopbarItem,
  },
  computed: {
    ...mapGetters(["topbar", "sidebar", "avatar", "name"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
  },
  created() {
    setInterval(this.updateTimeIndex, 1000);
  },
  mounted() {},
  props: {
    haveSubRouter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      menuList: [],
      leftMenus: [],
      rightMenus: [],
      menuCount: undefined,
      currentTime: this.$moment(new Date()).format("YYYY-MM-DD HH"),
    };
  },
  methods: {
    updateTimeIndex() {
      this.currentTime = this.$moment(new Date()).format("YYYY-MM-DD HH")
    },
    toogleTopBar() {
      this.$store.dispatch("app/toogleTopBar");
    },
    helpCenter() {
      window.open("/docs/views", "_blank");
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    handleCommand(command) {
      if (command == "logout") {
        this.logout();
      }
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          location.reload();
        });
      });
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      var rootpath = path.split("/")[1];
      return rootpath;
    },
    variables() {
      return variables;
    },
    changeParentMenu(key, keyPath) {},
    getWidth() {
      if (this.leftMenus.length <= 4) {
        return "500px";
      }
      return this.leftMenus.length * 125 + "px";
    },
  },
};
Date.prototype.Format = function (fmt) {
  //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.navbar {
  height: $topBarHeight;
  // min-width: 1920px;
  width: 100%;
  position: relative;
  display: flex;
  background: url("../../../assets/image/topbar-title-bg.png") no-repeat;
  background-size: 100% 100%;

  .right-menu {
    line-height: 50px;
    width: 135px;
    display:inline-block &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      font-size: 12px;
      width: 135px;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 20px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        line-height: 41px;
        font-size: 12px;
        height: 41px;
        display: inline-flex;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 25px;
          // font-size: 12px;
          line-height: 41px;
          padding-left: 5px;
        }
      }
      .el-icon-caret-bottom {
        cursor: pointer;
      }
      span {
        padding-left: 7px;
      }
    }
  }
  .home-router {
    display: flex;
    width: 640px;
    height: 100px;
    align-items: center;
    justify-content: center;
    // padding: 0 24px;
    .router-title{
      	width: 250px;
        height: 52px;
        font-family: GBInnMing-Heavy;
        font-size: 24px;
        // line-height: 73px;
        color: #ffffff;
        margin: 0px 18px;
    }
    .clock {
      	width: 216px;
        height: 20px;
        font-family: STHeitiJ-Light;
        font-size: 19px;
        line-height: 18px;
        color: #ffffff;
    }
  }
}

.left-box {
  align-items: center;
  width: calc(50% - 320px);
  display: flex;
  justify-content: flex-end;
}
.right-box {
  align-items: center;
  width: calc(50% - 320px);
  display: flex;
  justify-content: space-between;
}
.router-item {
width: 151px;
	height: 61px;
	background-image: linear-gradient(0deg, 
		#042a71 0%, 
		#1969b3 100%), 
	linear-gradient(
		#041241, 
		#041241);
	background-blend-mode: normal, 
		normal;
	box-shadow: inset 0px 0px 10px 3px 
		#2082dc;
	border-radius: 8px;
	border: solid 2px #aac7f6;
	opacity: 0.21;
  .span {
	font-family: AdobeHeitiStd-Regular;
	font-size: 33px;
	line-height: 61px;
	color: #ffffff;
  text-align: center;
  }
}
</style>
