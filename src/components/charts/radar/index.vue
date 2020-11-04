<template>
  <div style="height:280px;display:flex; align-items: center;justify-content: space-around;">
    <Chart :chartData="radarData" width="300px" height="250px"></Chart>
    <div>
      <div v-for="(data, index) in radarData" :key="index" style="text-align:left;line-height: 40px;">
        <span style="font-size:18px;"> {{ data.name }}</span>
        <span style="font-size:20px;"> {{ data.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "./chart";

export default {
  components: { Chart },
  data() {
    return {
      radarData: [
        { name: "分类收集", value: 6500 },
        { name: "分类运输", value: 16000 },
        { name: "分类处理", value: 30000 },
        { name: "分类回收", value: 38000 },
        { name: "社会因素", value: 52000 },
        { name: "经济因素", value: 25000 },
      ],
    };
  },
};
</script>
