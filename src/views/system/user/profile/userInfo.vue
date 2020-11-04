<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="100px">
    <el-form-item label="用户昵称" prop="nickName">
      <el-input v-model="user.nickName" />
    </el-form-item> 
    <el-form-item label="手机号码" prop="phonenumber">
      <el-input v-model="user.phonenumber" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
        <el-radio label="2">未知</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="接收渠道">
                        <el-checkbox-group v-model="channels">
                          <el-checkbox
                            v-for="dict in channelsOptions"
                            :key="dict.dictValue"
                            :label="dict.dictLabel"
                          >{{dict.dictLabel}}</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from "@/api/system/user";

export default {
  props: ['user'],

 watch: {
            user: function(userData){
                this.msgChannelFormat(userData.msgChannel);
            }
        },
  data() {
    return {
      channels:[],
      //发送渠道数据字典
      channelsOptions: [],
      // 表单校验
      rules: {
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        // email: [
        //   { required: true, message: "邮箱地址不能为空", trigger: "blur" },
        //   {
        //     type: "email",
        //     message: "'请输入正确的邮箱地址",
        //     trigger: ["blur", "change"]
        //   }
        // ],
        // phonenumber: [
        //   { required: true, message: "手机号码不能为空", trigger: "blur" },
        //   {
        //     pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        //     message: "请输入正确的手机号码",
        //     trigger: "blur"
        //   }
        // ]
      }
    };
  },
  created(){
    this.getDicts("sys_send_channels").then(response => {
      var data = response.data;
      this.channelsOptions = [];
      data.forEach(element => {
        var dic = {
          dictLabel: element.dictLabel,
          dictValue: Number.parseInt(element.dictValue)
        };
        this.channelsOptions.push(dic);
      });      
    });
  },
  methods: {
    /**
     * 将消息渠道转换成数组
     */
    msgChannelFormat(val){
        this.channels = [];
        for(let index = 0; index < this.channelsOptions.length; index++){
          if((val & this.channelsOptions[index].dictValue)){
              this.channels.push(this.channelsOptions[index].dictLabel);
          }
        }        
    },
    convertCheckToMsgChannel(){
        let tmpVal = 0;
        for(let i = 0; i < this.channels.length; i++){
          for(let j = 0; j < this.channelsOptions.length; j++){
            if(this.channels[i] == this.channelsOptions[j].dictLabel){
              tmpVal |= this.channelsOptions[j].dictValue;
            }
          }
        }
        return tmpVal;
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.user.msgChannel = this.convertCheckToMsgChannel();
          updateUserProfile(this.user).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    }
  }
};
</script>
