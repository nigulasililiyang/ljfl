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
      type: Object,
      required: true,
    },
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
      let indicator = this.chartData.indicator;
      let valueList = this.chartData.data;
      let legend=[];
      valueList.forEach(element => {
        legend.push(element.name)
      });
      this.chart.setOption({
         tooltip: {
        trigger: 'axis'
    },
        legend: {
          left: "left",
          data: legend,
          // orient: "vertical",
          textStyle: {
            color: "#ffffff",
          },
          top:"10px"
        },
        radar: {
          name: {
            textStyle: {
              color: "#fff",
              padding: [0, 0],
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
          indicator: indicator,
          center: ['50%', '60%'],
          radius: 80
        },
        series: {
          type: "radar",
          tooltip: {
            trigger: "item",
          },
          symbol: "circle",
          symbolSize: 5,
          color: ["#3589e4", "#a101fe"],
          lineStyle: {
            color: "#38a8dc",
          },
          areaStyle: [
            { color: "#38a8dc", opacity: 0.86 },
            { color: "#a101fe", opacity: 0.86 },
          ],
          data: valueList,
        },
      });
    },
  },
};
</script>
