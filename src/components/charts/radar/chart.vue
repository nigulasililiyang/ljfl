<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
import resize from "../../../views/dashboard/mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
     chartData: {
        type: Array,
        required: true
      }
  },
  data() {
    return {
      chart: null,
      names: [],
      series: [],
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el);
      this.setOptions(this.chartData);
    },
    setOptions() {
    let indicator=[];
    let valueList=[];
    let maxData=Math.max.apply(Math, this.chartData.map(function(o) {return o.value}))
    for (let data of this.chartData) {
        let indicatorItem={name:data.name,max:maxData};
        indicator.push(indicatorItem);
        valueList.push(data.value);
    }
      this.chart.setOption({
        tooltip: {},
        radar: {
          name: {
            textStyle: {
              color: "#fff",
              padding: [0, 0]
            },
          },
          splitArea: {
            areaStyle: {
              color: ["rgba(0, 0, 0, 0)"],
            },
          },
          axisLine: {
            lineStyle: {
              color: "#3589e4",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#3589e4",
            },
          },
          indicator:indicator,
        },
        series: {
          type: "radar",
          symbol: "circle",
          symbolSize: 5,
          color: ["#3589e4"],
          lineStyle: {
            color: "#38a8dc",
          },
          areaStyle: { color: "#38a8dc", opacity: 0.86 },
          data: [
            {
              value: valueList,
              name: "各类指标得分情况",
            },
          ],
        },
      });
    },
  },
};
</script>
