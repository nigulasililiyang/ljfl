<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="75px">
      <el-form-item label="文件分组" prop="fileGroup">
        <el-select
          v-model="queryParams.fileGroup"
          placeholder="请输入此文件所属的分组"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in fileGroupOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" v-if="isViewOnly != 1">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:ossobject:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:ossobject:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:ossobject:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table class="workflow" stripe v-loading="loading" :data="ossobjectList" @selection-change="handleSelectionChange" :row-class-name="getRowClassName">
      <el-table-column type="expand" width="55" align="center">
        <template slot-scope="props">
          <div v-if="isImage(props) == true">
            <single-image :url="baseurl+props.row.oss.url"  />
          </div>
        </template>
      </el-table-column>

      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="此文件所属的分组" align="center" prop="fileGroup" :formatter="fileGroupFormat" />
      <el-table-column label="文件名" align="center" prop="oss.fileName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="120px">
        <template slot-scope="scope">
          <el-button v-if="isViewOnly != 1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:ossobject:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleDownload(scope.row)"
            v-hasPermi="['system:ossobject:download']"
          >下载</el-button>
          <el-button v-if="isViewOnly != 1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:ossobject:remove']"
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

    <!-- 添加或修改对象存储服务器上的数据（附件）与实体之间的对应关系对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :append-to-body='true'>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文件分组" prop="fileGroup">
          <el-select v-model="form.fileGroup" placeholder="请选择此文件所属的分组">
            <el-option
              v-for="dict in fileGroupOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件" prop="ossId">
          <span>{{this.fileName}}</span>
          <el-upload
            class="upload-demo"
            :action="uploadImgUrl"
            :on-success="uploadSuccess"
            :show-file-list="false"
            :accept='fileAccept'
            name="file"
            :headers="headers"
            >
              <el-button>上传</el-button>
          </el-upload>
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
import { listOssobject, getOssobject, delOssobject, addOssobject, updateOssobject, exportOssobject,downloadFile } from "@/api/v1/system/ossobject";
import { getToken } from '@/utils/auth';
import SingleImage from './SingleImage';
export default {
  name: "OssObject",
  components:{
    SingleImage
  },
  props:{
    /**所属对象名称 */
    objectTableName:{
      type:String,
      default:null
    },
    /**所属对象id */
    objectId:{
      type:Number,
      default:0
    },
    /**是否只读 */
    isViewOnly:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      
      baseurl:process.env.VUE_APP_BASE_API,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 对象存储服务器上的数据（附件）与实体之间的对应关系表格数据
      ossobjectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //提交确定按钮是否可用
      submitBtn: true,
      // 此文件所属的分组，1泵房技术资料，2泵房委外管理，3运维档案管理，4泵房台账管理，5泵房交接管理，6泵房备件管理字典
      fileGroupOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ossId: undefined,
        objectTableName: undefined,
        objectId: undefined,
        fileGroup: undefined
      },
      ossId:null,
      fileName:'',
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/system/oss/upload", // 上传的图片服务器地址
      headers: {
          Authorization: 'Bearer ' + getToken()
      },
      fileAccept : '*.*',
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_oss_file_group").then(response => {
      this.fileGroupOptions = response.data;
    });
  },
  methods: {
    getRowClassName(row, rowIndex){
      if (!this.isImage(row)) {
        return 'row-expand-cover';
      }
    },
    uploadSuccess(res, file) {
      if(file.response.code == 200){
        this.ossId = res.id;
        this.fileName = res.fileName;
      }
    },
      //判断是否为图片
    isImage(props){
      if(props.row.oss == null) return false;
      var val = props.row.oss.fileSuffix;
        if(val == null) return false;
        var lowerCaseVal = val.toLowerCase();
        if(lowerCaseVal == 'jpeg'
          || lowerCaseVal == 'jpg'
          || lowerCaseVal == 'gif'
          || lowerCaseVal == 'png'
          || lowerCaseVal == 'svg'
          || lowerCaseVal == 'bmp')
        return true;

        return false;
    },
    /** 查询对象存储服务器上的数据（附件）与实体之间的对应关系列表 */
    getList() {
      this.loading = true;
      if(this.objectTableName != null){
        this.queryParams.objectTableName = this.objectTableName;
      }
      if(this.objectId != 0){
        this.queryParams.objectId = this.objectId;
      }
      listOssobject(this.queryParams).then(response => {
        this.ossobjectList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 此文件所属的分组，1泵房技术资料，2泵房委外管理，3运维档案管理，4泵房台账管理，5泵房交接管理，6泵房备件管理字典翻译
    fileGroupFormat(row, column) {
      return this.selectDictLabel(this.fileGroupOptions, row.fileGroup);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ossObjectId: undefined,
        ossId: undefined,
        objectTableName: undefined,
        objectId: undefined,
        createTime: undefined,
        updateTime: undefined,
        fileGroup: undefined
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
      this.ids = selection.map(item => item.ossObjectId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加文件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ossObjectId = row.ossObjectId || this.ids
      getOssobject(ossObjectId).then(response => {
        this.form = response.data;
        this.ossId = response.data.ossId;
        this.fileName = response.data.oss.fileName
        this.open = true;
        this.title = "修改文件";
      });
    },
    /** 下载按钮操作 */
    handleDownload(row) {
      const link = document.createElement('a');
      let fileName = row.oss.fileName;
      downloadFile({filePath: row.oss.url}).then(response=>{
        const url = window.URL.createObjectURL(new Blob([response]));
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      },(err)=>{
        this.msgError("文件不存在");
      }).catch(error=>{
        console.log(error);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.objectId = this.objectId;
          this.form.objectTableName = this.objectTableName;
          this.form.ossId = this.ossId;
          if (this.form.ossObjectId && this.form.ossObjectId != 0) {
            updateOssobject(this.form).then(response => {
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
            addOssobject(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
              this.submitBtn = true;
            }).catch(error=>{
              this.submitBtn = true;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ossObjectIds = row.ossObjectId || this.ids;
      let fileName = (row.oss&&row.oss.fileName)?row.oss.fileName:'';
      let msg = '是否确认删除文件' + fileName + '?';
      this.$confirm(msg, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOssobject(ossObjectIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },

  }
};
</script>
<style>
  .row-expand-cover .el-table__expand-icon{visibility:hidden;}
</style>
