<template>
  <div class="app-container">
    <el-row>
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="75px">
        <el-form-item label="模板名称" prop="dataDisplayTemplateName">
          <el-input v-model="queryParams.dataDisplayTemplateName" placeholder="模板名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备模板" prop="deviceTemplateId">
          <el-select v-model="queryParams.deviceTemplateId" placeholder="请选择设备模板" clearable size="small">
            <el-option
              v-for="dict in deviceTemplateOptions"
              :key="dict.deviceTemplateId"
              :label="dict.deviceTemplateName"
              :value="dict.deviceTemplateId">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table class="workflow" stripe :data="this.dataTemplates" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-tree
            :data="props.row.displayPointTemplates"
            node-key="displayPointTemplateId"
            label="displayPointTemplateId"
            default-expand-all
            @node-drag-start="handleDragStart"
            @node-drag-enter="handleDragEnter"
            @node-drag-leave="handleDragLeave"
            @node-drag-over="handleDragOver"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
            :render-content="renderContent"
            draggable
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
          ></el-tree>
        </template>
      </el-table-column>
      <el-table-column label="模板名字" prop="dataDisplayTemplateName"></el-table-column>
      <el-table-column label="设备模板" prop="sysDeviceTemplate.deviceTemplateName"></el-table-column>
      <el-table-column label="创建人员" prop="createUser.nickName"></el-table-column>
      <el-table-column label="显示类型" prop="displayType">
        <template slot-scope="props">
          <div v-if="props.row.displayType==1">表格</div>
          <div v-else-if="props.row.displayType==2">曲线图</div>
          <div v-else-if="props.row.displayType==3">柱状图</div>

        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="handleEdit(scope.row)"
            type="text"
            size="small"
            icon="el-icon-edit"
            v-hasPermi="['v1/display:data-display-template:edit']"
          >修改</el-button>
          <el-button
            @click="handleDelete(scope.row)"
            type="text"
            style="color:#F56C6C;"
            size="mini"
            icon="el-icon-delete"
            v-hasPermi="['v1/display:data-display-template:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="dataTemplatesTotal>0"
      :total="dataTemplatesTotal"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getTablecfgDatatemplates"
    />
    <el-dialog :title="'新增模板'" :visible.sync="open" width="500px" :append-to-body='true'>
      <el-form ref="form" label-width="80px">
        <el-form-item label="模板名称">
          <el-input v-model="updateDataDisplayTemplateName" placeholder="请输入设备模板名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="disabledSave">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  tablecfgDatatemplates,
  updateDataDisplayTemplate,
  delDataDisplayTemplate
} from "../../../../api/v1/display/data-display-template";
import {
  delDisplayPointTemplate,
  updateSort
} from "../../../../api/v1/display/display-point-template";
export default {
  data() {
    return {
      dataTemplates: undefined,
      dataTemplatesTotal: 0,
      dataDisplayTemplateName: undefined,
      open: false,
      updateDataDisplayTemplateId: undefined,
      updateDataDisplayTemplateName: undefined,
      deviceTemplateOptions: [],
      queryParams: {
        displayType: 1,
        pageNum: 1,
        pageSize: 10,
        dataDisplayTemplateName: undefined
      }
    };
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <el-row>
          <div style="margin: 5px 0px 5px 0px;">
            <el-input disabled v-model={node.label}></el-input>
            <el-button
              type="text"
              style="color:#F56C6C;"
              size="mini"
              icon="el-icon-delete"
              on-click={() => this.remove(node, data)}
              v-hasPermi="['v1/display:tablecfg-display-point-template:remove']"
            >
              删除
            </el-button>
          </div>
        </el-row>
      );
    },// 回显数据字典
    getDevTemplate(){
      this.selectDeviceTemplate().then(response => {
        this.deviceTemplateOptions = response.rows;
      });
    },
    remove(node, data) {
      this.$confirm("是否确认删除该模板的显示点位?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delDisplayPointTemplate(data.displayPointTemplateId).then(() => {
            for (let i = 0; i < this.dataTemplates.length; i++) {
              let dataTemplate = this.dataTemplates[i];
              if (
                dataTemplate.dataDisplayTemplateId == data.dataDisplayTemplateId
              ) {
                let displayPointTemplates = this.dataTemplates[i]
                  .displayPointTemplates;
                for (let j = 0; j < displayPointTemplates.length; j++) {
                  let displayPointTemplate = displayPointTemplates[j];
                  if (
                    displayPointTemplate.displayPointTemplateId ==
                    data.displayPointTemplateId
                  ) {
                    this.dataTemplates[i].displayPointTemplates.splice(j, 1);
                  }
                }
              }
            }
            this.msgSuccess("删除成功");
          });
        })
        .catch(function() {});
    },
    handleDragStart(node, ev) {
    },
    handleDragEnter(draggingNode, dropNode, ev) {
    },
    handleDragLeave(draggingNode, dropNode, ev) {
    },
    handleDragOver(draggingNode, dropNode, ev) {
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      let nodes = dropNode.parent.childNodes;
      let result = [];
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        result.push(node.key);
      }
      updateSort({ displayPointTemplateIds: result.toString() }).then(
        response => {
          if (this.success(response)) {
          }
        }
      );
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
    },
    allowDrop(draggingNode, dropNode, type) {
      if (type == "prev" || type == "next") {
        return true;
      } else {
        return false;
      }
    },
    handleQuery() {
      this.getTablecfgDatatemplates();
    },
    resetQuery() {
      this.$refs["queryForm"].resetFields();
      this.handleQuery();
    },
    allowDrag(draggingNode) {
      return true;
    },
    submitForm() {
      updateDataDisplayTemplate({
        dataDisplayTemplateId: this.updateDataDisplayTemplateId,
        dataDisplayTemplateName: this.updateDataDisplayTemplateName
      }).then(response => {
        if (this.success(response)) {
          this.getTablecfgDatatemplates();
          this.msgSuccess("修改成功");
          this.open = false;
        }
      });
      return true;
    },
    getTablecfgDatatemplates() {
      tablecfgDatatemplates(this.queryParams).then(response => {
        if (this.success(response)) {
          this.dataTemplatesTotal = response.total;
          let rows = [];
          for (let i = 0; i < response.rows.length; i++) {
            let row = response.rows[i];
            let result = [];
            for (let j = 0; j < row.displayPointTemplates.length; j++) {
              let displayPointTemplate = row.displayPointTemplates[j];
              if (displayPointTemplate == undefined) {
              }
              if (displayPointTemplate.pointTemplate == undefined) {
              }
              displayPointTemplate.label = this.getTreeLabel(
                displayPointTemplate
              );
              displayPointTemplate.id =
                displayPointTemplate.displayPointTemplateId;
              result.push(displayPointTemplate);
            }
            row.displayPointTemplates = result;
            rows.push(row);
          }
          this.dataTemplates = rows;
        }
      });
    },
    /** 新增按钮操作 */
    handleEdit(row) {
      this.updateDataDisplayTemplateName = row.dataDisplayTemplateName;
      this.updateDataDisplayTemplateId = row.dataDisplayTemplateId;
      this.open = true;
    },
    getTreeLabel(displayPointTemplate) {
      let pointName = displayPointTemplate.pointTemplate.pointName;
      if (displayPointTemplate.handleFunc == "mean") {
        // pointName+='平均值';
      } else if (displayPointTemplate.handleFunc == "min") {
        pointName += "最小值";
      } else if (displayPointTemplate.handleFunc == "max") {
        pointName += "最大值";
      } else if (displayPointTemplate.handleFunc == "sum") {
        pointName += "总合";
      }
      return pointName;
    },
    handleDelete(row) {
      // if (row.displayPointTemplates.length > 0) {
      //   this.msgError("请先删除模板相关的点位！");
      //   return;
      // }
      this.$confirm("删除该设备报表会同时删除相关联得数据,是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delDataDisplayTemplate(row.dataDisplayTemplateId).then(response => {
          if (this.success(response)) {
            this.getTablecfgDatatemplates();
            this.msgSuccess("删除成功");
          }
        });
      });
    },
    cancel() {
      this.open = false;
    },
    success(response) {
      if (response.code == 200) {
        return true;
      } else {
        this.$message({
          showClose: true,
          message: reponse.msg,
          type: "error"
        });
        return false;
      }
    }
  },
  created() {
    this.getTablecfgDatatemplates();
    this.getDevTemplate();
  },
  computed: {
    disabledSave: function() {
      if (
        this.updateDataDisplayTemplateName == undefined ||
        this.updateDataDisplayTemplateName === ""
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>