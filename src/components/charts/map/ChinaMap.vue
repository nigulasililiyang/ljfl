<template>
  <div class="app-container">
    当前地图范围：{{ currentArea }}（{{ level }}）<el-button
      type="text"
      v-if="currentAdcode != 100000"
      @click="backToParent()"
      >返回上一层</el-button
    >
    <div :style="{ height:smallSize?'620px': height, width: smallSize?'625px':width }" ref="myEchart"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import $ from "jquery";
import "echarts/lib/component/geo";
var myChart = null;
var apiPre = "https://geo.datav.aliyun.com/areas_v2/bound/";
var apiFullSuf = "_full.json";
var apiSuf = ".json";
import Axios from "axios";
import { getGeoJson } from "@/api/map.js";
export default {
  props: {
    width: {
      type: String,
      default: "1920px",
    },
    height: {
      type: String,
      default: "887px",
    },
  },
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
    // geoJson(){
    //   return this.$store.state.chinaMap.geoJson
    // }
  },
  data() {
    return {
      chart: null,
      // level: "country", //0:中国,1:省，2:市 3:区
      // currentArea: "全国",
      // currentAdcode: 100000,
      geoJson: {},
      smallSize:false
    };
  },
  created() {
    let properties = {
      level: this.level,
      adcode: this.currentAdcode,
      name: this.currentArea,
    };
    this.showMap(properties);
  },
  methods: {
    changeLevel(zhName, adcode) {
      let _this = this;
      if (adcode == null) {
        _this.geoJson.features.forEach((element) => {
          if (element.properties.name == zhName) {
            _this.showMap(element.properties);
          }
        });
      } else {
        var http = require("http");
        var fs = require("fs");
        http.get(apiPre + adcode + apiSuf, function (res) {
          res.setEncoding("utf-8");
          var datas = "";
          res
            .on("data", function (data) {
              datas += data;
            })
            .on("end", function () {
              let feature = JSON.parse(datas).features[0];
              _this.showMap(feature.properties);
            });
        });
      }
    },
    showMap(properties) {
      let _this = this;
      var http = require("http");
      var fs = require("fs");
      http.get(apiPre + properties.adcode + apiFullSuf, function (res) {
        res.setEncoding("utf-8");
        var datas = "";
        res
          .on("data", function (data) {
            datas += data;
          })
          .on("end", function () {
            _this.smallSize=(properties.level == "district"?true:false);
            myChart = null;
            _this.$store.dispatch("SetCurrentMap", properties);
            _this.geoJson = JSON.parse(datas);
            echarts.registerMap(properties.name, _this.geoJson);
            myChart = echarts.init(_this.$refs.myEchart);
            myChart.setOption(_this.getOption(_this.currentArea));
            myChart.resize;
            if (properties.level == "city") {
              myChart.on("click", function (param) {
                _this.setSelected(param);
              });
            } else {
              myChart.on("click", function (param) {
                _this.changeLevel(param.name);
              });
            }
          });
      });
      // }
    },
    backToParent() {
      let acroutes = this.geoJson.features[0].properties.acroutes;
      if (this.level == "district") {
        this.changeLevel(null, acroutes[acroutes.length - 1]);
      } else {
        acroutes.forEach((ele, index) => {
          if (this.currentAdcode == ele && index > 0) {
            this.changeLevel(null, acroutes[index - 1]);
          }
        });
      }
    },
    setSelected(param) {
      var selected = param.selected;
      var mapSeries = option.series[0];
      var data = [];
      var legendData = [];
      var name;
      for (var p = 0, len = mapSeries.data.length; p < len; p++) {
        name = mapSeries.data[p].name;
        //mapSeries.data[p].selected = selected[name];
        if (selected[name]) {
          data.push({
            name: name,
            value: mapSeries.data[p].value,
          });
          legendData.push(name);
        }
      }
      option.legend.data = legendData;
      option.series[1].data = data;
      myChart.setOption(option, true);
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
        geo: [
          // 这个是重点配置区
          {
            map: pyName, // 表示中国地图
            // roam: true,
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
        ],
        series: [
          {
            type: "lines",
            coordinateSystem: "geo",
            zlevel: 1,
            // roam: true,
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
            selectedMode: "multiple",
          },
        ],
      };
      return option;
    },
  },
};
</script>
