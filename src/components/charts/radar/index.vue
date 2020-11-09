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
import { listQuotaGroups } from "@/api/system/quotas";
export default {
  components: { Chart },
  props: {
     areaTag: {
        type: String,
        required: true
      }
  },
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
  created() {
    // this.getCode();
    this.getQuotaGroups();
  },
  watch:{
    areaTag:function(){
      this.getQuotaGroups();
    }
  },
  methods: {
    //获取分类指标
    getQuotaGroups(){
      if(this.areaTag.length == 0){
        return;
      }
      //获取分组得分信息
      let queryForm = {
        areaTag:this.areaTag
      };
      listQuotaGroups(queryForm).then(response => {
        if(response.code == 200){
          let quotaGroups = response.quotaGroups;
          this.radarData = [];
          quotaGroups.forEach(element=>{
            let tmp = {
              name:element.quota_group_name,
              value:element.score,
              valueHZ:element.hz_score
            };
            this.radarData.push(tmp);
          });
        }
      });   
    }
  }
};
</script>
