<template>
  <div>
    <el-row class="row">
      <el-col :span="8" class="inline x-flex-center">
        <div class="item">
          <div class="inline x-flex-center y-flex-center">
            <div class="left-right-title">实时数据</div>
            <div class="left-another"></div>
          </div>
          <div class="left">
            <div class="sub-title">当前数据:</div>
            <div class="inline realtime y-flex-center">
              <div
                v-for="(data, index) in realtimeData"
                :key="index"
                class="inline y-flex-center"
              >
                <el-image
                  :src="require('@/assets/image/' + data.icon)"
                  style="width: 45px; height: 45px; margin-right: 13px"
                />
                <div>
                  <p>{{ data.title }}</p>
                  <p>{{ data.value }}</p>
                </div>
              </div>
            </div>
            <div class="sub-title">各类指标得分情况:</div>
            <Radar :areaTag="queryForm.areaTag"/>
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="inline x-flex-center">
        <div class="center">
           <china-map width="625px" height="603px" @changeLevel="changeLevel"/>
        </div>
      </el-col>
      <el-col :span="8" class="inline x-flex-center">
        <div class="item">
          <div class="inline x-flex-center y-flex-center">
            <div class="right-another"></div>
            <div class="left-right-title">综合报告</div>
          </div>
          <div class="right">
            <div class="sub-title">当前城市报告</div>
            <div class="city-report inline y-flex-center">
              <div
                style="
                  width: 96px;
                  text-align: center;
                  line-height: 86px;
                  height: 96px;
                  border-radius: 50%;
                  border: solid 5px #32b16c;
                  font-size: 46px;
                  color: #00ff12;
                "
              >
                {{areaInfo.score_grade_name}}
              </div>
              <div style="text-align: center">
                <p
                  style="
                    font-size: 50px;
                    font-weight: bold;
                    letter-spacing: -5px;
                    color: #84efff;
                    margin: 0;
                  "
                >
                  {{areaInfo.total_score}}
                </p>
                <p style="font-size: 18px; margin: 0">总体评分</p>
              </div>
              <div>
                <p style="font-size: 19px; line-height: 30px; margin: 0">
                  12:56:12 星期三
                </p>
                <p style="font-size: 16px; line-height: 30px; margin: 0">
                  分类建议：{{areaInfo.classify_name}}
                </p>
                <p style="font-size: 31px; margin: 0">浙江-杭州</p>
              </div>
            </div>
            <div class="sub-title">报告</div>
            <div class="report"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="inline y-flex-center" style="justify-content: space-around">
      <div class="bottom-left-bg"></div>
      <div
        class="bottom-item-bg"
        v-for="(item, index) in bottomItemList"
        :key="index"
      >
        <div class="title">{{ item.title }}</div>
        <div class="inline y-flex-center" style="justify-content: space-around">
          <svg-icon class="bottom-icon-bg" :icon-class="item.icon" />
          <div class="content">{{ item.content }}</div>
        </div>
      </div>
      <div class="bottom-right-bg"></div>
    </div>
  </div>
