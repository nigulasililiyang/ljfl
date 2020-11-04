<template>
  <div>
    当前地图范围：{{ currentArea }}（{{ level }}）<el-button
      v-if="currentAdcode != 100000"
      @click="backToParent()"
      >返回上一层</el-button
    >
    <div :style="{ height: height, width: width }" ref="myEchart"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import $ from "jquery";
import "echarts/lib/component/geo";
var myChart = null;
var apiPre = "/geoJson/areas_v2/bound/";
var apiFullSuf = "_full.json";
var apiSuf = ".json";
import Axios from "axios";
import {getGeoJson}from "@/api/map.js"
export default {
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
  },
  data() {
    return {
      chart: null,
      level: "country", //0:中国,1:省，2:市 3:区
      currentArea: "全国",
      currentAdcode: 100000,
      geoJson: {},
    };
  },
  mounted() {
    let properties = {
      level: "country",
      adcode: 100000,
      name: "全国",
    };
    this.showMap(properties);
  },
  methods: {
    changeLevel(zhName, adcode) {
      if (adcode == null) {
        this.geoJson.features.forEach((element) => {
          if (element.properties.name == zhName) {
            this.showMap(element.properties);
          }
        });
      } else {
        Axios.get(apiPre + adcode + apiSuf).then((res) => {
          let feature = res.data.features[0];
          this.showMap(feature.properties);
        });
      }
    },
    showMap(properties) {
      let _this = this;
      if (properties.level == "city") {
             getGeoJson(apiPre + properties.adcode + apiSuf).then(res=>{
          console.log("apiPre + properties.adcode + apiSuf");
        });
        // var acroutes = [];
        // _this.geoJson.features.forEach((ele) => {
        //   if (ele.properties.adcode == properties.adcode) {
        //     acroutes = ele.properties.acroutes;
        //   }
        // });
        // const fromurl =
        //   "./" +
        //   acroutes.toString().replace(",", "/") +
        //   "/" +
        //   properties.adcode +
        //   ".json";
        // import(fromurl).then((res) => {
        //   myChart = null;
        //   _this.geoJson = res;
        //   _this.level = properties.level;
        //   _this.currentArea = properties.name;
        //   _this.currentAdcode = properties.adcode;
        //   echarts.registerMap(_this.currentArea, _this.geoJson);
        //   myChart = echarts.init(_this.$refs.myEchart);
        //   // window.onresize = myChart.resize;
        //   myChart.setOption(_this.getOption(_this.currentArea));
        //   this.$emit("changeLevel", properties);
        // });
      } else if (properties.level == "district") {
        Axios.get(apiPre + properties.adcode + apiSuf).then((res) => {
          if (res.status == 200) {
            myChart = null;
            _this.level = properties.level;
            _this.currentArea = properties.name;
            _this.currentAdcode = properties.adcode;
            _this.geoJson = res.data;
            echarts.registerMap(_this.currentArea, _this.geoJson);
            myChart = echarts.init(_this.$refs.myEchart);
            // window.onresize = myChart.resize;
            myChart.setOption(_this.getOption(_this.currentArea));
            this.$emit("changeLevel", properties);
          }
        });
      } else {
        // Axios.get(apiPre + properties.adcode + apiFullSuf).then((res) => {
        //   if (res.status == 200) {
        //     myChart = null;
        //     _this.level = properties.level;
        //     _this.currentArea = properties.name;
        //     _this.currentAdcode = properties.adcode;
        //     _this.geoJson = res.data;
        //     echarts.registerMap(_this.currentArea, _this.geoJson);
        //     myChart = echarts.init(_this.$refs.myEchart);
        //     // window.onresize = myChart.resize;
        //     myChart.setOption(_this.getOption(_this.currentArea));
        //     this.$emit("changeLevel", properties);
        //     myChart.on("click", function (param) {
        //       _this.changeLevel(param.name);
        //     });
        //   }
        // });
        console.log("apiPre + properties.adcode + apiSuf");
         getGeoJson(apiPre + properties.adcode + apiFullSuf).then(res=>{
          console.log("apiPre + properties.adcode + apiSuf");
        });
      }
    },
    backToParent() {
      let acroutes = this.geoJson.features[0].properties.acroutes;
      if (this.geoJson.features[0].properties.level == "district") {
        this.changeLevel(null, acroutes[acroutes.length - 1]);
      } else {
        acroutes.forEach((ele, index) => {
          if (this.currentAdcode == ele && index > 0) {
            this.changeLevel(null, acroutes[index - 1]);
          }
        });
      }
    },
    getOption(pyName) {
      var option = {
        title: {
          text: "",
          left: "center",
          textStyle: {
            color: "#fff",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: function (data) {
            console.log(data);
            if (!isNaN(data.value)) {
              return data.name + "：" + data.value;
            }
          },
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
        },
        dataRange: {
          show: false,
          min: 0,
          max: 1000,
          text: ["High", "Low"],
          realtime: true,
          calculable: true,
          color: ["orangered", "yellow", "lightskyblue"],
        },
        geo: [
          // 这个是重点配置区
          {
            map: pyName, // 表示中国地图
            roam: false,
            zoom: 1.25,
            zlevel: 2,
            z: 1,
            label: {
              normal: {
                show: true, // 是否显示对应地名
                textStyle: {
                  color: "#ffffff",
                },
              },
            },
            itemStyle: {
              normal: {
                borderColor: "#0d2d82",
                borderWidth: 1.5,
                areaColor: "#2081f7",
              },
              emphasis: {
                borderWidth: 1,
                shadowColor: "#000a7d",
              },
            },
          },
          //   {
          //     map: pyName,
          //     roam: false,
          //     zoom: 1.25,
          //     zlevel: 0,
          //     z: 0,
          //     label: {
          //       normal: {
          //         show: false,
          //       },
          //       emphasis: {
          //         show: false,
          //       },
          //     },
          //     itemStyle: {
          //       normal: {
          //         borderColor: "#013a67",
          //         borderWidth: 1,
          //         areaColor: "#0aade4",
          //         shadowColor: "rgb(2, 34, 105)",
          //         shadowBlur: 0,
          //         shadowOffsetY: 20,
          //       },
          //       emphasis: {
          //         borderWidth: 1,
          //         areaColor: "#07aae1",
          //         borderColor: "#013a67",
          //       },
          //     },
          //   },
        ],
        series: [
          {
            type: "lines",
            coordinateSystem: "geo",
            zlevel: 2,
            effect: {
              show: true,
              period: 4,
              trailLength: 0.01,
              symbol: "arrow",
              symbolSize: 5,
            },
            lineStyle: {
              normal: {
                width: 2,
                opacity: 0.6,
                curveness: 0.2,
                shadowColor: "#33dbf0",
                color: "#33dbfc",
              },
            },
          },
        ],
      };
      return option;
    },
  },
};
</script>
