<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="75px">
      <el-form-item label="校验规则" prop="checkRule">
        <el-select v-model="queryParams.checkRule" placeholder="请选择校验规则" clearable size="small">
          <el-option
            v-for="dict in checkRuleOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="设备模板" prop="deviceTemplateId">
        <el-select
          v-model="queryParams.deviceTemplateId"
          placeholder="请选择设备模板"
          @change="handleModeChange2"
        >
          <el-option
            v-for="mode in modeOptions"
            :key="mode.deviceTemplateId"
            :label="mode.deviceTemplateName"
            :value="mode.deviceTemplateId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="告警名称" prop="alarmBaseId">
        <el-select v-model="queryParams.alarmBaseId" placeholder="请选择告警名称">
          <el-option
            v-for="mode in alarmBaseOptions"
            :key="mode.alarmBaseId"
            :label="mode.alarmBaseName"
            :value="mode.alarmBaseId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="点位模板" prop="pointTemplateId">
        <el-select
          v-model="queryParams.pointTemplateId"
          filterable
          placeholder="请选择点位模板"
          @change="handlePointNameChange"
        >
          <template slot="prefix">
            <svg-icon icon-class="search" style="width:25px" />
          </template>
          <el-option
            v-for="mode in pointOptions"
            :key="mode.pointTemplateId"
            :label="mode.pointName"
            :value="mode.pointTemplateId"
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
          v-hasPermi="['v1/SysAlarmPoint:SysAlarmPoint:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['v1/SysAlarmPoint:SysAlarmPoint:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['v1/SysAlarmPoint:SysAlarmPoint:remove']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['v1/SysAlarmPoint:SysAlarmPoint:export']"
        >导出</el-button>
      </el-col> -->
    </el-row>

    <el-table
      stripe
      v-loading="loading"
      :data="sysAlarmPointList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="告警点位ID" align="center" prop="alarmPointId" /> -->
      <el-table-column label="设备模板" align="center" prop="deviceTemplateName" />
      <el-table-column label="告警名称" align="center" prop="alarmBaseName" />
      <el-table-column label="点位模板" align="center" prop="pointName" />
      <el-table-column label="校验规则" align="center" prop="checkRule" :formatter="checkRuleFormat" />
      <el-table-column label="数据索引" align="center" prop="dataIndex" />
      <el-table-column label="比较值" align="center" prop="compareValue" />
      <el-table-column label="范围上限" align="center" prop="compareMax" />
      <el-table-column label="范围下限" align="center" prop="compareMin" />
      <el-table-column label="创建工作流" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.workflowEnable"
            :active-value='activeValue'
            :inactive-value='inactiveValue'
            @change="handleEnableWorkflow(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="80px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['v1/SysAlarmPoint:SysAlarmPoint:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['v1/SysAlarmPoint:SysAlarmPoint:remove']"
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

    <!-- 添加或修改告警点位映射，用于告警基础与点位模板的映射对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :append-to-body='true'>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备模板" prop="deviceTemplateId">
          <el-select
            style="width:100%;"
            v-model="form.deviceTemplateId"
            placeholder="请选择设备模板"
            @change="handleModeChange"
          >
            <el-option
              v-for="mode in modeOptions"
              :key="mode.deviceTemplateId"
              :label="mode.deviceTemplateName"
              :value="mode.deviceTemplateId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="校验规则" prop="checkRule">
          <el-select style="width:100%;" v-model="form.checkRule" placeholder="请选择校验规则">
            <el-option
              v-for="dict in checkRuleOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="formate(dict.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据索引" prop="dataIndex">
          <el-input v-model="form.dataIndex" placeholder="数据索引" />
        </el-form-item>
        <el-form-item label="告警名称" prop="alarmBaseId">
          <el-select style="width:100%;" v-model="form.alarmBaseId" placeholder="请选择告警名称">
            <el-option
              v-for="mode in alarmBaseOptions"
              :key="mode.alarmBaseId"
              :label="mode.alarmBaseName"
              :value="mode.alarmBaseId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="点位模板">
          <el-select
            style="width:100%;"
            v-model="form.pointTemplateId"
            filterable
            placeholder="请选择点位模板"
            @change="handlePointNameChange"
          >
            <template slot="prefix">
              <svg-icon icon-class="search" style="width:25px" />
            </template>
            <el-option
              v-for="mode in pointOptions"
              :key="mode.pointTemplateId"
              :label="mode.pointName"
              :value="mode.pointTemplateId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="告警频率">
          <el-input v-model="form.alarmFreq" type="number" placeholder="单位秒，0表示不进行循环告警，只触发一次" />
        </el-form-item>
        <el-form-item label="语音播报">
          <el-switch
              v-model="form.voice"
              :active-value="'1'"
              :inactive-value="'0'"
              active-color="#13ce66"
            ></el-switch>
        </el-form-item>
        <el-form-item v-if="form.checkRule==1 || form.checkRule==3" label="比较值" prop="compareValue">
          <el-input v-model="form.compareValue" placeholder="比较值" :rules="rules" />
        </el-form-item>
        <el-form-item v-if="form.checkRule==4 || form.checkRule==2" label="范围上限" prop="compareMax">
          <el-input v-model="form.compareMax" placeholder="范围上限" :rules="rules" />
        </el-form-item>
        <el-form-item v-if="form.checkRule==4 || form.checkRule==2" label="范围下限" prop="compareMin">
          <el-input v-model="form.compareMin" placeholder="范围下限" :rules="rules" />
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
  listSysAlarmPoint,
  getSysAlarmPoint,
  delSysAlarmPoint,
  addSysAlarmPoint,
  updateSysAlarmPoint,
  exportSysAlarmPoint,
  changeWorkflowEnable
} from "@/api/v1/SysAlarmPoint/SysAlarmPoint";
import { listDevTemplate } from "@/api/devTemplate/devTemplate";
import { listSysPointTemplate } from "@/api/sysPointTemplate/sysPointTemplate";
import { listAlarmbases } from "@/api/v1/alarm-management/alarmbases";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      activeValue: 1,
      inactiveValue: 0,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,

      // 总条数
      total: 0,
      // 告警点位映射，用于告警基础与点位模板的映射表格数据
      sysAlarmPointList: [],
      // 校验规则
      checkRuleOptions: [],
      // 设备模板
      modeOptions: [],
      // 点位模板
      pointOptions: [],
      // 告警名称
      alarmBaseOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //提交确定按钮是否可用
      submitBtn: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        checkRule: undefined,
        dataIndex: undefined,
        alarmBaseId: undefined,
        pointTemplateId: undefined,
        compareValue: undefined,
        compareMax: undefined,
        compareMin: undefined,
        deviceTemplateId: undefined
      },
      //点位模板的查询参数
      queryPointParams: {
        deviceTemplateId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        compareValue: [
          {
            required: function() {
              return this.form.checkRule == 1 || this.form.checkRule == 3;
            },
            message: "比较值不能为空",
            trigger: "blur"
          }
        ],
        compareMax: [
          {
            required: function() {
              return this.form.checkRule == 2 || this.form.checkRule == 4;
            },
            message: "比较上限不能为空",
            trigger: "blur"
          }
        ],
        compareMin: [
          {
            required: function() {
              return this.form.checkRule == 2 || this.form.checkRule == 4;
            },
            message: "比较下限不能为空",
            trigger: "blur"
          }
        ],
        deviceTemplateId: [
          { required: true, message: "设备模板不能为空", trigger: "blur" }
        ],
        checkRule: [
          { required: true, message: "检验规则不能为空", trigger: "blur" }
        ],
        alarmBaseId: [
          { required: true, message: "告警名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_check_rule").then(response => {
      this.checkRuleOptions = response.data;
    });
    this.queryPointParams.deviceTemplateId = this.form.deviceTemplateId;
    this.getModeOptions();
    this.getAlarmBaseList();
    this.getPointTemplateList();
  },
  methods: {
    formate(value) {
      return Number(value);
    },
    handleModeChange(val) {
      this.queryPointParams.deviceTemplateId = this.form.deviceTemplateId;
      this.getPointTemplateList();
    },
    handleModeChange2(val) {
      this.queryPointParams.deviceTemplateId = this.queryParams.deviceTemplateId;
      this.getPointTemplateList();
    },
    handlePointNameChange() {
      //this.queryPointParams.deviceTemplateId = this.queryParams.deviceTemplateId;
      //this.getPointTemplateList();
    },
    // 查询设备模板列表
    getModeOptions() {
      listDevTemplate().then(response => {
        this.modeOptions = response.rows;
      });
    },
    //根据参数查询点位模板列表
    getPointTemplateList() {
      listSysPointTemplate(this.queryPointParams).then(response => {
        this.pointOptions = response.rows;
      });
    },
    // 查询告警名称列表
    getAlarmBaseList() {
      listAlarmbases().then(response => {
        this.alarmBaseOptions = response.rows;
      });
    },
    /** 查询告警点位映射，用于告警基础与点位模板的映射列表 */
    getList() {
      this.loading = true;
      listSysAlarmPoint(this.queryParams).then(res => {
        this.sysAlarmPointList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    checkRuleFormat(row, column) {
      return this.selectDictLabel(this.checkRuleOptions, row.checkRule);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        alarmPointId: undefined,
        checkRule: undefined,
        dataIndex: undefined,
        alarmBaseId: undefined,
        pointTemplateId: undefined,
        createTime: undefined,
        updateTime: undefined,
        compareValue: undefined,
        compareMax: undefined,
        compareMin: undefined,
        alarmFreq: undefined,
        voice: '0'
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
      this.ids = selection.map(item => item.alarmPointId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加告警点位映射";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const alarmPointId = row.alarmPointId || this.ids;
      getSysAlarmPoint(alarmPointId).then(response => {
        this.form = response.data;
        this.queryPointParams.deviceTemplateId = this.form.deviceTemplateId
        this.getPointTemplateList();
        this.open = true;
        this.title = "修改告警点位映射";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.alarmPointId != undefined) {
            updateSysAlarmPoint(this.form).then(response => {
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
            addSysAlarmPoint(this.form).then(response => {
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
      const alarmPointIds = row.alarmPointId || this.ids;
      this.$confirm(
        '删除该告警点位会同时删除相关联的数据,是否确认删除?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delSysAlarmPoint(alarmPointIds);
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
      this.$confirm("是否确认导出所有告警点位映射数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportSysAlarmPoint(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // 任务状态修改
    handleEnableWorkflow(row) {
      let text = row.workflowEnable === 1 ? "启用" : "停用";
      this.$confirm(
        '确认要"' +
          text +
          '""' +
          row.pointName +
          '"告警时自动产生工作流功能吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return changeWorkflowEnable(row.alarmPointId, row.workflowEnable);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.workflowEnable = (row.workflowEnable === "0" ? "1" : "0");
        });
    }
  }
};
</script>