</template>
<script>
import Radar from "@/components/charts/radar/index";
import ChinaMap from "@/components/charts/map/ChinaMap.vue";
import { listQuotaRates,listQuotaGroups,getAreaInfo,listQuestions,getAreaByName  } from "@/api/system/quotas";
export default {
  name: "Index",
  components: { Radar,ChinaMap },
  data() {
    return {
      realtimeData: [
        {
          title: "可回收垃圾",
          value: 45631,
          icon: "recyclable-garbage.png",
        },
        {
          title: "厨余垃圾",
          value: 45631,
          icon: "kitchen-garbage.png",
        },
        {
          title: "有害垃圾",
          value: 45631,
          icon: "harmful-garbage.png",
        },
      ],
      bottomItemList: [
        {
          title: "垃圾分类环节建议",
          content: "当前地区垃圾分类覆盖率不足，请提高垃圾分类覆盖率!",
          icon: "type",
        },
        {
          title: "社会因素模块建议",
          content: "当前地区居民支持率不足，请加强宣传教育!",
          icon: "combo",
        },
        {
          title: "经济因素模块建议",
          content:
            "当前地区经济水平相对不足，不适合立即进行细分类，请先提高经济水平!",
          icon: "e-learning",
        },
      ],
      //区域基本信息
      areaInfo:{
        area_tag:""
      },
      //区域分组得分情况
      quotaGroups:[],
      //区域指标得分情况
      quotaRates:[],
      //问卷情况
      questions:[],
      //查询参数
      queryForm:{
        areaTag:""
      },
      //区域名称，只有当前区域名字
      areaName:"",
      //区域全称，省份-城市
      areaFullName:"",
      rules: {
        field102: [
          {
            required: true,
            message: "当前数据",
            trigger: "blur",
          },
        ],
      },
      //省会列表
      capitalList:[
        {province:"北京市",capital:"北京"},
{province:"上海市",capital:"上海"},
{province:"天津市",capital:"天津"},
{province:"重庆市",capital:"重庆"},
{province:"黑龙江省",capital:"哈尔滨"},
{province:"吉林省",capital:"长春"},
{province:"辽宁省",capital:"沈阳"},
{province:"内蒙古",capital:"呼和浩特"},
{province:"河北省",capital:"石家庄"},
{province:"新疆",capital:"乌鲁木齐"},
{province:"甘肃省",capital:"兰州"},
{province:"青海省",capital:"西宁"},
{province:"陕西省",capital:"西安"},
{province:"宁夏",capital:"银川"},
{province:"河南省",capital:"郑州"},
{province:"山东省",capital:"济南"},
{province:"山西省",capital:"太原"},
{province:"安徽省",capital:"合肥"},
{province:"湖北省",capital:"武汉"},
{province:"湖南省",capital:"长沙"},
{province:"江苏省",capital:"南京"},
{province:"四川省",capital:"成都"},
{province:"贵州省",capital:"贵阳"},
{province:"云南省",capital:"昆明"},
{province:"广西省",capital:"南宁"},
{province:"西藏",capital:"拉萨"},
{province:"浙江省",capital:"杭州"},
{province:"江西省",capital:"南昌"},
{province:"广东省",capital:"广州"},
{province:"福建省",capital:"福州"},
{province:"台湾省",capital:"台北"},
{province:"海南省",capital:"海口"},
{province:"香港",capital:"香港"},
{province:"澳门",capital:"澳门"}
      ]
    };
  },
  methods: {
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
      });
    },
    /**
     * 根据标签获取问题
     */
    findQuestionByTag(questionTag){
      let question = null;
      this.questions.forEach(element=>{
        if(element.quota_tag == questionTag){
          question = element;
        }
      });
      return question;
    },
    /**
     * 根据标签获取指标详情
     */
    findQuotaRateByTag(quotaRateTag){
      let quotaRate = null;
      this.quotaRates.forEach(element=>{
        if(element.quota_rate_tag == quotaRateTag){
          quotaRate = element;
        }
      });
      return quotaRate;
    },
    /**
     * 获取省会城市
     */
    findProvinceCapital(province){
      let provinceCapital = null;
        this.capitalList.forEach(element=>{
             if(element.province == province){
               provinceCapital = element;
             }
           })
        return provinceCapital;
    },
    //获取区域的详细信息
    getAreaDetail(){
        //获取区域基本信息
        // getAreaInfo(this.queryForm).then(response => {
        //     if(response.code == 200){
        //       this.areaInfo = response.areaInfo;
        //     }
        //   });

        //获取分组得分信息
        listQuotaGroups(this.queryForm).then(response => {
            if(response.code == 200){
              this.quotaGroups = response.quotaGroups;
            }
          });   
        
        //获取指标得分详情 
        listQuotaRates(this.queryForm).then(response => {
            if(response.code == 200){
               this.quotaRates = response.quotaRates;
            }
          });    

        //获取问卷详情     
        listQuestions(this.queryForm).then(response => {
          this.realtimeData = []
            if(response.code == 200){
              this.questions = response.questions;
              let recoveryGarbage = this.findQuestionByTag('recovery_recovered');
              let recovery = {
                title:"可回收垃圾",
                value:recoveryGarbage.quota_value,
                icon: "recyclable-garbage.png"
              };
              this.realtimeData.push(recovery);
              let kitchenGarbage = this.findQuestionByTag('real_kitchen_waste_deal');
              let kitchen = {
                title:"厨余垃圾",
                value:kitchenGarbage.quota_value,
                icon: "kitchen-garbage.png"
              };
              this.realtimeData.push(kitchen);
              let harmfulGarbage = this.findQuestionByTag('real_harmful_waste_deal');
              let harmful = {
                title:"有害垃圾",
                value:harmfulGarbage.quota_value,
                icon: "harmful-garbage.png"
              };
              this.realtimeData.push(harmful);
             }
          }); 
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    changeLevel(val){
       sessionStorage.setItem('properties',JSON.stringify(val) )
       //只有两次点击的地区名称不一致时才需要重新加载
       let curAreaName = val.name;
        if(val.level == "province"){
           //如果是省份，默认获取该省的省会城市
           let element = this.findProvinceCapital(val.name);
           if(element != null){
             curAreaName = element.capital;
             this.areaFullName = val.name + "-" + curAreaName;
           }
        }else if(val.level == "city"){
           console.log(val);
        }else{
          //除了省会和地级市外，其它地区不予处理
          return;
        }
       if(this.areaName != curAreaName){
         this.areaName = curAreaName;
          let params = {
            areaName:curAreaName
          }
         getAreaByName(params).then(response=>{
            if(response.code == 200){
              this.areaInfo = response.areaInfo;
              this.queryForm.areaTag = this.areaInfo.area_tag;
              this.getAreaDetail();
            }
         });

          console.log(this.areaInfo);
       }

    }
  },
};
</script>

