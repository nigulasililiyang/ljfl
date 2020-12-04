<template>
  <div>
    <el-row class="row">
      <el-col
        :span="8"
        class="inline x-flex-center"
        v-show="properties.level != 'country'"
      >
        <div class="item">
          <div class="inline x-flex-center y-flex-center">
            <div class="left-right-title">实时数据</div>
            <div class="left-another"></div>
          </div>
          <div class="left">
            <div class="sub-title">当前数据:</div>
            <div class="inline realtime y-flex-center x-flex-space-around">
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
                  <p>{{ data.value }} {{data.unit}}</p>
                </div>
              </div>
            </div>
            <div class="sub-title">各类指标得分情况:</div>
            <Radar :areaTag.sync="queryForm.areaTag"/>
          </div>
        </div>
      </el-col>
      <el-col
        :span="
          properties.level != 'country' ? 8 : 24
        "
        class="inline x-flex-center"
      >
        <div class="center">
          <china-map
            :width="
              properties.level != 'country'
                ? '625px'
                : '1920px'
            "
            :height="
              properties.level != 'country'
                ? '526px'
                : '924px'
            "
            :color.sync="areaColor"
            :recordTime="areaInfo.record_time"
            @changeLevel="changeLevel"
          />
        </div>
      </el-col>
      <el-col :span="8" class="inline x-flex-center" v-show="properties.level != 'country'">
        <div class="item">
          <div class="inline x-flex-center y-flex-center">
            <div class="right-another"></div>
            <div class="left-right-title">综合报告</div>
          </div>
          <div class="right">
            <div class="sub-title">当前城市报告</div>
            <div class="city-report inline y-flex-center x-flex-space-around">
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
                {{ areaInfo.score_grade_name }}
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
                  {{ areaInfo.total_score }}
                </p>
                <p style="font-size: 18px; margin: 0">总体评分</p>
              </div>
              <div>
                <p style="font-size: 19px; line-height: 30px; margin: 0">
                  12:56:12 星期三
                </p>
                <p style="font-size: 16px; line-height: 30px; margin: 0">
                  分类建议：{{ areaInfo.classify_name }}
                </p>
                <p style="font-size: 31px; margin: 0">{{ areaFullName }}</p>
              </div>
            </div>
            <div class="sub-title">报告</div>
            <div class="report inline y-flex-center x-flex-center">
              <el-table
                :data="quotaRates"
                height="258px"
                size="mini"
                :row-style="handleRow"
                :header-cell-style="headerCellStyle"
                :cell-style="cellStyle"
                cell-class-name="cellbox"
              >
                <el-table-column
                  label="类目"
                  prop="quota_rate_name"
                  align="center"
                  width="150px"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="得分"
                  prop="score"
                  align="center"
                  width="50px"
                />
                <el-table-column
                  label="权重"
                  prop="quota_weight"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div style="color: #37d7ff">
                      {{ Number(scope.row.quota_weight).toFixed(4) }}
                    </div></template
                  >
                </el-table-column>
                <el-table-column label="加权得分" align="center">
                  <template slot-scope="scope">
                    {{
                      Number(scope.row.score * scope.row.quota_weight).toFixed(
                        4
                      )
                    }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-show="properties.level != 'country'">
      <el-row
        v-if="areaInfo.is_need_suggestion == '0'"
        type="flex"
        align="center"
        justify="center"
        ><div style="font-size: 24px; line-height: 204px; letter-spacing: 15px">
          当前城市环卫水平达标，请继续保持。
        </div></el-row
      >
      <div v-else class="inline y-flex-center x-flex-space-around">
        <div
          class="bottom-left-bg"
          @click="lastOne(suggestionList.length)"
        ></div>
        <div style="width: 1263px; overflow: hidden">
          <div
            :class="[
              'inline',
              { 'x-flex-space-around': suggestionList.length < 3 },
            ]"
          >
            <div
              ref="wrape"
              :class="{ 'bottom-item-bg': true }"
              v-for="(suggestion, index) in suggestionList"
              :key="index"
            >
              <div class="title">{{ suggestion.title }}</div>
              <div class="inline y-flex-center x-flex-space-around">
                <div class="bottom-icon-bg">
                  <svg-icon
                    style="
                      font-size: 30px;
                      position: absolute;
                      left: 5px;
                      top: 10px;
                      background: #062969;
                      border-radius: 35px;
                      border: solid 1px;
                    "
                    color="#00e8fd"
                    icon-class="num"
                    class="el-input__icon input-icon"
                  />{{ index + 1 }}
                </div>
                <el-tooltip placement="right" effect="light">
                  <template slot="content"
                    ><div style="width: 200px; font-size: 19px; color: #000000">
                      {{ suggestion.content }}
                    </div></template
                  >
                  <div class="content">
                    {{ suggestion.content }}
                  </div></el-tooltip
                >
              </div>
            </div>
          </div>
        </div>
        <div
          class="bottom-right-bg"
          @click="nextOne(suggestionList.length)"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import Radar from "@/components/charts/radar/index";
