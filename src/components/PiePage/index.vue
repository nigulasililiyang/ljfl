<template>
  <div id="piecharts" :class="className" :style="{height:height,width:width}">
  </div>
</template>

<script>
import echarts from "echarts";
import resize from "../../views/dashboard/mixins/resize";
export default {
  components:{
    
  },
    mixins: [resize],
    props: {
    className: {
      type: String,
      default: "pie"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    pieData: {
      // type: Object,
      required: true
    },
    chartColor: {
      default: undefined
    }
  },
  data(){
    return{
     pie:'',
     names: [],
     series: undefined,
     defaultTextColor:"#fff",
      defaultColors: ["#f90d0d", "#19d61f", "#0c74e0", "#3e42cb", "#b766cb"],
    // defaultColors:["#0dff00","#7ccdbf","#edd6b9"],
     title:undefined
    }
  },
  watch: {
    pieData: {
    handler(val) {
        this.getSeries();
        this.setOptions();
        this.getColor();
        }
    }
  },
  created(){
  },
  mounted() {
    this.getColor();
    this.getSeries();

    this.$nextTick(() => {
      this.initPie();
    });
  },
  beforeDestroy() {
  // 也清理下 pie 数据
   this.pie.dispose();
    this.pie = null;
  },
  methods:{
    getColor(){
      if(this.chartColor!=undefined){
        this.defaultColors =  this.chartColor.colors;
      }
    },
    initPie(){
      this.pie = echarts.init(this.$el);
      this.setOptions();

    },
    getSeries(){
      this.series = {
        name:'压力分析',
        type:'pie',
        radius: '75%',
        center:['40%','60%'],
        label:{
          formatter:'{b} ({d}%)',
            normal: {
                  backgroundColor: '#0071a5',
                  height: 30,
                  borderRadius: 5,
                  borderColor: '#ffffff',
                  padding: [0, 10, 0, 10],
                  borderWidth: 1,
                  formatter: "{b|{b}：} {per|{d}%}  \n",
                  //formatter: "{per|{d}%}  \n",
                rich: {
                  b: {
                    fontSize: 15,
                    padding: [20, 0, 10, 0],
                    color:'#ffffff'
                  },
                  per: {
                    fontSize: 15,
                    lineHeight: 30,
                    padding: [20, 0, 10, 0],
                    color:'#ffffff'
                  }
                }
              }
        },
        data:this.pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            
          }
        }
      }
    },
    setOptions({ expectedData, actualData } = {}) {
      if(this.pie!=null){
      this.pie.dispose();
      this.pie = null;
      this.pie = echarts.init(this.$el);
      } 
      this.pie.resize({height:this.height});
      this.title="饼图分析"
      if(this.pieData.length != 3)
      {    
        this.pie.setOption({
        //   title:{
        //     text:this.title,
        //     left:'center',
        //     textStyle: {
        //     color: this.defaultTextColor
        //   }
        // },
        tooltip: {
        trigger: 'item',
       formatter: '{a} <br/>{b} : ({d}%)',
        lineStyle: {
              color: this.defaultTextColor
            },
            crossStyle: {
              color: this.defaultTextColor
            }
        },
        grid: {//这个做的是底板定位
          left: 10,
          right: 30,
          bottom: 20,
          top: 60,
          containLabel: true
        },
        legend:{
           orient: 'vertical',
        left: 'left',
        textStyle: {
            color: this.defaultTextColor
          }
        },
        dataset:{
          source:this.pieData["source"]
        },
        series:this.pieData["series"],
        color: this.defaultColors,
        title: this.pieData["title"]
        })
      }
      else{
        if(this.pieData[0].value == 0 &&
            this.pieData[1].value == 0 &&
            this.pieData[2].value == 0 ){
            this.title="暂无数据"
          }
          this.pie.setOption({
              title:{
              text:this.title,
              left:'center',
              textStyle: {
              color: this.defaultTextColor
            }
          },
          tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : ({d}%)',
          lineStyle: {
                color: this.defaultTextColor
              },
              crossStyle: {
                color: this.defaultTextColor
              }
          },
          grid: {//这个做的是底板定位
            left: 10,
            right: 30,
            bottom: 20,
            top: 60,
            containLabel: true
          },
          legend:{
              orient: 'vertical',
          left: 'left',
          textStyle: {
              color: this.defaultTextColor
            }
          },
          color: this.defaultColors,
          series: this.series
        })
      }     
    }
  }
}
</script>