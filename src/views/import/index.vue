<template>
  <div class="app-container">
    <el-page-header title="重新选择" @back="goBack" :content="areaInfo.name">
    </el-page-header>
    <el-row type="flex" justify="center">
      <el-card style="width:70%">
        <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="small"
          label-position="left"
          label-width="400px"
        >
          <div v-for="group in quotaGroups" :key="group.quota_group_id">
            <div class="form-group-title">{{ group.quota_group_name }}</div>
            <div class="form-group-content">
              <el-form-item
                v-for="(question,index) in questionListGroup[group.quota_group_id]"
                :key="question.quota_id"
                :label="(index+1)+'、'+question.quota_name"
                :prop="question.quota_tag"
              >
                <el-input
                  v-if="question.quota_type == 1"
                  v-model="formData[question.quota_tag]"
                  placeholder="请输入"
                  clearable
                ></el-input>
                <el-radio-group
                  v-if="question.quota_type == 2"
                  v-model="formData[question.quota_tag]"
                  size="medium"
                >
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
          <el-row :gutter="20" type="flex" justify="center">
          <el-form-item size="large" label-width="0px">
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
          </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>
<script>
import { addAnswer } from "@/api/system/quotas";
import {
  getAreaByName,
  listQuotaGroups,
  listQuestions,
  getAreaInfo
} from "@/api/system/quotas";

export default {
  data() {
    return {
      properties: undefined,
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
          value: "1",
        },
        {
          label: "否",
          value: "0",
        },
      ],
      areaInfo: undefined,
      queryForm: {
        areaTag: "",
      },
      quotaGroups: [],
      questionList: [],
      questionListGroup: {},
    };
  },
  created() {
    this.properties = JSON.parse(sessionStorage.getItem("properties"));
    this.getQuestion();
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
        addAnswer(this.formData)
          .then((response) => {
            if (response.code === 200) {
              this.msgSuccess("提交成功");
            } else {
              this.msgError(response.msg);
            }
          })
          .catch((error) => {});
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    getQuestion() {
      let params = {
        //areaName: this.properties.name,
      };
      getAreaInfo(params).then((response) => {
        if (response.code == 200) {
          this.areaInfo = response.areaInfo;
          this.queryForm.areaTag = this.areaInfo.area_tag;
          //获取分组得分信息
          listQuotaGroups(this.queryForm).then((response) => {
            if (response.code == 200) {
              this.quotaGroups = response.quotaGroups;
              listQuestions(this.queryForm).then((res) => {
                if (res.code == 200) {
                  this.questionList = res.questions;
                  this.setDefaultFormData();
                  this.questionListGroup = this.groupByGroups(res.questions); 
                  console.log(this.questionListGroup);
                }
              });
            }
          });
        }
      });
    },
    groupByGroups(array) {
      var map = {};
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (!map[element.quota_group_id]) {
          map[element.quota_group_id] = [element];
        } else {
          map[element.quota_group_id].push(element);
        }
      }
      return map;
    },
    setDefaultFormData(){
      this.questionList.forEach(ele => {
        let key=ele.quota_tag;
        this.formData[key]=ele.quota_value;
      });
    }
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
<style scoped>
.form-group-title {
  line-height: 36px;
  background: #499dff;
  padding: 0 10px;
}
.form-group-content {
  padding: 20px;
  /* display: flex; */
}
.el-form-item {
  margin-right: 20px;
  display: flex;
}
</style>