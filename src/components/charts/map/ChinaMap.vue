<template>
  <div>
    <el-row type="flex" justify="space-between" align="center">
      <div>
        <p>当前地图范围：{{ currentArea }}（{{ level }}）</p>
        <p v-if="checked2">更新时间：{{ recordTimeFormate }}</p>
      </div>
      <div v-if="level != 'country'">
        <el-checkbox
          v-model="checked1"
          label="显示已评价区域"
          border
          size="mini"
        ></el-checkbox>
        <el-checkbox
          v-model="checked2"
          label="显示更新时间"
          border
          size="mini"
        ></el-checkbox>
      </div>
    </el-row>
    <el-row v-if="level != 'country'">
      <el-button v-if="level != 'country'" @click="backToParent()" type="text"
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
var myChart = null;
const chinaJson = require("echarts/map/json/china.json");
const provinceMap = require("./province.json");
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
  beforeUpdate() {
    myChart.resize();
  },
  mounted() {
    this.showChina();
  },
  watch: {
    geoJson: {
      handler(val) {
        this.resetChildren();
      },
    },
  },
  methods: {
    resetChildren() {
      let data = [];
      this.geoJson.features.forEach((element) => {
        data.push({ name: element.properties.name, value: "0" });
      });
      this.children = data;
    },
    showProvince(param) {
      let properties = {
        level: "province",
        name: provinceMap[param.name],
        label: param.name,
      };
      let _this = this;
      _this.province = param.name;
      _this.$emit("changeLevel", properties);
      _this.$nextTick(() => {
        if (myChart != null) {
          myChart.dispose();
        }
        _this.level = properties.level;
        _this.currentArea = properties.label;
        _this.currentAreaPingYin = properties.name;
        _this.geoJson = require("echarts/map/json/province/" +
          properties.name +
          ".json");
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
          _this.children[index].value = "0";
          if (cityProperties.label == ele.name) {
            _this.children[index].value = "1";
          }
        });
        _this.level = cityProperties.level;
        _this.currentArea = cityProperties.label;
        _this.currentAreaPingYin = cityProperties.name;
        myChart.setOption(_this.getProvinceOption(provinceMap[_this.province]));
      });
    },

    showChina() {
      let _this = this;
      let properties = _this.chinaProperties;
      _this.$emit("changeLevel", properties);
      _this.$nextTick(() => {
        if (myChart != null) {
          myChart.dispose();
        }
        _this.level = properties.level;
        _this.currentArea = properties.label;
        _this.currentAreaPingYin = properties.name;
        _this.geoJson = chinaJson;
        echarts.registerMap(_this.currentAreaPingYin, _this.geoJson);
        myChart = echarts.init(_this.$refs.myEchart);
        window.onresize = myChart.resize;
        myChart.setOption(_this.getOption(_this.currentAreaPingYin));
        myChart.on("click", function (param) {
          _this.showProvince(param);
        });
      });
    },
    backToParent() {
      if (this.level == "city") {
        this.resetChildren();
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
                },
              },
            },
            itemStyle: {
              normal: {
                borderColor: "#0d2d82",
                borderWidth: 1.5,
                areaColor: this.color,
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
          left: "right",
          categories: ["1"],
          inRange: {
            color: ["#f46d43"],
          },
          text: ["High", "Low"], // 文本，默认为数值文本
          calculable: true,
        },
        geo: [
          {
            map: pinyin, // 表示中国地图
            roam: false,
            zoom: 1.25,
            itemStyle: {
              normal: {
                borderColor: "#0d2d82",
                borderWidth: 1.5,
                areaColor: this.color,
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
            type: "map",
            map: pinyin,
            data: this.children,
            zoom: 1.25,
            label: {
              show: true,
              normal: {
                show: true,
                color: "#fff",
              },
              emphasis: {
                show: true,
                fontSize: 16,
                color: "#fff",
              },
            },
            itemStyle: {
              normal: {
                areaColor: this.color,
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
