<template>
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="18px" >  
      <el-form-item label="每" prop="timespan" class="normalCtrl">
            <el-select v-model="timespan" v-if="queryParams.timerType!='week'" placeholder="请选择" @change="ctrlToCron">
              <el-option 
                v-for="item in this.timeOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
      </el-form-item>  
        <el-form-item label="" prop="timerType" class="normalCtrl">
        <el-select v-model="queryParams.timerType" placeholder="请选择定时精度" @change="changeTimeType">
          <el-option 
            v-for="timer in timeArray"
            :key="timer.resultNum"
            :label="timer.name"
            :value="timer.resultNum"
          />
        </el-select>
      </el-form-item>

  
        <el-form-item label="第" v-if="queryParams.timerType=='month'" prop="triggerDay" class="normalCtrl">
            <el-select v-model="triggerDay" placeholder="请选择" @change="ctrlToCron">
              <el-option 
                v-for="item in this.day.allElement"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
        </el-form-item>  
 
        <el-form-item label="" v-if="queryParams.timerType=='week'" prop="triggerDay" class="normalCtrl" @change="ctrlToCron">
            <el-select v-model="triggerDay" placeholder="请选择">
              <el-option 
                v-for="item in this.weekDay"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>  
        <el-form-item label="天" v-if="queryParams.timerType=='month'" prop="triggerDay" label-width="14px">
        </el-form-item>   
        <div>
        <el-form-item v-if="queryParams.timerType=='day' || queryParams.timerType=='week' || queryParams.timerType=='month'" label="的" prop="triggerTime">
          <el-time-picker @change="ctrlToCron"
            v-model="triggerTime"          
            placeholder="时间点">
          </el-time-picker>
        </el-form-item>  
        </div>
      <div>
      <next-run-time :cronExp="triggerCron" :isTestRun="false"></next-run-time>
      </div>
    </el-form>
</template>

