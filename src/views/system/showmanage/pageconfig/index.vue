<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="75px">
      <el-form-item label="页面名称" prop="componentName">
        <el-input v-model="queryParams.componentName" placeholder="页面名称" clearable></el-input>
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
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['v1/display:display-set:add']"
        >新增</el-button>
      </el-col>
       <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete"
          v-hasPermi="['v1/display:display-set:remove']"
          :disabled="multiple"
        >删除</el-button>
       </el-col>
    </el-row>
    <el-table
      stripe
      ref="multipleTable"
      style="width: 100%"
      :data="displaySet"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection"  width="55"></el-table-column>
      <el-table-column prop="componentName" label="页面名称"></el-table-column>
      <el-table-column label="模板名称">
        <template slot-scope="scope">{{scope.row.dataDisplayTemplate.dataDisplayTemplateName}}</template>
      </el-table-column>
      <el-table-column label="设备模板" prop="sysDeviceTemplate.deviceTemplateName"></el-table-column>
      <el-table-column label="显示类型" prop="dataDisplayTemplate.displayType">
        <template slot-scope="props">
          <div v-if="props.row.dataDisplayTemplate.displayType==1">表格</div>
          <div v-else-if="props.row.dataDisplayTemplate.displayType==2">曲线图</div>
          <div v-else-if="props.row.dataDisplayTemplate.displayType==3">柱状图</div>

        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['v1/display:display-set:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
            v-hasPermi="['v1/display:display-set:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="displaySetTotal > 0"
      :total="displaySetTotal"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getDisplaySet"
    />
    <el-dialog :title="title" :visible.sync="open" width="500px" :append-to-body='true'>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="名称" prop="componentName">
          <el-input v-model="form.componentName" placeholder="请输入页面名称" />
        </el-form-item>
        <el-form-item label="设备模板" prop="deviceTemplateId">
          <el-select style="width:100%" v-model="form.deviceTemplateId" placeholder="请选择设备模板" @change="deviceTemplateChange">
            <el-option
              v-for="dict in deviceTemplateOptions"
              :key="dict.deviceTemplateId"
              :label="dict.deviceTemplateName"
              :value="dict.deviceTemplateId">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示模板" prop="dataDisplayTemplateId">
          <el-select style="width:100%" v-model="form.dataDisplayTemplateId" placeholder="请选择显示模板">
            <el-option
              v-for="dict in dataDisplayTemplates"
              :key="dict.dataDisplayTemplateId"
              :label="dict.dataDisplayTemplateName"
              :value="dict.dataDisplayTemplateId"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="!submitBtn" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  listDisplaySet,
  addDisplaySet,
  delDisplaySet,
  getDisplaySet,
  updateDisplaySet
} from "../../../../api/v1/display/display-set";
import { listDataDisplayTemplate } from "../../../../api/v1/display/data-display-template";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
       // 非多个禁用
      multiple: true,
      displaySet: undefined,
      displaySetTotal: 0,
      dataDisplayTemplates: [],
      deviceTemplateOptions: [],
      queryDataDisplayTemplatPageeName: undefined,
      displaySetId: undefined,
      open: false,
      //提交确定按钮是否可用
      submitBtn: true,
      form: {},
      //表单验证
      rules: {
        deviceTemplateId: [
          { required: true, message: "设备模板不能为空", trigger: "blur" }
        ],
        componentName: [
          { required: true, message: "页面名称不能为空", trigger: "blur" }
        ],
        dataDisplayTemplateId: [
          { required: true, message: "设备模板不能为空", trigger: "blur" }
        ]
      },
      // 弹出层标题
      title: "",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        componentName: undefined
      }
    };
  },
  created() {
    this.getDisplaySet();
    this.getDevTemplate();
  },
  methods: {
    deviceTemplateChange(val){ 
      if(this.form.dataDisplayTemplateId){
      this.form.dataDisplayTemplateId = undefined;
      }
      this.dataDisplayTemplates = [];
      if(val == undefined){
        return;
      }
      this.getDataDisplayTemplate(val);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.displaySetId)
      this.multiple = !selection.length
    },// 回显数据字典
    getDevTemplate(){
      this.selectDeviceTemplate().then(response => {
        this.deviceTemplateOptions = response.rows;
      });
    },
    getDisplaySet() {
      this.loading = true;
      listDisplaySet(this.queryParams).then(response => {
        if (this.success(response)) {
          this.open = false;
          this.displaySetTotal = response.total;
          this.displaySet = response.rows;
        }
        this.loading = false;
      });
    },
    getDataDisplayTemplate(deviceTemplateId) {
      listDataDisplayTemplate({deviceTemplateId:deviceTemplateId}).then(response => {
        if (this.success(response)) {
          this.dataDisplayTemplates = response.rows;
        }
      });
    },
    handleUpdate(row) {
      this.reset();
      this.displaySetId = row.displaySetId;
      this.deviceTemplateChange(row.deviceTemplateId);
      getDisplaySet(row.displaySetId).then(response => {
        if (this.success(response)) {
          this.form = response.data;
          this.open = true;
          this.title = "修改页面模板";
        }
      });
    },
    handleDelete(row) {
      const displaySetId = row.displaySetId || this.ids;
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delDisplaySet(displaySetId).then(response => {
            if (this.success(response)) {
              this.msgSuccess("删除成功！");
              this.getDisplaySet();
            }
          });
        })
        .catch(function() {});
    },
    handleQuery() {
      this.getDisplaySet();
    },
    resetQuery() {
      this.$refs["queryForm"].resetFields();
      this.handleQuery();
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增页面模板";
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.displaySetId) {
            this.form.displaySetId = this.displaySetId;
            updateDisplaySet(this.form).then(response => {
              if (this.success(response)) {
                this.msgSuccess("操作成功！");
                this.getDisplaySet();
              }
            });
          } else {
            this.submitBtn= false;
            addDisplaySet(this.form)
              .then(response => {
                if (this.success(response)) {
                  this.msgSuccess("操作成功！");
                  this.getDisplaySet();
                }
                this.submitBtn = true;
              })
              .catch(error => {
                this.submitBtn = true;
              });
          }
        }
      });
    },
    reset() {
      this.form = {};
      this.resetForm("form");
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
  }
};
</script>