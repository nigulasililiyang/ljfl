<template>
  <div style="margin:20px;">
    <el-row type="flex" justify="end">
      <el-form ref="queryForm" :class="{'notdisplay': displayMode.indexOf(',')==-1}" :inline="true" label-width="75px">
        <el-form-item>
          <el-button icon="el-icon-s-grid" :class="{'isactive':displayType == 1}" @click="tableClick"></el-button>
          <el-button icon="el-icon-data-line" :class="{'isactive':displayType == 2}" @click="basicClick"></el-button>
          <el-button icon="el-icon-s-data" :class="{'isactive':displayType == 3}" @click="lineClick"></el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!--用户数据-->
    <stacked-area-chart v-if="displayType == 2 && displayMode.indexOf('line')>-1" :chart-data="chartData" :height="rankheight" :width="rankWidth"/>
    <not-stacked-multi-bar-chart v-if="displayType == 3 && displayMode.indexOf('columnar')>-1" :chart-data="chartData"  :height="rankheight" :width="rankWidth"/>
    <div v-if="displayType == 1 && displayMode.indexOf('table')>-1">
      <basic-table :table-data="tableData" v-if="tableData" style="width:100%;"/>
    </div>
    <pagination
      v-if="sysDevicePointPageData && sysDevicePointPageData.count>0 && displayType == 1 && displayMode.indexOf('table')>-1"
      :total="sysDevicePointPageData.count"
      :page.sync="sysDevicePointPageData.pageNum"
      :limit.sync="sysDevicePointPageData.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import StackedAreaChart from "../charts/line/StackedAreaChart";
