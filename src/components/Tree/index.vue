<template>
  <div class="tree-container">
    <div class="searchbox">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    </div>
    <el-tree
      class="filter-tree"
      :data="treeData.data"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      :highlight-current="true"
      ref="tree"
    ></el-tree>
  </div>
</template>
<script>
export default {
  props:{
    treeData:{
      type:Object,
      required:true
    }

  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },

  data() {
    return {
      filterText: "",
    
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.tree-container {
  //   border: solid 1px #5d9bb6;
  // background: url("../../assets/image/tree-bg.png")no-repeat;
  //   background-size: 100%;
  // background-position: center;
  // overflow-y: auto;
  // text-align: center;
  height: 100%;
  .searchbox {
    padding: 20px;
    height: 70px;
  }
  .el-input__inner {
    border-color: #5d9bb6;
    background-color: transparent;
    color: white;
  }
  .filter-tree {
    overflow-y: auto;
    height: calc(100% - 70px);
  }
}
.cls-1 {
  fill: #00b9f4;
  fill-opacity: 0.03;
  stroke: #003c6b;
  stroke-linejoin: round;
  stroke-width: 2px;
}

.cls-1,
.cls-4 {
  fill-rule: evenodd;
}

.cls-2 {
  mix-blend-mode: lighten;
}

.cls-3 {
  font-size: 16px;
  fill: #fff;
  font-family: SourceHanSansCN;
  font-weight: 500;
}

.cls-4 {
  fill: #0092af;
}
</style>>