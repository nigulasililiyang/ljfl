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
            <Radar />
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
                优
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
                  4.9
                </p>
                <p style="font-size: 18px; margin: 0">总体评分</p>
              </div>
              <div>
                <p style="font-size: 19px; line-height: 30px; margin: 0">
                  12:56:12 星期三
                </p>
                <p style="font-size: 16px; line-height: 30px; margin: 0">
                  分类建议：四分类
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
      rules: {
        field102: [
          {
            required: true,
            message: "当前数据",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    changeLevel(val){
       sessionStorage.setItem('properties',JSON.stringify(val) )
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
