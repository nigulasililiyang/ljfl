<template>
  <div class="app-container">
    <el-page-header title="重新选择" @back="goBack" :content="content">
    </el-page-header>
    <div>
      <el-row type="flex" justify="center">
        <el-col :span="16">
          <el-form
            ref="elForm"
            :model="formData"
            :rules="rules"
            size="small"
            label-width="100px"
            label-position="top"
          >
            <el-form-item>
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
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
              <el-form-item label="已实现分类小区数量（个）" prop="already_diff">
                <el-input
                  v-model="formData.already_diff"
                  placeholder="请输入已实现分类小区数量（个）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
              <el-form-item label="所有分类小区数量（个）" prop="all_diff">
                <el-input
                  v-model="formData.all_diff"
                  placeholder="请输入所有分类小区数量（个）"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="分类示范小区总数量（个）" prop="all_example_diff">
                <el-input
                  v-model="formData.all_example_diff"
                  placeholder="请输入分类示范小区总数量（个）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="分类示范小区中已实现分类的小区数量（个）"
                prop="already_example_diff"
              >
                <el-input
                  v-model="formData.already_example_diff"
                  placeholder="请输入分类示范小区中已实现分类的小区数量（个）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>

            </div>

            <div v-if="checkedModules.includes(2)">
              <el-form-item
                label="实行分类运输的小区数量（个）"
                prop="already_transport"
              >
                <el-input
                  v-model="formData.already_transport"
                  placeholder="请输入实行分类运输的小区数量（个）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>

            </div>

            <div v-if="checkedModules.includes(3)">
              <el-form-item label="生活垃圾的焚烧处理能力（t/d）" prop="waste_burn_ability">
                <el-input
                  v-model="formData.waste_burn_ability"
                  placeholder="请输入生活垃圾的焚烧处理能力（t/d）"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="生活垃圾焚烧处理量（t/d）" prop="waste_burn">
                <el-input
                  v-model="formData.waste_burn"
                  placeholder="请输入生活垃圾焚烧处理量（t/d）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
              <el-form-item label="生活垃圾填埋处理量（t/d）" prop="waste_bury">
                <el-input
                  v-model="formData.waste_bury"
                  placeholder="请输入生活垃圾填埋处理量（t/d）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="生活垃圾填埋处理能力（t/d）"
                prop="waste_bury_ability"
              >
                <el-input
                  v-model="formData.waste_bury_ability"
                  placeholder="请输入生活垃圾填埋处理能力（t/d）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
              <el-form-item label="生活垃圾清运量（t）" prop="waste_transport">
                <el-input
                  v-model="formData.waste_transport"
                  placeholder="请输入生活垃圾清运量（t）"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="厨余垃圾处理能力（t/d）" prop="kitchen_waste_ability">
                <el-input
                  v-model="formData.kitchen_waste_ability"
                  placeholder="请输入厨余垃圾处理能力（t/d）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
              <el-form-item label="有害垃圾处理能力（t/d）" prop="harmful_waste_ability">
                <el-input
                  v-model="formData.harmful_waste_ability"
                  placeholder="请输入有害垃圾处理能力（t/d）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
              <el-form-item label="实际厨余垃圾处理量（t/d）" prop="real_kitchen_waste_deal">
                <el-input
                  v-model="formData.real_kitchen_waste_deal"
                  placeholder="请输入实际厨余垃圾处理量（t/d）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
              <el-form-item label="实际有害垃圾处理量（t/d）" prop="real_harmful_waste_deal">
                <el-input
                  v-model="formData.real_harmful_waste_deal"
                  placeholder="请输入实际有害垃圾处理量（t/d）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
            </div>

            <div v-if="checkedModules.includes(4)">
              <el-form-item label="回收的生活垃圾量（t/d）" prop="domestic_waste_recovery_deal">
                <el-input
                  v-model="formData.domestic_waste_recovery_deal"
                  placeholder="请输入回收的生活垃圾量（t/d）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
              <el-form-item label="每天回收的可回收物量（t/d）" prop="recovery_recovered">
                <el-input
                  v-model="formData.recovery_recovered"
                  placeholder="请输入每天回收的可回收物量（t/d）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
            </div>

            <div v-if="checkedModules.includes(5)">
              <el-form-item label="支持垃圾分类人数（人）" prop="classify_people_support_number">
                <el-input
                  v-model="formData.classify_people_support_number"
                  placeholder="请输入支持垃圾分类人数（人）"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="调查区域居民总人数（人）" prop="people_number">
                <el-input
                  v-model="formData.people_number"
                  placeholder="请输入调查区域居民总人数（人）"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
              <el-form-item label="知晓垃圾分类人数（人）" prop="known_classify_people_support">
                <el-input
                  v-model="formData.known_classify_people_support"
                  placeholder="请输入知晓垃圾分类人数（人）"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="常住人口中具有大专以上学历（包括在校生）的人数"
                prop="higher_education_people_number"
              >
                <el-input
                  v-model="formData.higher_education_people_number"
                  placeholder="请输入常住人口中具有大专以上学历（包括在校生）的人数"
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
            </div>

            <div v-if="checkedModules.includes(6)">
              <el-form-item
                label="是否将垃圾分类编入教材或知识读本"
                prop="is_paper_campaign"
              >
                <el-radio-group v-model="formData.is_paper_campaign" size="medium">
                  <el-radio
                    v-for="(item, index) in fieldOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否开展宣传教育活动" prop="is_activity_campaign">
                <el-radio-group v-model="formData.is_activity_campaign" size="medium">
                  <el-radio
                    v-for="(item, index) in fieldOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否纳入教育体系" prop="is_in_education_system">
                <el-radio-group v-model="formData.is_in_education_system" size="medium">
                  <el-radio
                    v-for="(item, index) in fieldOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否开展学校、家庭、社会互动实践活动" prop="has_social_practice">
                <el-radio-group v-model="formData.has_social_practice" size="medium">
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

            <div v-if="checkedModules.includes(7)">
              <el-form-item label="环卫投资（万元）" prop="es_investment">
                <el-input
                  v-model="formData.es_investment"
                  placeholder="请输入环卫投资（万元）"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="人均GDP（万元）" prop="field138">
                <el-input
                  v-model="formData.field138"
                  placeholder="请输入人均GDP（万元）"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="城市GDP（万元）" prop="GDP_by_city">
                <el-input
                  v-model="formData.GDP_by_city"
                  placeholder="请输入城市GDP（万元）"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </div>

            <div v-if="checkedModules.includes(8)">
              <el-form-item
                label="有无垃圾分类相关管理机构、组织或联席会议制度"
                prop="has_classify_organization"
              >
                <el-radio-group v-model="formData.has_classify_organization" size="medium">
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
                prop="has_classify_coordiantion"
              >
                <el-radio-group v-model="formData.has_classify_coordiantion" size="medium">
                  <el-radio
                    v-for="(item, index) in fieldOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="有无垃圾分类培训业务" prop="has_classify_train">
                <el-radio-group v-model="formData.has_classify_train" size="medium">
                  <el-radio
                    v-for="(item, index) in fieldOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="有无具体的垃圾分类工作办法" prop="has_classify_work_method">
                <el-radio-group v-model="formData.has_classify_work_method" size="medium">
                  <el-radio
                    v-for="(item, index) in fieldOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="有无垃圾分类监督机制" prop="has_classify_monitor">
                <el-radio-group v-model="formData.has_classify_monitor" size="medium">
                  <el-radio
                    v-for="(item, index) in fieldOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="有无垃圾分类反馈机制" prop="has_classify_feedback">
                <el-radio-group v-model="formData.has_classify_feedback" size="medium">
                  <el-radio
                    v-for="(item, index) in fieldOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="有无2017年后更新的法律法规" prop="has_rewards_and_punishments">
                <el-radio-group v-model="formData.has_rewards_and_punishments" size="medium">
                  <el-radio
                    v-for="(item, index) in fieldOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否开展学校、家庭、社会互动实践活动" prop="has_social_practice">
                <el-radio-group v-model="formData.has_social_practice" size="medium">
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
import { addAnswer } from "@/api/system/quotas";
export default {
  data() {
    return {
      properties: undefined,
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
        already_diff: undefined,
        all_diff: undefined,
        all_example_diff: undefined,
        already_example_diff: undefined,
        already_transport: undefined,
        waste_bury_ability: undefined,
        waste_burn_ability: undefined,
        waste_burn: undefined,
        waste_bury: undefined,
        waste_transport: undefined,
        kitchen_waste_ability: undefined,
        harmful_waste_ability: undefined,
        real_kitchen_waste_deal: undefined,
        real_harmful_waste_deal: undefined,
        domestic_waste_recovery_deal: undefined,
        recovery_recovered: undefined,
        classify_people_support_number: undefined,
        people_number: undefined,
        known_classify_people_support: undefined,
        higher_education_people_number: undefined,
        is_paper_campaign: 1,
        is_activity_campaign: 1,
        is_in_education_system: 1,
        has_social_practice: 1,
        es_investment: undefined,
        field138: undefined,
        GDP_by_city: undefined,
        has_classify_organization: 1,
        has_classify_coordiantion: 1,
        has_classify_train: 1,
        has_classify_work_method: 1,
        has_classify_monitor: 1,
        has_classify_feedback: 1,
        has_rewards_and_punishments: 1,
        has_social_practice: 1,
      },
      rules: {
        already_diff: [
          {
            required: false,
            message: "请输入已实现分类小区数量（个）",
            trigger: "blur",
          },
        ],
        all_diff: [
          {
            required: false,
            message: "请输入所有分类小区数量（个）",
            trigger: "blur",
          },
        ],
        all_example_diff: [
          {
            required: false,
            message: "请输入分类示范小区总数量（个）",
            trigger: "blur",
          },
        ],
        already_example_diff: [
          {
            required: false,
            message: "请输入分类示范小区中已实现分类的小区数量（个）",
            trigger: "blur",
          },
        ],
        already_transport: [
          {
            required: false,
            message: "请输入实行分类运输的小区数量（个）",
            trigger: "blur",
          },
        ],
        waste_bury_ability: [
          {
            required: false,
            message: "请输入实行分类运输的小区数量（个）",
            trigger: "blur",
          },
        ],
        waste_burn_ability: [
          {
            required: false,
            message: "请输入所有小区数量（个）",
            trigger: "blur",
          },
        ],
        waste_burn: [
          {
            required: false,
            message: "请输入生活垃圾焚烧处理量（t）",
            trigger: "blur",
          },
        ],
        waste_bury: [
          {
            required: false,
            message: "请输入生活垃圾填埋处理量（t）",
            trigger: "blur",
          },
        ],
        waste_transport: [
          {
            required: false,
            message: "请输入生活垃圾清运量（t）",
            trigger: "blur",
          },
        ],
        kitchen_waste_ability: [
          {
            required: false,
            message: "请输入厨余垃圾处理能力（t/d）",
            trigger: "blur",
          },
        ],
        harmful_waste_ability: [
          {
            required: false,
            message: "请输入有害垃圾处理能力（t/d）",
            trigger: "blur",
          },
        ],
        real_kitchen_waste_deal: [
          {
            required: false,
            message: "请输入实际厨余垃圾处理量（t/d）",
            trigger: "blur",
          },
        ],
        real_harmful_waste_deal: [
          {
            required: false,
            message: "请输入实际有害垃圾处理量（t/d）",
            trigger: "blur",
          },
        ],
        domestic_waste_recovery_deal: [
          {
            required: false,
            message: "请输入回收的生活垃圾量（t/d）",
            trigger: "blur",
          },
        ],
        recovery_recovered: [
          {
            required: false,
            message: "请输入每天回收的可回收物量（t/d）",
            trigger: "blur",
          },
        ],
        classify_people_support_number: [
          {
            required: false,
            message: "请输入支持垃圾分类人数（人）",
            trigger: "blur",
          },
        ],
        people_number: [
          {
            required: false,
            message: "请输入调查区域居民总人数（人）",
            trigger: "blur",
          },
        ],
        known_classify_people_support: [
          {
            required: false,
            message: "请输入知晓垃圾分类人数（人）",
            trigger: "blur",
          },
        ],
        higher_education_people_number: [
          {
            required: false,
            message: "请输入常住人口中具有大专以上学历（包括在校生）的人数",
            trigger: "blur",
          },
        ],
        is_paper_campaign: [
          {
            required: false,
            message: "是否将垃圾分类编入教材或知识读本不能为空",
            trigger: "change",
          },
        ],
        is_activity_campaign: [
          {
            required: false,
            message: "是否开展宣传教育活动不能为空",
            trigger: "change",
          },
        ],
        is_in_education_system: [
          {
            required: false,
            message: "是否纳入教育体系不能为空",
            trigger: "change",
          },
        ],
          has_social_practice: [
          {
            required: false,
            message: "是否开展学校、家庭、社会互动实践活动",
            trigger: "change",
          },
        ],
        es_investment: [
          {
            required: false,
            message: "请输入环卫投资（万元）",
            trigger: "blur",
          },
        ],
        field138: [
          {
            required: false,
            message: "请输入人均GDP（万元）",
            trigger: "blur",
          },
        ],
        GDP_by_city: [
          {
            required: false,
            message: "请输入城市GDP（万元）",
            trigger: "blur",
          },
        ],
        has_classify_organization: [
          {
            required: false,
            message: "有无垃圾分类相关管理机构、组织或联席会议制度不能为空",
            trigger: "change",
          },
        ],
        has_classify_coordiantion: [
          {
            required: false,
            message: "有无垃圾分类工作协调机制、责任落实不能为空",
            trigger: "change",
          },
        ],
        has_classify_train: [
          {
            required: false,
            message: "有无垃圾分类培训业务不能为空",
            trigger: "change",
          },
        ],
        has_classify_work_method: [
          {
            required: false,
            message: "有无具体的垃圾分类工作办法不能为空",
            trigger: "change",
          },
        ],
        has_classify_monitor: [
          {
            required: false,
            message: "有无垃圾分类监督机制不能为空",
            trigger: "change",
          },
        ],
        has_classify_feedback: [
          {
            required: false,
            message: "有无垃圾分类反馈机制不能为空",
            trigger: "change",
          },
        ],
        has_rewards_and_punishments: [
          {
            required: false,
            message: "有无2017年后更新的法律法规不能为空",
            trigger: "change",
          },
        ],
        has_social_practice: [
          {
            required: false,
            message: "是否开展学校、家庭、社会互动实践活动不能为空",
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
    this.properties = JSON.parse(sessionStorage.getItem("properties"));
    if (this.properties.level != "district") {
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
          addAnswer(this.formData).then(response => {
              if (response.code === 200) {
                this.msgSuccess("提交成功");
              } else {
                this.msgError(response.msg);
              }
            }).catch(error=>{
            });
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
  },
  computed: {
    content() {
      if (this.properties) {
        return this.properties.name + "(" + this.properties.level + ")";
      }
    },
  },
};
</script>