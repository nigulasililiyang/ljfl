<template>
  <div
    style="
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    "
  >
    <Chart :chartData="radarData" width="320px" height="300px"></Chart>
    <div style="display: grid">
      <div
        v-for="(data, index) in panelData"
        :key="index"
        style="display: flex; text-align: left; line-height: 36px"
      >
        <span style="padding-right: 18px"> {{ data.name }}</span>
        <span> {{ data.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "./chart";
import { listQuotaGroups } from "@/api/system/quotas";
export default {
  components: { Chart },
  props: {
    areaTag: {
      type: String,
      required: true,
    },
  },
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
      panelData: [],
    };
  },
  created() {
    // this.getCode();
    this.getQuotaGroups();
  },
  watch: {
    areaTag: function () {
      this.getQuotaGroups();
    },
  },
  methods: {
    //获取分类指标
    getQuotaGroups() {
      if (this.areaTag.length == 0) {
        return;
      }
      //获取分组得分信息
      let queryForm = {
        areaTag: this.areaTag,
      };
      listQuotaGroups(queryForm).then((response) => {
        if (response.code == 200) {
          let quotaGroups = response.quotaGroups;
          this.radarData = [];
          this.panelData = [];
          let indicator = [];
          let data = [];
          let dataHZ = [];
          quotaGroups.forEach((element) => {
            indicator.push({ name: element.quota_group_name,max:element.group_weight });
            data.push(element.score);
            this.panelData.push({
              name: element.quota_group_name,
              value: element.score,
            });
            dataHZ.push(element.hz_score);
          });
          this.radarData = {
            indicator: indicator,
            data: [
              { name: "杭州", value: dataHZ },
              { name: "当前选中", value: data },
            ],
          };
        }
      });
    },
  },
};
</script>
