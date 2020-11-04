<template>
  <div class="menu-wrapper">
    <!-- <router-link :to="linkToDefault(item)"> -->
    <el-menu-item :index="item.path" @click="linkToDefault(item)">
      <item :icon="item.icon" :title="item.menuName" />
    </el-menu-item>
    <!-- </router-link> -->
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import FixiOSBug from "../Sidebar/FixiOSBug";

export default {
  name: "TopbarItem",
  components: { Item },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  data() {
    this.onlyOneChild = null;
    return {};
  },
  methods: {
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
    linkToDefault(item) {
      var type = item.menuType;
      if (type == "M") {
        var routes = this.$store.getters.permission_routes;
        for (let index = 0; index < routes.length; index++) {
          const element = routes[index];
          if (element.path == "/" + item.path) {
            var children = element.children;
            for (let x = 0; x < children.length; x++) {
              const child = children[x];
              if (child.meta) {
                var topath = this.resolvePath(child.path);
                this.$router.push({path: topath});
                break;
              }
            }
            break;
          } else {
            continue;
          }
        }
      } else {
        // topath = item.path;
        this.$router.push("/" + item.path);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.menu-wrapper {
  text-align: center;
}
.el-menu-item.is-active {
  background: url("../../../assets/image/topbar-item-active-bg.png") no-repeat;
  background-position: top;
  background-size: 100% 55px;
}
.el-menu-item {
  width: 125px;
  font-family: "Microsoft YaHei";
  font-size: 16px;
  line-height: 46px;
  letter-spacing: 1px;
  background: url("../../../assets/image/topbar-item-bg.png") no-repeat;
  background-size: 100% 46px;
  background-position: top;

}
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus {
  background-color: transparent !important;
}
</style>