<script>
import NextRunTime from './NextRunTime'
  export default {
        components: {
      NextRunTime
    },
    props: {
      cron: {
        type: String,
        default: '0/10 * * * * ?'
      }
    },
    data() {
      return {
        triggerCron: '',// 传入后台
        cron_tabs: 'day', // 默认选中的tab
        second: {},
        minute: {},
        hour: {},
        day: {},
        month: {},
        week: {},
        year: {},
        secondOptions:[1,2,3,4,5,10,20,30,59],
        hourOptions:[1,2,3,4,6,8,12,23],
        dayOptions:[1,2,3,5,6,10,15,31],
        monthOptions:[1,2,3,4,6,12],
        timeOptions:[],
        weekDay:[
          {label:'日',value:1},
          {label:'一',value:2},
          {label:'二',value:3},
          {label:'三',value:4},
          {label:'四',value:5},
          {label:'五',value:6},
          {label:'六',value:7},
        ],
        orgCron:this.cron,
        queryParams:{
          timerType:'second',
        },
        // 用于el-tab-pane 循环
        timeArray: [],
        // 表单校验
        rules: {
        },
        timespan:10,    
        triggerTime: new Date(),
        triggerDay:1,
      }
    },
    created() {
      this.initData();
      this.triggerCron = this.cron;
      this.cronToCtrl();
    },
    methods: {


      initData: function () {
        // 初始化页面数据
        this.second = this.TimeBase('second', '秒');
        this.minute = this.TimeBase('minute', '分钟');
        this.hour = this.TimeBase('hour', '小时');
        this.day = this.TimeBase('day', '天');
        this.month = this.TimeBase('month', '月');
        this.week = this.TimeBase('week', '周');
        this.year = this.TimeBase('year', '年');

        this.timeArray.push(this.second);
        this.timeArray.push(this.minute);
        this.timeArray.push(this.hour);
        this.timeArray.push(this.day);
        this.timeArray.push(this.month);
        this.timeArray.push(this.week);
        for (var i = 0; i < 60; i++) {
          // 秒
          this.second.allElement.push(i + '');
          // 分
          this.minute.allElement = this.second.allElement;
          var value = (i + 1) + '';
          // 时
          if (i < 24) {
            this.hour.allElement.push(value);
          }
          // 天
          if (i < 31) {
            this.day.allElement.push(value);
          }
          // 周
          if (i < 7) {
            this.week.allElement.push(value);
          }
          // 月
          if (i < 12) {
            this.month.allElement.push(value);
          }
        }
        this.timeOptions = this.second.allElement;
      },
      // 时间基类
      TimeBase: function (resultNum, name) {
        var radio = '1';
        var label = '每' + name;
        var maxNum = 60;
        if (resultNum === 'day') {
          label = '每天';
          maxNum = 31
        } else if (resultNum === 'week') {
          label = '每周';
          radio = '2';
        } else if (resultNum === 'month') {
          maxNum = 12;
        } else if (resultNum === 'hour') {
          maxNum = 24;
        } else if (resultNum === 'minute' || resultNum === 'second') {
          maxNum = 60;
        }
        var begin = 1;
        if (resultNum === 'second' || resultNum === 'minute' || resultNum === 'hour') {
          begin = 0;
        }

        var rs = {
          name: name,
          resultNum: resultNum,
          maxNum:maxNum,
          allElement: [],
          value:0,
        };
        return rs;
      },

   
      saveCron() {
        this.ctrlToCron();
        //this.$emit("saveCron", this.triggerCron);
      },
      cancelCron() {
        this.$emit("cancelCron", this.triggerCron);
      },
      /**将时间间隔转换成时间点 */
      calcTime(startSpan){
        // var restValue = this.timespan;
        // var startCalc = false;
        //  for (var index in this.timeArray) {
        //    if(startCalc === false){
        //     this.timeArray[index].value = 0;
        //       if(this.timeArray[index].resultNum == startSpan){
        //       startCalc = true;
        //     }
        //    }else{
        //      //只到月份为止
        //     if(this.timeArray[index].resultNum == 'week'){
        //       break;
        //     }else{
        //       this.timeArray[index].value = resetValue % this.timeArray[index].maxNum;
        //       resetValue = resetValue / this.timeArray[index].maxNum
        //       if(resetValue === 0){
        //         break;
        //       }
        //     }
        //    }
        //  }
      },
      /**将组件上的值转换为cron表达式 */
      ctrlToCron(){
          this.calcTime(this.queryParams.timerType);
          var cronTemp = ['*', '*', '*', '*', '*', '?', '*'];
          if(this.queryParams.timerType === 'second'){
            cronTemp[0] = "0/" + this.timespan;
          }else if(this.queryParams.timerType === 'minute'){
            cronTemp[0] = '0';
            cronTemp[1] = "0/" + this.timespan;
          }else if(this.queryParams.timerType === 'hour'){
            cronTemp[0] = '0';
            cronTemp[1] = '0';
            cronTemp[2] = "0/" + this.timespan;   
          }else if(this.queryParams.timerType === 'day'){
            cronTemp[3] = "1/" + this.timespan;         
          } else if(this.queryParams.timerType === 'month'){
            cronTemp[3] = this.triggerDay; 
            cronTemp[4] = "1/" + this.timespan;         
          } else if(this.queryParams.timerType === 'week'){
            cronTemp[3] = '?';
            cronTemp[5] = this.triggerDay;         
          }    
          /**
           * 日、周、月都需要指定具体的执行时间
           */
          if(this.queryParams.timerType === 'day' 
          || this.queryParams.timerType === 'month'
          || this.queryParams.timerType === 'week') {
              var tmpTime = new Date(this.triggerTime);
              cronTemp[0] = tmpTime.getSeconds();
              cronTemp[1] = tmpTime.getMinutes();
              cronTemp[2] = tmpTime.getHours();
          }           
          this.triggerCron = cronTemp.join(" ");

          this.$emit("saveCron", this.triggerCron);
      },
      /**将cron表达式转换为组件的值 */
      cronToCtrl(){
          var cronTempArray = this.triggerCron.split(" ");
          //先检测月与周
          if(cronTempArray[5] != '?' && cronTempArray[5] != '*'){
            this.queryParams.timerType = 'week';
            this.triggerDay = cronTempArray[5];
            this.timeOptions = [1,2,3,4];
          } if(cronTempArray[4].includes("/")){
            this.queryParams.timerType = 'month';
            var tmpArray = cronTempArray[4].split("/");
            this.timespan = tmpArray[1];
            this.triggerDay = tmpArray[0];
            this.timeOptions = this.monthOptions;
          } if(cronTempArray[3].includes("/")){
            this.queryParams.timerType = 'day';
            var tmpArray = cronTempArray[3].split("/");
            this.timespan = tmpArray[1];
            this.timeOptions = this.dayOptions;
          } if(cronTempArray[2].includes("/")){
            this.queryParams.timerType = 'hour';
            var tmpArray = cronTempArray[2].split("/");
            this.timespan = tmpArray[1];
            this.timeOptions = this.hourOptions;
          } if(cronTempArray[1].includes("/")){
            this.queryParams.timerType = 'minute';
            var tmpArray = cronTempArray[1].split("/");
            this.timespan = tmpArray[1];
            this.timeOptions = this.secondOptions;
          } if(cronTempArray[0].includes("/")){
            this.queryParams.timerType = 'minute';
            var tmpArray = cronTempArray[0].split("/");
            this.timespan = tmpArray[1];
            this.timeOptions = this.secondOptions;
          }

          if(this.queryParams.timerType === 'day' 
          || this.queryParams.timerType === 'month'
          || this.queryParams.timerType === 'week') {
              this.triggerTime = new Date();
              this.triggerTime.setHours(cronTempArray[2]);
              this.triggerTime.setMinutes(cronTempArray[1])
              this.triggerTime.setSeconds(cronTempArray[0]);
          }  
      },
      /**时间类型变化 */
      changeTimeType(){
        
        switch (this.queryParams.timerType) {
          case 'second':
            this.timespan = 1;
            this.timeOptions = this.secondOptions;
            break;
          case 'minute':
            this.timespan = 1;
            this.timeOptions = this.secondOptions;
            break;
          case 'hour':
            this.timespan = 1;
            this.timeOptions = this.hourOptions;
            break;
          case 'day':
            this.timespan = 1;
            this.timeOptions = this.dayOptions;
            break;
          case 'month':
            this.timespan = 1;
            this.triggerDay = 1;
            this.timeOptions = this.monthOptions;
            break;
          case 'week':
            this.triggerDay = 1;
            this.timeOptions = [1,2,3,4];
            break;
          case 'year':
            break;
          default:
            break;
        }
        this.ctrlToCron();
      },
    },
    computed: {
      maxNum() {
        var obj = this.queryParams.timerType;
        return (obj === 'second' || obj === 'minute') ? 59 : obj === 'hour' ? 23 : obj === 'month' ? 12 : obj === 'day' ? 31 : 7;
      },
      minNum() {
        var obj = this.queryParams.timerType;
        return (obj === 'second' || obj === 'minute' || obj === 'hour') ? 0 : 1;
      }
    }
  }
</script>
<style>
.hidden{
  display:none;
}
.normalCtrl .el-input__inner{
    width:80px !important;
}
.el-time-spinner__item {
  color:#000;
}
</style>