import ChinaMap from "@/components/charts/map/ChinaMap.vue";
import {
  listQuotaRates,
  listQuotaGroups,
  getAreaInfo,
  listQuestions,
  getAreaByName,
} from "@/api/system/quotas";
export default {
  name: "Index",
  components: { Radar, ChinaMap },
  computed: {
    suggestionList() {
      let suggestions = [];
      this.quotaGroups.forEach((ele) => {
        ele.suggestions.forEach((suggestion) => {
          suggestions.push({
            title: ele.quota_group_name,
            content: suggestion.low_score_suggestion,
          });
        });
      });
      return suggestions;
    },
    areaColor(){
      if(this.areaInfo == null || this.areaInfo.classify_name == null){
        return '#2081f7';
      }else if(this.areaInfo.classify_name=='四分法'){
        return 'green';
      }else if(this.areaInfo.classify_name=='三分法'){
        return 'yellow';
      }else if(this.areaInfo.classify_name=='二分法'){
        return 'orangered';
      }else{
        return '#2081f7';
      }
    }
  },
  data() {
    return {
      toLastAnimating: false,
      toNextAnimating: false,
      currentIndex: 0,
      headerCellStyle: {
        background: "#04549c!important",
        height: "34px",
        "line-height": "34px",
        padding: "0px",
      },
      cellStyle: { height: "34px", "line-height": "34px", padding: "5px 0" },
      realtimeData: [
        {
          title: "可回收垃圾",
          value: 45631,
          icon: "recyclable-garbage.png",
          unit: "吨/天"
        },
        {
          title: "厨余垃圾",
          value: 45631,
          icon: "kitchen-garbage.png",
          unit: "吨/天"
        },
        {
          title: "有害垃圾",
          value: 45631,
          icon: "harmful-garbage.png",
          unit: "吨/天"
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
      areaInfo: {
        area_tag: "hangzhou701",
      },
      //区域分组得分情况
      quotaGroups: [],
      //区域指标得分情况
      quotaRates: [],
      //问卷情况
      questions: [],
      //查询参数
      queryForm: {
        areaTag: "",
      },
      //区域名称，只有当前区域名字
      areaName: "hangzhou701",
      //区域全称，省份-城市
      areaFullName: "",
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
      capitalList: [
        { province: "北京", capital: "北京" },
        { province: "上海", capital: "上海" },
        { province: "天津", capital: "天津" },
        { province: "重庆", capital: "重庆" },
        { province: "黑龙江", capital: "哈尔滨" },
        { province: "吉林", capital: "长春" },
        { province: "辽宁", capital: "沈阳" },
        { province: "内蒙古", capital: "呼和浩特" },
        { province: "河北", capital: "石家庄" },
        { province: "新疆", capital: "乌鲁木齐" },
        { province: "甘肃", capital: "兰州" },
        { province: "青海", capital: "西宁" },
        { province: "陕西", capital: "西安" },
        { province: "宁夏", capital: "银川" },
        { province: "河南", capital: "郑州" },
        { province: "山东", capital: "济南" },
        { province: "山西", capital: "太原" },
        { province: "安徽", capital: "合肥" },
        { province: "湖北", capital: "武汉" },
        { province: "湖南", capital: "长沙" },
        { province: "江苏", capital: "南京" },
        { province: "四川", capital: "成都" },
        { province: "贵州", capital: "贵阳" },
        { province: "云南", capital: "昆明" },
        { province: "广西", capital: "南宁" },
        { province: "西藏", capital: "拉萨" },
        { province: "浙江", capital: "杭州" },
        { province: "江西", capital: "南昌" },
        { province: "广东", capital: "广州" },
        { province: "福建", capital: "福州" },
        { province: "台湾", capital: "台北" },
        { province: "海南", capital: "海口" },
        { province: "香港", capital: "香港" },
        { province: "澳门", capital: "澳门" },
      ],
      properties: {
        level: "country",
        adcode: 100000,
        name: "全国",
      },
    };
  },
  created() {
    let params = {
      areaName: "杭州",
    };
    getAreaByName(params).then((response) => {
      if (response.code == 200) {
        this.areaInfo = response.areaInfo;
        console.log(this.areaInfo);
        this.queryForm.areaTag = this.areaInfo.area_tag;
        this.getAreaDetail();
      }
    });
  },
  methods: {
    handleRow({ row, rowIndex }) {
      let present = Number(row.quota_weight).toFixed(4) * 100;
      // console.log(present);
      return {
        background:
          "linear-gradient(to right,#00a0e9 " +
          present +
          "%, transparent " +
          present +
          "%)",
        "background-repeat": "no-repeat",
        "background-size": "100% 5px",
        "background-position-y": "bottom",
      };
    },
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
      });
    },
    /**
     * 根据标签获取问题
     */
    findQuestionByTag(questionTag) {
      let question = null;
      this.questions.forEach((element) => {
        if (element.quota_tag == questionTag) {
          question = element;
        }
      });
      return question;
    },
    /**
     * 根据标签获取指标详情
     */
    findQuotaRateByTag(quotaRateTag) {
      let quotaRate = null;
      this.quotaRates.forEach((element) => {
        if (element.quota_rate_tag == quotaRateTag) {
          quotaRate = element;
        }
      });
      return quotaRate;
    },
    /**
     * 获取省会城市
     */
    findProvinceCapital(province) {
      let provinceCapital = null;
      this.capitalList.forEach((element) => {
        if (element.province == province) {
          provinceCapital = element;
        }
      });
      return provinceCapital;
    },
    getQuotaValue(quota){
      if(quota == null){
        return "";
      }
      if(quota.quota_value == null){
        return "";
      }

      return quota.quota_value;
    },
    //获取区域的详细信息
    getAreaDetail() {
      //获取区域基本信息
      // getAreaInfo(this.queryForm).then(response => {
      //     if(response.code == 200){
      //       this.areaInfo = response.areaInfo;
      //     }
      //   });

      //获取分组得分信息
      listQuotaGroups(this.queryForm).then((response) => {
        if (response.code == 200) {
          this.quotaGroups = response.quotaGroups;
        }
      });

      //获取指标得分详情
      listQuotaRates(this.queryForm).then((response) => {
        if (response.code == 200) {
          this.quotaRates = response.quotaRates;
        }
      });

      //获取问卷详情
      listQuestions(this.queryForm).then((response) => {
        this.realtimeData = [];
        if (response.code == 200) {
          this.questions = response.questions;
          let recoveryGarbage = this.findQuestionByTag("recovery_recovered");
          let recovery = {
            title: "可回收垃圾",
            value: this.getQuotaValue(recoveryGarbage),
            icon: "recyclable-garbage.png",
            unit: recoveryGarbage.quota_unit == null ? "吨/天" : recoveryGarbage.quota_unit
          };
          this.realtimeData.push(recovery);
          let kitchenGarbage = this.findQuestionByTag(
            "real_kitchen_waste_deal"
          );
          let kitchen = {
            title: "厨余垃圾",
            value: this.getQuotaValue(kitchenGarbage),
            icon: "kitchen-garbage.png",
            unit: kitchenGarbage.quota_unit == null ? "吨/天" : kitchenGarbage.quota_unit
          };
          this.realtimeData.push(kitchen);
          let harmfulGarbage = this.findQuestionByTag(
            "real_harmful_waste_deal"
          );
          let harmful = {
            title: "有害垃圾",
            value: this.getQuotaValue(harmfulGarbage),
            icon: "harmful-garbage.png",
            unit: harmfulGarbage.quota_unit == null ? "吨/天" : harmfulGarbage.quota_unit
          };
          this.realtimeData.push(harmful);
        }
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    changeLevel(val) {
      sessionStorage.setItem("properties", JSON.stringify(val));
      this.properties = val;
      //只有两次点击的地区名称不一致时才需要重新加载
      let curAreaName = val.label;
      if (val.level == "province") {
        //如果是省份，默认获取该省的省会城市
        let element = this.findProvinceCapital(val.label);
        if (element != null) {
          curAreaName = element.capital;
          this.areaFullName = curAreaName;
        }
      } else if (val.level == "city") {
        curAreaName = val.label;
        this.areaFullName = curAreaName;
      } else {
        //除了省会和地级市外，其它地区不予处理
        return;
      }
      if (this.areaName != curAreaName) {
        this.areaName = curAreaName;
        let params = {
          areaName: curAreaName,
        };
        console.log("aaaaa===",params);
        getAreaByName(params).then((response) => {
          if (response.code == 200) {
            this.areaInfo = response.areaInfo;
            console.log(this.areaInfo);
            this.queryForm.areaTag = this.areaInfo.area_tag;
            this.getAreaDetail();
          }
        });
      }
    },
    lastOne(totalCount) {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
        this.$refs.wrape.forEach((element, index) => {
          this.$refs.wrape[index].style.transform =
            "translateX(-" + 421 * this.currentIndex + "px)";
        });
      }
    },
    nextOne(totalCount) {
      if (this.currentIndex < totalCount - 3) {
        this.currentIndex += 1;
        this.$refs.wrape.forEach((element, index) => {
          this.$refs.wrape[index].style.transform =
            "translateX(-" + 421 * this.currentIndex + "px)";
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  // background: url("../assets/image/center-box.png") no-repeat;
  // background-size: 100% 100%;
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
    }
    .report {
      width: 470px;
      padding: 0 15px;
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
  transition: transform 0.4s linear;
  background: url("../assets/image/bottom-item-box.png") no-repeat;
  background-size: 100% 100%;
  width: 421px;
  min-width: 421px;
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
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
  .bottom-icon-bg {
    background: url("../assets/image/bottom-icon-bg.png") no-repeat;
    background-size: 100% 100%;
    width: 103px;
    height: 103px;
    font-size: 56px;
    text-align: center;
    line-height: 103px;
    position: relative;
    color: #fea501;
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
.x-flex-space-around {
  justify-content: space-around;
}
.y-flex-center {
  align-items: center;
}
.bottom-left-bg:hover,
.bottom-right-bg:hover {
  transform: scale(1.25);
  cursor: pointer;
}
</style>
<style lang="scss">
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: transparent !important;
}
.cellbox {
  .cell {
    background: #283e7b !important;
  }
}
</style>
