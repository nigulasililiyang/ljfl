<template>
  <div>
    <el-page-header @back="goBack">
      <template slot="title">
        <span>返回</span>
      </template>
      <template slot="content">
        <span>参数管理页面</span>
      </template>
    </el-page-header>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="75px">
        <!-- <el-form-item label="设备模板" prop="deviceTemplateId">
          <el-input
            v-model="queryParams.deviceTemplateId"
            placeholder="请输入对应的设备模板"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <el-form-item label="参数名称" prop="paramName">
          <el-input
            v-model="queryParams.paramName"
            placeholder="请输入参数名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="参数值" prop="paramValue">
          <el-input
            v-model="queryParams.paramValue"
            placeholder="请输入参数值，当param_type为3、4时，此字段表示的是sys_oss表的oss_id"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="参数类型" prop="paramType">
          <el-select
            v-model="queryParams.paramType"
            placeholder="请选择参数类型，1数字，2字符串，3图片，4文件"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in paramTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参数标签" prop="paramTag">
          <el-input
            v-model="queryParams.paramTag"
            placeholder="请输入参数标签，方便前端代码定位"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
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
            v-hasPermi="['v1/template-config:deviceTemplateParams:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['v1/template-config:deviceTemplateParams:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['v1/template-config:deviceTemplateParams:remove']"
          >删除</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['v1/template-config:deviceTemplateParams:export']"
        >导出</el-button>
        </el-col>-->
      </el-row>

      <el-table
        stripe
        v-loading="loading"
        :data="deviceTemplateParamsList"
        @selection-change="handleSelectionChange"
        :row-class-name="getRowClassName"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <single-image v-if="props.row.paramType == 3" :url="baseurl+props.row.url" />
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="参数ID" align="center" prop="deviceTemplateParamsId" /> -->
        <el-table-column label="设备模板" align="center" prop="deviceTemplateName" />
        <el-table-column label="参数名称" align="center" prop="paramName" />
        <el-table-column
          label="参数值"
          align="center"
          prop="paramValue">
          <template slot-scope="props">
              <div v-if="props.row.paramType == 3 || props.row.paramType == 4">--</div>
              <div v-else>{{props.row.paramValue}}</div>
          </template>
        </el-table-column>
        <el-table-column label="参数类型" align="center" prop="paramType" :formatter="paramTypeFormat" />
        <el-table-column label="参数标签" align="center" prop="paramTag" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          min-width="80px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['v1/template-config:deviceTemplateParams:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['v1/template-config:deviceTemplateParams:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <!-- 添加或修改设备模板参数对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="设备模板" prop="deviceTemplateName">
            <el-input v-model="form.deviceTemplateName" :disabled="disabledInput" placeholder="请输入对应的设备模板" />
          </el-form-item>
          <el-form-item label="参数名称" prop="paramName">
            <el-input v-model="form.paramName" placeholder="请输入参数名称" />
          </el-form-item>
          <!--当参数类型是数字或者字符串 时才做显示-->
          <el-form-item
            label="参数值"
            prop="paramValue"
            v-if="this.form.paramType==1||this.form.paramType==2"
          >
            <el-input
              v-model="form.paramValue"
              placeholder="请输入参数值"
            />
          </el-form-item>
          <el-form-item label="参数类型">
            <el-select v-model="form.paramType" placeholder="请选择参数类型，1数字，2字符串，3图片，4文件"
            style="width:100%;">
              <el-option
                v-for="dict in paramTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 不涉及到文件操作时 不显示上传文件的按钮-->
          <el-form-item
            label="上传文件"
            prop="ossId"
            v-if="this.form.paramType==3||this.form.paramType==4"
          >
            <span>{{this.fileName}}</span>
            <el-upload
              class="upload-demo"
              :action="uploadImgUrl"
              :on-success="uploadSuccess"
              :show-file-list="false"
              :accept="fileAccept"
              :before-upload="beforeFileUpload"
              name="file"
              :headers="headers"
            >
              <el-button>上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="参数标签" prop="paramTag">
            <el-input v-model="form.paramTag" placeholder="请输入参数标签，方便前端代码定位" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :disabled="!submitBtn" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  listDeviceTemplateParams,
  getDeviceTemplateParams,
  delDeviceTemplateParams,
  addDeviceTemplateParams,
  updateDeviceTemplateParams,
  exportDeviceTemplateParams
} from "@/api/v1/template-config/deviceTemplateParams";
import { getDevTemplate } from "@/api/devTemplate/devTemplate";
import { getFileList, uploadFile } from "@/api/fileop";
import SingleImage from "../../../../components/FileOp/SingleImage";
import { getToken } from "@/utils/auth";
export default {
  components: {
    SingleImage
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      disabledInput: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 设备模板参数表格数据
      deviceTemplateParamsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //提交确定按钮是否可用
      submitBtn: true,
      // 参数类型，1数字，2字符串，3图片，4文件字典
      paramTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ossId: undefined,
        deviceTemplateId: undefined,
        paramName: undefined,
        paramValue: undefined,
        paramType: undefined,
        paramTag: undefined
      },
      baseurl:process.env.VUE_APP_BASE_API,
      deviceTemplateId: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //文件名
      fileName: "",
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/system/oss/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken()
      },
      fileAccept: "*.*"
    };
  },
  created() {
    this.deviceTemplateId = this.$route.params.deviceTemplateId;
    this.queryParams.deviceTemplateId = this.$route.params.deviceTemplateId;
    this.getList();
    this.getDicts("sys_device_params_type").then(response => {
      this.paramTypeOptions = response.data;
    });
  },
  methods: {
    getRowClassName(prop, rowIndex){
      if (!(prop.row.paramType == 3)) {
        return 'row-expand-cover';
      }
    },
    goBack() {
      this.$router.back();
    },
    uploadSuccess(res, file) {
      if (file.response.code == 200) {
        this.form.paramValue = res.id;
        this.ossId = res.id;
        this.fileName = res.fileName;
      }
    },
    //文件上传前的判断
    beforeFileUpload(file) {
      if (this.form.paramType != 3)
        //如果不是图片类型，上传文件不做限制
        return true;
      const isIMG =
        file.type === "image/jpg" ||
        file.type === "image/jpeg" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isIMG) {
        this.$message.error("上传头像图片只能是 JPG png格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isIMG && isLt2M;
    },
    /** 查询设备模板参数列表 */
    getList() {
      this.loading = true;
      listDeviceTemplateParams(this.queryParams).then(response => {
        this.deviceTemplateParamsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 参数类型，1数字，2字符串，3图片，4文件字典翻译
    paramTypeFormat(row, column) {
      return this.selectDictLabel(this.paramTypeOptions, row.paramType);
    },
    paramValueFormat(row, column) {
      if (row.paramType == 3) {
        var tem;
        getFileList(row.paramValue).then(response => {
          //this.tem = response.rows;
          return (row.paramValue = "--");
        });
      } else if (row.paramType == 4) {
        return (row.paramValue = "--");
      }
      return row.paramValue;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        deviceTemplateParamsId: undefined,
        deviceTemplateId: undefined,
        paramName: undefined,
        paramValue: undefined,
        paramType: undefined,
        paramTag: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.deviceTemplateParamsId);
      this.single = (selection.length != 1);
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      getDevTemplate(this.deviceTemplateId).then(response=>{
        if(response.code==200){
          this.form.deviceTemplateName = response.data.deviceTemplateName;
          this.open = true;
          this.title = "添加设备模板参数";
          this.form.paramType = "1";
        }else{
          this.msgError("获取设备模板信息出错！");
        }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form.deviceTemplateId = row.deviceTemplateId;
      const deviceTemplateParamsId = row.deviceTemplateParamsId || this.ids;
      getDeviceTemplateParams(deviceTemplateParamsId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备模板参数";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deviceTemplateParamsId != undefined) {
            updateDeviceTemplateParams(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            this.submitBtn = false;
            this.form.deviceTemplateId = this.deviceTemplateId;
            addDeviceTemplateParams(this.form)
              .then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const deviceTemplateParamsIds = row.deviceTemplateParamsId || this.ids;
      this.$confirm(
        '是否确认删除设备模板参数编号为"' +
          deviceTemplateParamsIds +
          '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delDeviceTemplateParams(deviceTemplateParamsIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有设备模板参数数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportDeviceTemplateParams(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    /**获取图片或文件路径 */
    getUrl(row) {
      getFileList(row.paramValue).then(response => {
        return response.data[0].url;
      });
    }
  }
};
</script>
<style>
  .row-expand-cover .el-table__expand-icon{visibility:hidden;}
</style>