<style lang="scss" scoped>
.row {
  background: url("../assets/image/center-box.png") no-repeat;
  background-size: 100% 100%;
  .left-right-title {
    font-family: HYa0gj;
    font-size: 37px;
    color: #fea501;
    line-height: 73px;
  }
  .left-another {
    background: url("../assets/image/left-another.png") no-repeat;
    background-size: 100% 100%;
    width: 378px;
    height: 29px;
    margin-left: 17px;
  }
  .left {
    width: 596px;
    height: 563px;
    background: url("../assets/image/left-box.png") no-repeat;
    background-size: 100% 100%;
    padding: 34px 48px;
    .realtime {
      width: 470px;
      height: 143px;
      justify-content: space-around;
    }
  }
  .center {
    height: 620px;
  }
  .right-another {
    background: url("../assets/image/right-another.png") no-repeat;
    background-size: 100% 100%;
    width: 378px;
    height: 29px;
    margin-right: 17px;
  }
  .right {
    width: 596px;
    height: 563px;
    background: url("../assets/image/right-box.png") no-repeat;
    background-size: 100% 100%;
    padding: 34px 48px;
    .city-report {
      width: 100%;
      height: 170px;
      justify-content: space-around;
    }
    .report {
    }
  }
  .sub-title {
    background: url("../assets/image/sub-title-bg.png") no-repeat;
    background-size: 100% 100%;
    width: 470px;
    height: 34px;
    line-height: 34px;
    font-family: STHeitiJ-Light;
    padding: 0 15px;
  }
}
.bottom-left-bg {
  background: url("../assets/image/bottom-left-bg.png") no-repeat;
  background-size: 100% 100%;
  width: 210px;
  height: 128px;
}
.bottom-item-bg {
  background: url("../assets/image/bottom-item-box.png") no-repeat;
  background-size: 100% 100%;
  width: 421px;
  height: 229px;
  padding: 30px;
  .title {
    font-family: HYa0gj;
    font-size: 24px;
    line-height: 30px;
    color: #fea501;
    text-align: center;
  }
  .content {
    width: 206px;
    font-family: STHeitiJ-Light;
    font-size: 19px;
    line-height: 30px;
    color: #ffffff;
  }
  .bottom-icon-bg {
    background: url("../assets/image/bottom-icon-bg.png") no-repeat;
    background-size: 100% 100%;
    width: 103px;
    height: 103px;
    padding: 30px;
  }
}
.bottom-right-bg {
  background: url("../assets/image/bottom-right-bg.png") no-repeat;
  background-size: 100% 100%;
  width: 210px;
  height: 128px;
}
.inline {
  display: flex;
}
.x-flex-center {
  justify-content: center;
}
.y-flex-center {
  align-items: center;
}
</style>
