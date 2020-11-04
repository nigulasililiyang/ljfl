<template>
  <section>
    <div>
      <el-row>
        <el-button icon="el-icon-search" @click="testRun">测试计划</el-button>
      </el-row>
    </div>
    <div class="testLabel">最后{{times}}次的运行时间：</div>
    <div style="padding-top: 10px;padding-left: 25px;">
      <template v-for="(str,index) in rs">
        {{timeFormat(str)}}<br/>
      </template>
    </div>
  </section>
</template>
<script>
import {TestRunCron} from "@/api/monitor/job";
  export default {
    props: {
      // cron 表达式
      cronExp: {
        type: String,
        default: ''
      },
      // 是否立即运行
      isTestRun: {
        type: Boolean,
        default: false
      },
      // 运行的次数
      times: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        rs: [],
        testRunCronEx: {}
      }
    },
    created() {
      if (this.isTestRun) {
        this.testRun();
      }
    },
    methods: {
      timeFormat(val){
          var time = new Date(val);
          var rtnVal = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
          return rtnVal;
      },
      testRun() {
        if (this.cronExp !== '') {
          this.testRunCronEx.cronExpression = this.cronExp;
          TestRunCron(this.testRunCronEx).then(res => {
            this.rs = res.data;
          });
        }
      }
    }
  }
</script>
<style>
  .testLabel{
    margin-top:10px;
  }
</style>
