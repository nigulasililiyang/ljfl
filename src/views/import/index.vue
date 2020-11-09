<template>
  <div class="app-container">
    <el-page-header title="重新选择" @back="goBack" :content="content">
    </el-page-header>
    <div>
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <el-form
            ref="elForm"
            :model="formData"
            :rules="rules"
            size="small"
            label-position="top"
          >
            <el-form-item>
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                :disabled="level!='district'"
                >全选</el-checkbox
              >
              <div style="margin: 15px 0"></div>
            </el-form-item>
            <el-form-item>
              <el-checkbox-group
                v-model="checkedModules"
                @change="handleCheckedModulesChange"
              >
                <el-checkbox
                  v-for="item in importModules"
                  :label="item.id"
                  :key="item.id"
                  >{{ item.name }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <div v-if="checkedModules.includes(1)">
              <div class="group-title">分类收集</div>
              <div class="group-content">
                <el-form-item label="已实现分类小区数量（个）" prop="field111">
                  <el-input
                    v-model="formData.field111"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
                <el-form-item label="所有分类小区数量（个）" prop="field113">
                  <el-input
                    v-model="formData.field113"
                    placeholder="请输入"
                    clearable

                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="分类示范小区总数量（个）" prop="field114">
                  <el-input
                    v-model="formData.field114"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="分类示范小区中已实现分类的小区数量（个）"
                  prop="field115"
                >
                  <el-input
                    v-model="formData.field115"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="实行分类运输的小区数量（个）"
                  prop="field116"
                >
                  <el-input
                    v-model="formData.field116"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
              </div>
            </div>

            <div v-if="checkedModules.includes(2)">
              <div class="group-title">分类运输</div>
              <div class="group-content">
                <el-form-item
                  label="实行分类运输的小区数量（个）"
                  prop="field117"
                >
                  <el-input
                    v-model="formData.field117"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
                <el-form-item label="所有小区数量（个）" prop="field118">
                  <el-input
                    v-model="formData.field118"
                    placeholder="请输入"
                    clearable

                  >
                  </el-input>
                </el-form-item>
              </div>
            </div>

            <div v-if="checkedModules.includes(3)">
              <div class="group-title">分类处理</div>
              <div class="group-content">
                <el-form-item label="生活垃圾焚烧处理量（t）" prop="field119">
                  <el-input
                    v-model="formData.field119"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
                <el-form-item label="生活垃圾填埋处理量（t）" prop="field120">
                  <el-input
                    v-model="formData.field120"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
                <el-form-item label="生活垃圾清运量（t）" prop="field122">
                  <el-input
                    v-model="formData.field122"
                    placeholder="请输入"
                    clearable

                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="厨余垃圾处理能力（t/d）" prop="field123">
                  <el-input
                    v-model="formData.field123"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
                <el-form-item label="有害垃圾处理能力（t/d）" prop="field124">
                  <el-input
                    v-model="formData.field124"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
                <el-form-item label="实际厨余垃圾处理量（t/d）" prop="field125">
                  <el-input
                    v-model="formData.field125"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
                <el-form-item label="实际有害垃圾处理量（t/d）" prop="field126">
                  <el-input
                    v-model="formData.field126"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
              </div>
            </div>

            <div v-if="checkedModules.includes(4)">
              <div class="group-title">分类回收</div>
              <div class="group-content">
                <el-form-item label="回收的生活垃圾量（t/d）" prop="field127">
                  <el-input
                    v-model="formData.field127"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="每天回收的可回收物量（t/d）"
                  prop="field128"
                >
                  <el-input
                    v-model="formData.field128"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
              </div>
            </div>

            <div v-if="checkedModules.includes(5)">
              <div class="group-title">社会因素</div>
              <div class="group-content">
                <el-form-item label="支持垃圾分类人数（人）" prop="field129">
                  <el-input
                    v-model="formData.field129"
                    placeholder="请输入"
                    clearable

                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="调查区域居民总人数（人）" prop="field130">
                  <el-input
                    v-model="formData.field130"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
                <el-form-item label="知晓垃圾分类人数（人）" prop="field131">
                  <el-input
                    v-model="formData.field131"
                    placeholder="请输入"
                    clearable

                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="常住人口中具有大专以上学历（包括在校生）的人数"
                  prop="field132"
                >
                  <el-input
                    v-model="formData.field132"
                    placeholder="请输入"
                    clearable

                  ></el-input>
                </el-form-item>
              </div>
            </div>

            <div v-if="checkedModules.includes(6)">
              <div class="group-title">宣传教育</div>
              <div class="group-content">
                <el-form-item
                  label="是否将垃圾分类编入教材或知识读本"
                  prop="field134"
                >
                  <el-radio-group v-model="formData.field134" size="medium">
                    <el-radio
                      v-for="(item, index) in fieldOptions"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否开展宣传教育活动" prop="field135">
                  <el-radio-group v-model="formData.field135" size="medium">
                    <el-radio
                      v-for="(item, index) in fieldOptions"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否纳入教育体系" prop="field136">
                  <el-radio-group v-model="formData.field136" size="medium">
                    <el-radio
                      v-for="(item, index) in fieldOptions"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>

            <div v-if="checkedModules.includes(7)">
              <div class="group-title">经济因素</div>
              <div class="group-content">
                <el-form-item label="环卫投资（万元）" prop="field137">
                  <el-input
                    v-model="formData.field137"
                    placeholder="请输入"
                    clearable

                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="人均GDP（万元）" prop="field138">
                  <el-input
                    v-model="formData.field138"
                    placeholder="请输入"
                    clearable

                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="城市GDP（万元）" prop="field139">
                  <el-input
                    v-model="formData.field139"
                    placeholder="请输入"
                    clearable

                  >
                  </el-input>
                </el-form-item>
              </div>
            </div>

            <div v-if="checkedModules.includes(8)">
              <div class="group-title">工作基础</div>
              <div class="group-content">
                <el-form-item
                  label="有无垃圾分类相关管理机构、组织或联席会议制度"
                  prop="field140"
                >
                  <el-radio-group v-model="formData.field140" size="medium">
                    <el-radio
                      v-for="(item, index) in fieldOptions"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="有无垃圾分类工作协调机制、责任落实"
                  prop="field141"
                >
                  <el-radio-group v-model="formData.field141" size="medium">
                    <el-radio
                      v-for="(item, index) in fieldOptions"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="有无垃圾分类培训业务" prop="field142">
                  <el-radio-group v-model="formData.field142" size="medium">
                    <el-radio
                      v-for="(item, index) in fieldOptions"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="有无具体的垃圾分类工作办法"
                  prop="field143"
                >
                  <el-radio-group v-model="formData.field143" size="medium">
                    <el-radio
                      v-for="(item, index) in fieldOptions"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="有无垃圾分类监督机制" prop="field144">
                  <el-radio-group v-model="formData.field144" size="medium">
                    <el-radio
                      v-for="(item, index) in fieldOptions"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="有无垃圾分类反馈机制" prop="field145">
                  <el-radio-group v-model="formData.field145" size="medium">
                    <el-radio
                      v-for="(item, index) in fieldOptions"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="有无2017年后更新的法律法规"
                  prop="field146"
                >
                  <el-radio-group v-model="formData.field146" size="medium">
                    <el-radio
                      v-for="(item, index) in fieldOptions"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="有无2017年后更新的法律法规"
                  prop="field147"
                >
                  <el-radio-group v-model="formData.field147" size="medium">
                    <el-radio
                      v-for="(item, index) in fieldOptions"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <el-form-item size="large">
              <el-row type="flex" justify="center">
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-row>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
    computed: {
    level() {
      return this.$store.state.chinaMap.level;
    },
    currentArea() {
      return this.$store.state.chinaMap.currentArea;
    },
    currentAdcode() {
      return this.$store.state.chinaMap.currentAdcode;
    },
    content() {
        return this.$store.state.chinaMap.currentArea+ "(" + this.$store.state.chinaMap.level + ")";
    },
  },
  data() {
    return {
      isIndeterminate: true,
      checkAll: false,
      checkedModules: [],
      importModules: [
        { id: 1, name: "分类收集" },
        { id: 2, name: "分类运输" },
        { id: 3, name: "分类处理" },
        { id: 4, name: "分类回收" },
        { id: 5, name: "社会因素" },
        { id: 6, name: "宣传教育" },
        { id: 7, name: "经济因素" },
        { id: 8, name: "工作基础" },
      ],
      formData: {
        field111: undefined,
        field113: undefined,
        field114: undefined,
        field115: undefined,
        field116: undefined,
        field117: undefined,
        field118: undefined,
        field119: undefined,
        field120: undefined,
        field122: undefined,
        field123: undefined,
        field124: undefined,
        field125: undefined,
        field126: undefined,
        field127: undefined,
        field128: undefined,
        field129: undefined,
        field130: undefined,
        field131: undefined,
        field132: undefined,
        field134: 2,
        field135: 2,
        field136: 2,
        field137: undefined,
        field138: undefined,
        field139: undefined,
        field140: 2,
        field141: 2,
        field142: 2,
        field143: 2,
        field144: 2,
        field145: 2,
        field146: 2,
        field147: 2,
      },
      rules: {
        field111: [
          {
            required: true,
            message: "请输入已实现分类小区数量（个）",
            trigger: "blur",
          },
        ],
        field113: [
          {
            required: true,
            message: "请输入所有分类小区数量（个）",
            trigger: "blur",
          },
        ],
        field114: [
          {
            required: true,
            message: "请输入分类示范小区总数量（个）",
            trigger: "blur",
          },
        ],
        field115: [
          {
            required: true,
            message: "请输入分类示范小区中已实现分类的小区数量（个）",
            trigger: "blur",
          },
        ],
        field116: [
          {
            required: true,
            message: "请输入实行分类运输的小区数量（个）",
            trigger: "blur",
          },
        ],
        field117: [
          {
            required: true,
            message: "请输入实行分类运输的小区数量（个）",
            trigger: "blur",
          },
        ],
        field118: [
          {
            required: true,
            message: "请输入所有小区数量（个）",
            trigger: "blur",
          },
        ],
        field119: [
          {
            required: true,
            message: "请输入生活垃圾焚烧处理量（t）",
            trigger: "blur",
          },
        ],
        field120: [
          {
            required: true,
            message: "请输入生活垃圾填埋处理量（t）",
            trigger: "blur",
          },
        ],
        field122: [
          {
            required: true,
            message: "请输入生活垃圾清运量（t）",
            trigger: "blur",
          },
        ],
        field123: [
          {
            required: true,
            message: "请输入厨余垃圾处理能力（t/d）",
            trigger: "blur",
          },
        ],
        field124: [
          {
            required: true,
            message: "请输入有害垃圾处理能力（t/d）",
            trigger: "blur",
          },
        ],
        field125: [
          {
            required: true,
            message: "请输入实际厨余垃圾处理量（t/d）",
            trigger: "blur",
          },
        ],
        field126: [
          {
            required: true,
            message: "请输入实际有害垃圾处理量（t/d）",
            trigger: "blur",
          },
        ],
        field127: [
          {
            required: true,
            message: "请输入回收的生活垃圾量（t/d）",
            trigger: "blur",
          },
        ],
        field128: [
          {
            required: true,
            message: "请输入每天回收的可回收物量（t/d）",
            trigger: "blur",
          },
        ],
        field129: [
          {
            required: true,
            message: "请输入支持垃圾分类人数（人）",
            trigger: "blur",
          },
        ],
        field130: [
          {
            required: true,
            message: "请输入调查区域居民总人数（人）",
            trigger: "blur",
          },
        ],
        field131: [
          {
            required: true,
            message: "请输入知晓垃圾分类人数（人）",
            trigger: "blur",
          },
        ],
        field132: [
          {
            required: true,
            message: "请输入常住人口中具有大专以上学历（包括在校生）的人数",
            trigger: "blur",
          },
        ],
        field134: [
          {
            required: true,
            message: "是否将垃圾分类编入教材或知识读本不能为空",
            trigger: "change",
          },
        ],
        field135: [
          {
            required: true,
            message: "是否开展宣传教育活动不能为空",
            trigger: "change",
          },
        ],
        field136: [
          {
            required: true,
            message: "是否纳入教育体系不能为空",
            trigger: "change",
          },
        ],
        field137: [
          {
            required: true,
            message: "请输入环卫投资（万元）",
            trigger: "blur",
          },
        ],
        field138: [
          {
            required: true,
            message: "请输入人均GDP（万元）",
            trigger: "blur",
          },
        ],
        field139: [
          {
            required: true,
            message: "请输入城市GDP（万元）",
            trigger: "blur",
          },
        ],
        field140: [
          {
            required: true,
            message: "有无垃圾分类相关管理机构、组织或联席会议制度不能为空",
            trigger: "change",
          },
        ],
        field141: [
          {
            required: true,
            message: "有无垃圾分类工作协调机制、责任落实不能为空",
            trigger: "change",
          },
        ],
        field142: [
          {
            required: true,
            message: "有无垃圾分类培训业务不能为空",
            trigger: "change",
          },
        ],
        field143: [
          {
            required: true,
            message: "有无具体的垃圾分类工作办法不能为空",
            trigger: "change",
          },
        ],
        field144: [
          {
            required: true,
            message: "有无垃圾分类监督机制不能为空",
            trigger: "change",
          },
        ],
        field145: [
          {
            required: true,
            message: "有无垃圾分类反馈机制不能为空",
            trigger: "change",
          },
        ],
        field146: [
          {
            required: true,
            message: "有无2017年后更新的法律法规不能为空",
            trigger: "change",
          },
        ],
        field147: [
          {
            required: true,
            message: "有无2017年后更新的法律法规不能为空",
            trigger: "change",
          },
        ],
      },
      fieldOptions: [
        {
          label: "是",
          value: 1,
        },
        {
          label: "否",
          value: 0,
        },
      ],
    };
  },
  created() {
    if (this.level != "district") {
      this.checkedModules = [1, 2, 3, 4, 5, 6, 7, 8];
    } else {
      this.checkedModules = [];
    }
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
    handleCheckAllChange(val) {
      this.checkedModules = val ? [1, 2, 3, 4, 5, 6, 7, 8] : [];
      this.isIndeterminate = false;
    },
    handleCheckedModulesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.importModules.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.importModules.length;
    },
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
  },
};
</script>
<style scoped>
.group-title {
  background: #499dff;
  width: 100%;
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
}
.group-content {
  padding: 20px;
  display: flex;
}
.el-form-item{
  margin-right: 28px;
}
</style>