<template>
  <div class="app-container">
    <el-page-header title="重新选择" @back="goBack" :content="areaInfo.name">
    </el-page-header>
    <el-row type="flex" justify="center">
      <el-card style="width: 70%">
        <el-form size="small" label-position="left" label-width="400px">
          <div class="form-group-title">地区属性</div>
          <div class="form-group-content">
            <el-form-item label="是否已实现垃圾分类">
              <el-radio-group
                v-model="areaInfo.classify_type"
                size="medium"
                @change="handleChangeClassifyType"
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
        </el-form>
        <el-form
          ref="elForm"
          :model="formData"
          size="small"
          label-position="left"
          label-width="400px"
        >
          <div v-for="group in quotaGroups" :key="group.quota_group_id">
            <div class="form-group-title">{{ group.quota_group_name }}</div>
            <div class="form-group-content">
              <el-form-item
                v-for="(question, index) in questionListGroup[group.quota_group_id]"
                :key="question.quota_id"
                :label="index + 1 + '、' + question.quota_name"
                :prop="question.quota_tag"
              >
               <div style="display: inline-flex;" slot>
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
                <div class="form-group-unit" v-if="question.quota_unit">{{ question.quota_unit }}</div>
                </div>
              </el-form-item>
            </div>
          </div>
          <el-row :gutter="20" type="flex" justify="center">
            <el-form-item size="large" label-width="0px">
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
               <el-button @click="goBack">返回</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>
<script>
import { addAnswer, changeAreaClassifyType } from "@/api/system/quotas";
import {
  getAreaByName,
  listQuotaGroups,
  listQuestions,
  getAreaInfo,
} from "@/api/system/quotas";

export default {
  data() {
    return {
      properties: undefined,
      formData: undefined,
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
      areaInfo: {
        name: "",
      },
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
    handleChangeClassifyType(value) {
      let queryParam = {
        classifyType: value,
      };
      changeAreaClassifyType(queryParam).then((response) => {
        if (response.code == 200) {
          this.msgSuccess("修改成功");
        } else {
          this.msgError(response.message);
        }
      });
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
              this.msgError(response.message);
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
    setDefaultFormData() {
      let data = {};
      this.questionList.forEach((ele) => {
        let key = ele.quota_tag;
        data[key] = ele.quota_value;
        console.log(this.formData);
      });
      this.formData = data;
    },
  },
  computed: {
    content() {
      if (this.properties) {
        return this.properties.label + "(" + this.properties.level + ")";
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
  font-size: 18px;
}
.form-group-content {
  padding: 20px;
  /* display: flex; */
}
.form-group-unit {
  width: 100px;
  padding: 0 10px;
}
.el-form-item {
  margin-right: 20px;
  display: flex;
  font-size: 16px;
}
</style>
