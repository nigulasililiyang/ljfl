<template>
  <div :class="classObj" class="app-wrapper">
    <div class="fixed-header">
      <topbar :haveSubRouter="subRouter.length>0" />
    </div>
    <div class="main-view">
      <div :class="{hasTagsView:needTagsView}" class="main-container">
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import { AppMain, Settings, Sidebar, TagsView, Topbar } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState, mapGetters } from "vuex";
import { listMenu, treeselect, subListMenu } from "@/api/system/menu";

export default {
  name: "Layout",
  components: {
    AppMain,
    Topbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapGetters(["parentListMenu"]),
    ...mapState({
      sidebar: state => state.app.sidebar,
      subMenu: state => state.app.subMenu,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
      topbar: state=>state.app.topbar

    }),
    classObj() {
      return {
        haveSubMenu: (this.subMenu.have && this.basePath.indexOf('operationcenter')==-1&& this.basePath.indexOf('operation')==-1),
        noSubMenu: !this.subMenu.have,
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        hideTopbar:!this.topbar.opened,
        openTopbar:this.topbar.opened
        // mobile: this.device === "mobile"
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
    shouldLoadSubMenu(moulePath) {
      const exclude = ["index", "operationcenter", "operation"];
      var res = true;
      for (let index = 0; index < exclude.length; index++) {
        const element = exclude[index];
        if (element == moulePath) {
          res = false;
          break;
        }
        continue;
      }
      return res;
    },
    getSidebarMenu() {
      var routers = this.$store.getters.parentListMenu;
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      var rootpath = path.split("/")[1];
      this.subRouter = [];
      this.basePath = rootpath;

      routers.forEach(element => {
        var loadSubMenu = this.shouldLoadSubMenu(rootpath);
        if (
          element.path == rootpath &&
          element.menuType == "M" &&
          loadSubMenu
        ) {
          subListMenu(element.menuId).then(res => {
            this.subRouter = res.data;
            this.$store.dispatch("app/showSubMenu");
          });
        } else {
          this.$store.dispatch("app/hiddenSubMenu");
        }
      });
    }
  },
  mounted() {
    this.getSidebarMenu();
  },
  watch: {
    $route() {
      this.basePath=this.$route.path.split("/")[1];
    },
    basePath(){
      this.getSidebarMenu();
    }
  },
  data() {
    return {
      subRouter: [],
      basePath: "",
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";
.hideTopbar{
  .main-view {
    top: $topBarHeightFull;
    height: calc(100% - #{$topBarHeightFull});
  }
}
.openTopbar{
  .main-view {
    top: $topBarHeight;
    height: calc(100% - #{$topBarHeight});
  }
}
.main-view {
  display: inline-flex;
  // top: $topBarHeight;
  // height: calc(100vh - #{$topBarHeight});
  /*position: fixed;*/
  width: 100%;
  // min-width: 1920px;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

// .drawer-bg {
//   background: #000;
//   opacity: 0.3;
//   width: 100%;
//   top: 0;
//   height: 100%;
//   position: absolute;
//   z-index: 999;
// }

.fixed-header {
  /*position: fixed;*/
  top: 0;
  right: 0;
  /*z-index: 9;*/
  width: 100%;
  // width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  // width: calc(100% - 54px)
}

.mobile .fixed-header {
  // width: 100%;
}
.sidebar {
  height: 100%;
  border: solid 2px #0c3d68;
  background-color: rgba($color: #00b7ee, $alpha: 0.03);
}
</style>
