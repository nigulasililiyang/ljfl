<template>
  <div
    style="
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    "
  >
    <Chart :chartData="radarData" width="400px" height="250px"></Chart>
  </div>
</template>

<script>
import Chart from "./chart";

export default {
  components: { Chart },
  data() {
    return {
      radarData: {
        indicator: [
          { name: "分类收集", max: 7500 },
          { name: "分类运输", max: 26000 },
          { name: "分类处理", max: 40000 },
          { name: "分类回收", max: 48000 },
          { name: "社会因素", max: 62000 },
          { name: "经济因素", max: 35000 },
        ],
        data: [
          { name: "杭州", value: [6500, 16000, 30000, 38000, 52000, 25000] },
          { name: "金华", value: [3500, 17000, 30000, 36000, 50000, 24000] },
        ],
      },
    };
  },
};
</script>