import NotStackedMultiBarChart from '../charts/bar/NotStackedMultiBarChart'
import BasicTable from "../tables/BasicTable";
import Pagination from "../Pagination/index";
import PiePage from "../PiePage/index"
var Parser = require('expr-eval').Parser;
export default {
  components: {
    StackedAreaChart,
    BasicTable,
    NotStackedMultiBarChart,
    PiePage
  },
  props: {
    sysDevicePointPageData: {
      type: Object
    },
    sysDevicePointData: {
      type: Object
    },
    interval: {
      type: Number
    },
    minInterval:{
      type: Number
    },
    baseDisplayType: {
      type: Number
    },
    displayPointTemplates: {
      type: Array
    },
    displayMode: {
      type: String,
      default: 'table,line,columnar'
    },
  },
  watch:{
    sysDevicePointData:{
      deep: true,
      handler(value){
        //this.pieClick()
        if(this.sysDevicePointData.length == 0){

        }
        this.changeData(this.sysDevicePointData.inTimeInterval);
        this.value = this.sysDevicePointData.inTimeInterval;
      }
    }
  },
  data() {
    return {
      // 查询参数
      displayType: this.baseDisplayType?this.baseDisplayType:1,
      rankheight:"400px",
      rankWidth:"100%",
    };
  },
  computed: {
    tableData: function() {
      return {
        header: this.getTableHeaders(this.displayPointTemplates),
        data: this.getTableDatas(
          this.cloneObj(this.sysDevicePointPageData.values),
          this.displayPointTemplates
        )
      };
    },
    chartData: function() {
      var chartData = new Object();
      chartData = {
        smooth: true //true:曲线; false:折线（不写默认是折线）
      };
      chartData.color = this.getChartColors(this.displayPointTemplates);
      chartData.xAxis = this.getChartxAxis(
        this.cloneObj(this.sysDevicePointData.values)
      );
      chartData.yAxis = this.getChartyAxis(
        this.cloneObj(this.sysDevicePointData.values),
        this.displayPointTemplates
      );
      return chartData;
    }
  },
  methods: {
    getTableHeaders(displayPointTemplates) {
      var headers = new Array();
      if (undefined == displayPointTemplates || displayPointTemplates.length == 0) {
        return undefined;
      }
      headers.push({ prop: "time", label: "时间" });
      let allResult = [];
      for (var index = 0; index < displayPointTemplates.length; index++) {
        if(this.containAllResult(displayPointTemplates[index], allResult)){
          continue;
        }
        var sysPoint = displayPointTemplates[index];
        var sysPointTemplate = sysPoint.pointTemplate;
        //判断是否需要分级表头
        let result = this.checkHeadersHasChild(sysPointTemplate.pointSrcName, displayPointTemplates);
        if(result.length > 1){
          let psn = sysPointTemplate.pointSrcName+sysPoint.handleFunc;
          let pn = sysPointTemplate.pointName;
          let headerChildren = [];
          for(let k = 0;k < result.length; k++){
              let label = '';
              let prop = '';
              if(result[k].handleFunc == 'min'){
                label = this.getHandleFuncName('min');
                prop = result[k].pointTemplate.pointSrcName + 'min';
              }else if(result[k].handleFunc == 'max'){
                label = this.getHandleFuncName('max');
                prop = result[k].pointTemplate.pointSrcName + 'max';
              }else if(result[k].handleFunc == 'sum'){
                label = '总和';
                prop = result[k].pointTemplate.pointSrcName + 'sum';
              }else{
                label = this.getHandleFuncName('mean');
                prop = result[k].pointTemplate.pointSrcName + 'mean';
              }
              headerChildren.push(
                {
                  prop: prop,
                  label: label,
                  // width: this.colWidth
                }
              );
          }
          headers.push({
            prop: psn,
            label: this.getPointName(sysPointTemplate),
            // width: this.colWidth,
            children: headerChildren
          });
        }else{
          headers.push({
            prop: sysPointTemplate.pointSrcName+sysPoint.handleFunc,
            label: this.getPointName(sysPointTemplate),
            children: []
          });
        }
        allResult.push.apply(allResult, result);
      }
      return headers;
    },
    containAllResult(displayPointTemplate, allResult){
      let result = false;
      for(let i = 0; i < allResult.length; i++){
        if(displayPointTemplate.pointTemplate.pointSrcName == allResult[i].pointTemplate.pointSrcName){
            result = true;
            break;
        }
      }
      return result;
    },
    checkHeadersHasChild(pointSrcName, displayPointTemplates){
      let result = [];
      for (var i = 0; i < displayPointTemplates.length; i++) {
        var sysPointTemplate = displayPointTemplates[i].pointTemplate;
        if(pointSrcName == sysPointTemplate.pointSrcName){
          result.push(displayPointTemplates[i]);
        }
      }
      return result;
    },
    isNotEmptyAndNotNullAndNotUndefined(value){
        if(value != undefined && value != null && value !== ''){
            return true;
        }else{
          return false;
        }
    },
    getTableDatas(values, displayPointTemplates) {
      var datas = new Array();
      for (var index = 0; index < values.length; index++) {
        var value = values[index];
        var data = value.data;
        // for (var propKey in data) {
        //   var sysDataPointTemplate = this.getSysPointTemplateByName(
        //     displayPointTemplates,
        //     propKey
        //   );
        //   var sysPointTemplate = sysDataPointTemplate.pointTemplate;
        //   if (undefined == sysPointTemplate) {
        //     continue;
        //   }
        //   data[propKey+sysDataPointTemplate.handleFunc] = this.formatValue(
        //     sysPointTemplate.rate,
        //     data[propKey][sysDataPointTemplate.handleFunc]
        //   );
        // }
        for (var pointIndex = 0; pointIndex < displayPointTemplates.length; pointIndex++) {
          var displayPointTemplate = displayPointTemplates[pointIndex];
          var sysPointTemplate = displayPointTemplates[pointIndex].pointTemplate;
          if (data[sysPointTemplate.pointSrcName+displayPointTemplate.handleFunc] == undefined) {
            if(this.isNotEmptyAndNotNullAndNotUndefined(sysPointTemplate.func) && this.isNotEmptyAndNotNullAndNotUndefined(sysPointTemplate.relationPoint)){
              //根据公式换算值
              data[sysPointTemplate.pointSrcName+displayPointTemplate.handleFunc] = this.computeExpression(displayPointTemplate, sysPointTemplate.func,sysPointTemplate.relationPoint,data);
            }else{
              if(data[sysPointTemplate.pointSrcName]!=undefined && this.isNotEmptyAndNotNullAndNotUndefined(data[sysPointTemplate.pointSrcName][displayPointTemplate.handleFunc])){
                data[sysPointTemplate.pointSrcName+displayPointTemplate.handleFunc] = this.formatValue(sysPointTemplate.rate,data[sysPointTemplate.pointSrcName][displayPointTemplate.handleFunc]);
              }else{
                data[sysPointTemplate.pointSrcName+displayPointTemplate.handleFunc] = "--";
              }
            }
          }
        }
        if(value.time){
          data.time = this.timeFormat(value.time);
        }
        datas.push(data);
      }
      return datas;
    },
    computeExpression(displayPointTemplate, func, relationPoint, data){
      let computeRes = '--';
      let expr = Parser.parse(func);
      let rate = displayPointTemplate.rate;
      let exprParams = {};
      let exprVariables = expr.variables();
      if(exprVariables.indexOf("Interval") > -1){
        exprParams = {
          Interval: this.interval
        };
      }
      let reg = new RegExp("'","g");
      relationPoint = relationPoint.replace(reg,"");
      let relationPoints = relationPoint.split(',');
      let haveComputePoint = false;
      for(var relationPointIndex = 0; relationPointIndex < relationPoints.length; relationPointIndex++){
        const relationPointName = relationPoints[relationPointIndex];
        if(data[relationPointName] != undefined && data[relationPointName][displayPointTemplate.handleFunc] != undefined && data[relationPointName] != '--'){
          exprParams[relationPointName] = this.formatValue(rate,data[relationPointName][displayPointTemplate.handleFunc]);
          haveComputePoint = true;
        }else{
          haveComputePoint = false;
          break;
        }
      }
      if(haveComputePoint){
        computeRes = expr.evaluate(exprParams);
        if(isNaN(computeRes) || computeRes == 'Infinity'|| computeRes == '-Infinity'){
          computeRes = '--';
        }
      }
      return (computeRes!='--')?computeRes.toFixed(2):computeRes;
    },
    getChartxAxis(values) {
      var datas = new Array();
      for (var index = 0; index < values.length; index++) {
        var value = values[index];
        if(value.time){
          var data = this.timeFormat(value.time);
          datas.push(data);
        }
      }
      return { data: datas };
    },
    getChartColors(points){
      var datas = new Array();
      for (var pointIndex = 0; pointIndex < points.length; pointIndex++) {
        if(points[pointIndex].color){
          datas.push(points[pointIndex].color);
        }
      }
      return {colors: datas};
    },
    getChartyAxis(values, points) {
      var datas = new Array();
      for (var pointIndex = 0; pointIndex < points.length; pointIndex++) {
        var point = points[pointIndex];
        var data = new Object();
        data.label = this.getPointNameHandleFunc(point.handleFunc, point.pointTemplate);
        data.value = new Array();
        for (var valueIndex = 0; valueIndex < values.length; valueIndex++) {
          if(this.isNotEmptyAndNotNullAndNotUndefined(point.pointTemplate.func) && this.isNotEmptyAndNotNullAndNotUndefined(point.pointTemplate.relationPoint)){
            data.value.push(this.computeExpression(point, point.pointTemplate.func,point.pointTemplate.relationPoint,values[valueIndex].data));
          }else{
            if(values[valueIndex]["data"][point.pointTemplate.pointSrcName]){
              data.value.push(
                this.formatValue(
                  point.pointTemplate.rate,
                  values[valueIndex]["data"][point.pointTemplate.pointSrcName][point.handleFunc]
                )
              );
            }else{
              data.value.push('--')
            }
          }
        }
        datas.push(data);
      }
      return {
        data: datas
      };
    },
    timeFormat(time){
      let result = '';
      if(this.interval != undefined && time != undefined){
        if(this.interval == 60){
          if(this.displayType == 1){
            result = new Date(time).Format("yyyy-MM-dd hh:mm");
          }else{
            result = new Date(time).Format("dd hh:mm");
          }
        }else if(this.interval == 3600){
          result = new Date(time).Format("yyyy-MM-dd hh:mm");
        }else if(this.interval == (3600*24)){
          result = new Date(time).Format("yyyy-MM-dd");
        }
      }else{
        result = new Date(time).Format("yyyy-MM-dd hh:mm");
      }
      return result;
    },
    getPointNameHandleFunc(handleFunc, sysPointTemplate) {
      let name = sysPointTemplate.pointName + this.getHandleFuncName(handleFunc);
      sysPointTemplate.pointUnit == undefined
        ? name
        : name + "(" + sysPointTemplate.pointUnit + ")";
      return name;
    },
    getHandleFuncName(handleFunc){
      if(handleFunc == 'sum'){
        return '';
      }else if(handleFunc == 'min'){
        return '最小值';
      }else if(handleFunc == 'max'){
        return '最大值';
      }else{
        return '平均值';
      }
    },
    getPointName(sysPointTemplate) {
      let name = sysPointTemplate.pointUnit == undefined
        ? sysPointTemplate.pointName
        : sysPointTemplate.pointName + "(" + sysPointTemplate.pointUnit + ")";
      return name;
    },
    getSysPointTemplateByName(displayPointTemplates, pointSrcName) {
      for (var index = 0; index < displayPointTemplates.length; index++) {
        var sysPointTemplate = displayPointTemplates[index].pointTemplate;
        if (sysPointTemplate.pointSrcName == pointSrcName) {
          return displayPointTemplates[index];
        }
      }
      return undefined;
    },
    formatValue(rate, value) {
      if(null == value ){
        return "--";
      }
      if ( rate == null) {
        if(null == value ){
          return "--";
        }else{
          return value;
        }
      }
      return (new Number(value) * new Number(rate)).toFixed(
        this.getDecimalDigits(rate)
      );
    },
    getDecimalDigits(rate) {
      if(rate.toString().indexOf('.') > -1){
        return rate.toString().split(".")[1].length;
      }else{
        return 0;
      }
    },
    // 查询数据
    getList() {
      this.$emit("pageChange");
    },
    tableClick() {
      this.displayType = 1;
    },
    basicClick(){
      this.displayType = 2;
    },
    lineClick() {
      this.displayType = 3;
    },
    cloneObj(obj) {
      var str,
        newobj = obj.constructor === Array ? [] : {};
      if (typeof obj !== "object") {
        return;
      } else if (window.JSON) {
        (str = JSON.stringify(obj)), //系列化对象
          (newobj = JSON.parse(str)); //还原
      } else {
        for (var i in obj) {
          newobj[i] = typeof obj[i] === "object" ? cloneObj(obj[i]) : obj[i];
        }
      }
      return newobj;
    }

  }
};

Date.prototype.Format = function(fmt) {
  //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
</script>
<style lang="scss" scoped>
.isactive {
  color: #1890ff;
  border-color: #badeff;
  background-color: #e8f4ff;
}
.notdisplay{
  display: none;
}
</style>