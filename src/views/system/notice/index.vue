<template>
  <div style="margin:20px;">
    <el-tabs type="border-card">
      <el-tab-pane label="已发送通知">
        <template slot-scope="scope">
          <div class="app-container">
            <el-form :model="queryParams" ref="queryFormSend" :inline="true" label-width="75px">
              <el-form-item label="公告标题" prop="noticeTitle">
                <el-input
                  @clear="cleanData('noticeTitle')"
                  v-model="queryParams.noticeTitle"
                  placeholder="请输入公告标题"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="创建者" prop="createBy">
                <el-input
                  @clear="cleanData('createBy')"
                  v-model="queryParams.createBy"
                  placeholder="请输入创建者"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="类型" prop="noticeType">
                <el-select
                  @clear="cleanData('noticeType')"
                  v-model="queryParams.noticeType"
                  placeholder="公告类型"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="dict in typeOptions"
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
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleAdd"
                  v-hasPermi="['system:notice:add']"
                >新增</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  :disabled="multiple"
                  @click="handleDelete"
                  v-hasPermi="['system:notice:remove']"
                >删除</el-button>
              </el-col>
            </el-row>
            <el-table
              stripe
              v-loading="loading"
              :data="sendnoticeList"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <!-- <el-table-column label="公告ID" align="center" prop="noticeId" width="100" /> -->
              <el-table-column
                label="公告标题"
                align="center"
                width="180"
                prop="noticeTitle"
                :show-overflow-tooltip="true"
              />
              <!-- <el-table-column
                label="公告内容"
                align="center"
                width="120"
                prop="noticeContent"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <div v-html="scope.row.noticeContent" class="notice-table-cell"></div>
                </template>
              </el-table-column> -->

              <el-table-column
                label="公告类型"
                align="center"
                prop="noticeType"
                :formatter="typeFormat"
                width="180"
              />
              <el-table-column
                label="状态"
                align="center"
                prop="status"
                :formatter="statusFormat"
                width="180"
              />
              <el-table-column label="创建者" align="center" prop="createBy" width="180" />
              <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
                min-width="40px"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-document"
                    @click="handleDetail(scope.row)"
                  >查看</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:notice:remove']"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="sendtotal>0"
              :total="sendtotal"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="已收阅通知">
        <template>
          <div class="app-container">
            <el-form
              :model="queryReceivedParams"
              ref="queryFormrRead"
              :inline="true"
              label-width="75px"
            >
              <el-form-item label="公告标题" prop="noticeTitle">
                <el-input
                  @clear="cleanReceivedParamsData('noticeTitle')"
                  v-model="queryReceivedParams.noticeTitle"
                  placeholder="请输入公告标题"
                  clearable
                  size="small"
                  @keyup.enter.native="handleReceivedQuery"
                />
              </el-form-item>
              <el-form-item label="创建者" prop="createBy">
                <el-input
                  @clear="cleanReceivedParamsData('createBy')"
                  v-model="queryReceivedParams.createBy"
                  placeholder="请输入创建者"
                  clearable
                  size="small"
                  @keyup.enter.native="handleReceivedQuery"
                />
              </el-form-item>
              <el-form-item label="类型" prop="noticeType">
                <el-select
                  @clear="cleanReceivedParamsData('noticeType')"
                  v-model="queryReceivedParams.noticeType"
                  placeholder="公告类型"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="dict in typeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="是否已读" prop="read">
                <el-select
                  @clear="cleanReceivedParamsData('read')"
                  v-model="queryReceivedParams.read"
                  placeholder="是否已读"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="dict in readOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleReceivedQuery"
                >搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetReceivedQuery">重置</el-button>
              </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  :disabled="multiple"
                  @click="noticeUserDelete"
                  v-hasPermi="['system:noticeuser:remove']"
                >删除</el-button>
                <el-button
                  type="primary"
                  icon="el-icon-message"
                  size="mini"
                  @click="updateReadNotice"
                  v-hasPermi="['system:noticeuser:edit']"
                >一键已读</el-button>
              </el-col>
            </el-row>

            <el-table
              stripe
              v-loading="loading"
              :data="receivednoticeList"
              @selection-change="receivedHandleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <!-- <el-table-column label="公告ID" align="center" prop="noticeUserId" width="100" /> -->
              <el-table-column
                label="公告标题"
                align="center"
                width="180"
                prop="noticeTitle"
                :show-overflow-tooltip="true"
              />
              <!-- <el-table-column
                label="公告内容"
                width="120"
                align="center"
                prop="noticeContent"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <div v-html="scope.row.noticeContent" class="notice-table-cell"></div>
                </template>
              </el-table-column> -->
              <el-table-column
                label="公告类型"
                align="center"
                prop="noticeType"
                :formatter="typeFormat"
                width="180"
              />
              <el-table-column
                label="状态"
                align="center"
                prop="status"
                :formatter="statusFormat"
                width="180"
              />
              <el-table-column label="创建者" align="center" prop="createBy" width="180" />
              <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="是否已读" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.read == 0">未读</span>
                  <span v-else-if="scope.row.read == 1">已读</span>
                </template>
              </el-table-column>
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
                    icon="el-icon-message"
                    @click="updateReadNotice(scope.row)"
                    v-hasPermi="['system:noticeuser:edit']"
                  >已读</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-document"
                    @click="handleDetailAndRead(scope.row)"
                  >查看</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="noticeUserDelete(scope.row)"
                    v-hasPermi="['system:noticeuser:remove']"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="receivedtotal>0"
              :total="receivedtotal"
              :page.sync="queryReceivedParams.pageNum"
              :limit.sync="queryReceivedParams.pageSize"
              @pagination="getReceivedList"
            />
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <!-- 详情-->
    <el-dialog :title="titleDetail" :visible.sync="openDetail" width="780px" :append-to-body='true'>
      <div>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            标题:
            <span>{{noticeDetail.noticeTitle}}</span>
          </div>
          <div>内容:</div>
          <div>
              <div v-if="noticeDetail.noticeContent" v-html="noticeDetail.noticeContent">
              </div>
              <div v-else>
                
              </div>
          </div>
        </el-card>
      </div>
      <div slot="footer" class="dialog-footer" style="padding-top:20px">
        <el-button @click="cancelDetail">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" :append-to-body='true'>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input
                @clear="cleanData('noticeTitle')"
                v-model="form.noticeTitle"
                placeholder="请输入公告标题"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select
                @clear="cleanData('noticeType')"
                v-model="form.noticeType"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发送渠道" prop="msgChannel">
              <el-checkbox-group v-model="form.msgChannel">
                <el-checkbox
                  v-for="dict in channelsOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                >{{dict.dictLabel}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="noticeContent">
              <Editor v-model="form.noticeContent" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="padding-top:20px">
        <el-button type="primary" @click="submitForm" :disabled="!submitBtn">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {
  listNotice,
  receivedListNotice,
  getNotice,
  delNotice,
  addNotice,
  updateNotice
} from "@/api/system/notice";
import Editor from "@/components/Editor";
import {
  addNoticeUser,
  delNoticeUser,
  delNoticeUserByNoticeId,
  updateNoticeUserRead,
  selectNoticeUser
} from "@/api/system/noticeuser";
export default {
  name: "Notice",
  components: {
    Editor
  },
  data() {
    return {
      // 遮罩层
      loading: true,

      // channels: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      //已发送总条数
      sendtotal: 0,
      //以收阅总条数
      receivedtotal: 0,
      // 已发送公告表格数据
      sendnoticeList: [],
      //已收阅公告表格数据
      receivednoticeList: [],
      // 弹出层标题
      title: "",
      titleDetail: "详情",
      // 是否显示弹出层
      open: false,
      openDetail: false,
      noticeDetail: {},
      //提交确定按钮是否可用
      submitBtn: true,
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      typeOptions: [],
      //阅读状态数据字典
      readOptions: [],
      //发送渠道数据字典
      channelsOptions: [],
      //发送人员范围
      userScopeOptions: [
        {
          value: "1",
          label: "发送至全部人员"
        },
        {
          value: "2",
          label: "发送至指定人员"
        }
      ],
      //发送人员列表
      deptOptions: [],
      //已收阅通知公告列表
      noticeUser: {
        // noticeUserId: undefined,
        // read: 1
        // noticeTitle: undefined,
        // createBy: undefined,
        // status: undefined,
        // noticeType: undefined
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        noticeTitle: undefined,
        createBy: undefined,
        status: undefined,
        noticeType: undefined
      },
      queryReceivedParams: {
        pageNum: 1,
        pageSize: 10,
        noticeTitle: undefined,
        createBy: undefined,
        noticeType: undefined,
        read: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        noticeTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" }
        ],
        noticeType: [
          { required: true, message: "公告类型不能为空", trigger: "blur" }
        ],
        noticeContent: [
          {
            min: 0,
            max: 1000,
            message: "请内容长度控制在 0 到 1000 个字符之间",
            trigger: "blur"
          }
        ],
        msgChannel: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个发送渠道",
            trigger: "change"
          }
        ]
      },
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  created() {
    this.getList();
    this.getReceivedList();
    this.getDicts("sys_notice_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_notice_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("sys_notice_read").then(response => {
      this.readOptions = response.data;
    });
    this.getDicts("sys_send_channels").then(response => {
      var data = response.data;
      this.channelsOptions = [];
      data.forEach(element => {
        var dic = {
          dictLabel: element.dictLabel,
          dictValue: Number.parseInt(element.dictValue)
        };
        this.channelsOptions.push(dic);
      });
    });
  },
  methods: {
    /** 查询已发送公告列表 */
    getList() {
      this.loading = true;
      listNotice(this.queryParams).then(response => {
        this.sendnoticeList = response.rows;
        this.sendtotal = response.total;
        this.loading = false;
      });
    },
    /**查询已收阅公告列表 */
    getReceivedList() {
      this.loading = true;
      receivedListNotice(this.queryReceivedParams).then(response => {
        this.receivednoticeList = response.rows;
        this.receivedtotal = response.total;
        this.loading = false;
      });
    },
    // 公告状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 公告状态字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.noticeType);
    },
    readFormat(row, column) {
      return this.selectDictLabel(this.readOptions, row.read);
    },
    convertCheckToMsgChannel() {
      let tmpVal = 0;
      for (let i = 0; i < this.form.msgChannel.length; i++) {
        for (let j = 0; j < this.channelsOptions.length; j++) {
          if (this.form.msgChannel[i] == this.channelsOptions[j].dictLabel) {
            tmpVal |= this.channelsOptions[j].dictValue;
          }
        }
      }
      return tmpVal;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelDetail() {
      this.noticeDetail = {};
      this.openDetail = false;
    },
    // 表单重置
    reset() {
      this.form = {
        noticeId: undefined,
        noticeTitle: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        status: "0",
        msgChannel: [],
        userScope: undefined,
        checkedUsers: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handleReceivedQuery() {
      this.queryReceivedParams.pageNum = 1;
      this.getReceivedList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryFormSend");
      this.handleQuery();
    },
    resetReceivedQuery() {
      this.resetForm("queryFormrRead");
      this.handleReceivedQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.noticeId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    receivedHandleSelectionChange(selection) {
      this.ids = selection.map(item => item.noticeUserId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公告";
    },
    handleDetail(row) {
      this.noticeDetail = row;
      this.openDetail = true;
    },
    handleDetailAndRead(row){
      const noticeUserId = row != undefined ? row.noticeUserId : 0;
      this.noticeDetail = row;
      this.openDetail = true;
      if(row.read != 1){
        updateNoticeUserRead({ noticeUserId: noticeUserId }).then(response=>{
          if(response.code == 200){
            row.read = 1;
          }
        });
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const noticeId = row.noticeId || this.ids;
      getNotice(noticeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公告";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          var notice = JSON.parse(JSON.stringify(this.form));
          notice["msgChannel"] = this.convertCheckToMsgChannel();
          if (this.form.noticeId != undefined) {
            updateNotice(notice).then(response => {
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
            // this.form.checkedUsers = this.$refs.dept.getCheckedKeys();
            addNotice(notice)
              .then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                  this.getReceivedList();
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
      const noticeIds = row.noticeId || this.ids;
      this.$confirm(
        '是否确认删除公告编号为"' + noticeIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delNotice(noticeIds);
        })
        .then(() => {
          this.getList();
          this.getReceivedList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /**将未读通知公告修改成已读通知公告 */
    updateReadNotice(row) {
      const noticeUserId = row != undefined ? row.noticeUserId : 0;
      this.$confirm("是否确定已读当前已收阅通知公告?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return updateNoticeUserRead({ noticeUserId: noticeUserId });
        })
        .then(() => {
          this.getReceivedList();
          this.msgSuccess("修改成功");
        })
        .catch(function() {});
    },
    /**
     * 删除通知用户关系表数据
     */
    noticeUserDelete(row) {
      const noticeUserIds = row.noticeUserId || this.ids;
      this.$confirm(
        '是否确认删除公告ID为"' + noticeUserIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delNoticeUser(noticeUserIds);
        })
        .then(() => {
          this.getReceivedList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 对传到后台的数据进行非空判断 */
    cleanData(key) {
      this.queryParams[key] = undefined;
    },
    cleanReceivedParamsData(key) {
      this.queryReceivedParams[key] = undefined;
    }
  }
};
</script>