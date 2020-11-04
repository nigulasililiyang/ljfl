<template>
  <el-table
    class="mytable"
    :data="tableData.data"
    style="width: 100% "
    :row-style="rowStyle"
    :header-row-style="headerRowStyle"
    :header-cell-style="headerCellStyle"
    size="mini"
  >
    <el-table-column
    header-align="center"
    align="center"
      v-for="item in tableData.header"
      v-bind:key="item.id"
      v-bind:prop="item.prop"
      v-bind:label="item.label"
      :width="item.width"
    >
        <el-table-column
        header-align="center"
        align="center"
          v-for="children in item.children"
          v-bind:key="children.id"
          v-bind:prop="children.prop"
          v-bind:label="children.label"
          :width="children.width"
        ></el-table-column>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "basic-table",
  props:{
      tableData: {
        type: Object,
        required: true
      }
  },
  methods:{
     rowStyle(row, rowIndex) {
      if (row.rowIndex % 2 == 0) {
        return { "background-color": "rgba(255,255,255,0.2)" };
      } else {
        return { "background-color": "transparent" };
      }
    },
    headerRowStyle(row, index) {
      return { "background-color": "transparent" };
    },
    headerCellStyle(row, column, rowIndex, columnIndex) {
      return {
        "background-color": "transparent",
        color: "rgba(255, 255, 255, 1)",
        "border-bottom": "none"
      };
    }
  }
}
</script>
<style lang="scss" scoped>
.mytable {
  background-color: transparent;
  color: white;
}
// /* 删除表格下横线 */
// .el-table::before {
//   height: 0px;
// }
</style>