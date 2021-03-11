<template>
  <div>
    <el-row type="flex" justify="space-between" align="center">
      <div style="padding-left:20px;">
        <p>当前地图范围：{{ currentArea }}（{{ level }}）</p>
        <p v-if="checked2">更新时间：{{ recordTimeFormate }}</p>
      </div>
      <div v-if="level != 'country'">
        <el-checkbox
          v-model="checked1"
          label="显示已评价区域"
          border
          size="medium"
          @change="change"
        ></el-checkbox>
        <el-checkbox
          v-model="checked2"
          label="显示更新时间"
          border
          size="medium"
        ></el-checkbox>
      </div>
    </el-row>
    <el-row v-if="level != 'country'">
      <el-button v-if="level != 'country'" @click="backToParent()" type="text" size="medium"
        >返回上一层</el-button
      >
    </el-row>
    <div
      :class="level != 'country' ? 'hasbg' : ''"
      :style="{ height: height, width: width }"
      ref="myEchart"
    ></div>
  </div>
</template>
<script>
import echarts from "echarts";
import $ from "jquery";
import "echarts/lib/component/geo";
import { getAreaByName } from "@/api/system/quotas";
var myChart = null;
const chinaJson = require("echarts/map/json/china.json");
const provinceMap = require("./province.json");
import axios from "axios";
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
    color: {
      type: String,
      default: "#2081f7",
    },
    recordTime: {
      type: String,
      default: "",
    },
  },
  computed: {
    recordTimeFormate() {
      if (this.recordTime != "") {
        return this.$moment(new Date(this.recordTime * 1000)).format(
          "YYYY-MM-DD HH:MM:SS"
        );
      }
      return "暂无更新时间";
    },
  },
  data() {
    return {
      chart: null,
      level: "", //0:中国,1:省，2:市 3:区
      currentArea: "",
      currentAreaPingYin: "",
      geoJson: {},
      children: [], //当前省下面的市
      province: "",
      chinaProperties: {
        level: "country",
        label: "全国", //中文名
        name: "china", //拼音
      },
      checked1: undefined, //显示已评价区域
      checked2: undefined, //显示更新时间
    };
  },
  mounted() {
    this.showChina();
  },
  methods: {
    change(checked) {
      if (checked) {
        console.log("xuanzhong");
        this.children.forEach((child, index) => {
          if (child.questionStatus != "1") {
            this.children[index].value = 1;
          } else {
            this.children[index].value = undefined;
          }
        });
      } else {
        this.children.forEach((child, index) => {
          this.children[index].value = undefined;
        });
      }
      if (this.level == "province") {
        myChart.setOption(this.getProvinceOption(this.currentAreaPingYin));
      } else {
        myChart.setOption(this.getProvinceOption(provinceMap[this.province]));
      }
    },
    resetChildren() {
      return new Promise((resolve) => {
        let children = [];
        let promises = [];
        this.geoJson.features.forEach((element) => {
          let params = {
            areaName: element.properties.name,
          };
          promises.push(getAreaByName(params));
        });
        axios.all(promises).then((res) => {
          res.forEach((ele, index) => {
            let properties = this.geoJson.features[index].properties;
            if (ele) {
              let areaInfo = ele.areaInfo;
              children.push({
                name: properties.name,
                questionStatus: areaInfo.question_status,
                itemStyle: {
                  areaColor: areaInfo.classify_name
                    ? areaInfo.classify_name == "四分法"
                      ? "green"
                      : areaInfo.classify_name == "三分法"
                      ? "yellow"
                      : areaInfo.classify_name == "二分法"
                      ? "orangered"
                      : "#2081f7"
                    : "#2081f7",
                },
              });
            } else {
              children.push({
                name: properties.name,
                // value: "0",
                itemStyle: {
                  areaColor: "#2081f7",
                },
              });
            }
          });
          this.children = children;
          resolve();
        });
      });
    },
    async showProvince(param) {
      if (myChart != null) {
        myChart.dispose();
      }
      let properties = {
        level: "province",
        name: provinceMap[param.name],
        label: param.name,
      };
      let _this = this;
      _this.province = param.name;
      _this.$emit("changeLevel", properties);
      _this.level = properties.level;
      _this.currentArea = properties.label;
      _this.currentAreaPingYin = properties.name;

      _this.geoJson = require("echarts/map/json/province/" +
        properties.name +
        ".json");
      await _this.resetChildren();
      _this.$nextTick(() => {
        echarts.registerMap(_this.currentAreaPingYin, _this.geoJson);
        myChart = echarts.init(_this.$refs.myEchart);
        window.onresize = myChart.resize;
        myChart.setOption(_this.getProvinceOption(_this.currentAreaPingYin));
        myChart.on("click", function (param) {
          let cityProperties = {
            level: "city",
            name: param.name,
            label: param.name,
          };
          _this.showCity(cityProperties);
        });
      });
    },
    showCity(cityProperties) {
      let _this = this;
      _this.$emit("changeLevel", cityProperties);
      _this.$nextTick(() => {
        _this.children.forEach((ele, index) => {
          _this.children[index].selected = false;
          if (cityProperties.label == ele.name) {
            _this.children[index].selected = true;
          }
        });
        _this.level = cityProperties.level;
        _this.currentArea = cityProperties.label;
        _this.currentAreaPingYin = cityProperties.name;
        myChart.setOption(_this.getProvinceOption(provinceMap[_this.province]));
      });
    },
    async showChina() {
      let _this = this;
      let properties = _this.chinaProperties;
      _this.$emit("changeLevel", properties);
      _this.level = properties.level;
      _this.currentArea = properties.label;
      _this.currentAreaPingYin = properties.name;
      _this.geoJson = chinaJson;
      _this.$nextTick(() => {
        if (myChart != null) {
          myChart.dispose();
        }
        echarts.registerMap(_this.currentAreaPingYin, _this.geoJson);
        myChart = echarts.init(_this.$refs.myEchart);
        window.onresize = myChart.resize;
        myChart.setOption(_this.getOption(_this.currentAreaPingYin));
        myChart.on("click", function (param) {
          _this.showProvince(param);
        });
      });
    },
    async backToParent() {
      if (this.level == "city") {
        this.showProvince({ name: this.province });
      } else if (this.level == "province") {
        this.showChina();
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
                  fontSize:20
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
    getProvinceOption(pinyin) {
      var option = {
        visualMap: {
          show: false,
          type: "piecewise",
          pieces: [{ value: 1, color: "grey" }],
        },
        series: [
          {
            type: "map",
            map: pinyin,
            data: this.children,
            zoom: 1.25,
            label: {
              show: true,
              normal: {
                show: true,
                color: "#fff",
                fontSize: 20,
              },
              emphasis: {
                show: true,
                fontSize: 20,
                color: "#fff",
              },
            },
            itemStyle: {
              normal: {
                // areaColor:"",
                borderColor: "#111",
              },
              emphasis: {
                //鼠标移入高亮显颜色
                borderWidth: 1,
                shadowColor: "#000a7d",
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
<style scoped>
.hasbg {
  background: url("../../../assets/image/center-box.png") no-repeat;
  background-size: 100%;
  background-position: bottom;
}
</style>
