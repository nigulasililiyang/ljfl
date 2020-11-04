<template>
    <div class="app-container">
        <el-row></el-row>
        <el-tabs type="border-card">
            <el-tab-pane label="备案号配置">
                <el-form ref="recordnoform" :model="recordnoform" label-width="140px">
                    <el-form-item label="备案号">
                        <el-input v-model="recordnoform.recordNo" placeholder="请输入备案号"></el-input>
                    </el-form-item>
                    <el-form-item label="时间">
                        <el-input v-model="recordnoform.recordTime" placeholder="请输入时间"></el-input>
                    </el-form-item>
                    <el-form-item label="链接地址">
                        <el-input v-model="recordnoform.recordUrl" placeholder="请输入链接地址"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit()"
                        >保存</el-button>
                        <el-button type="danger" @click="onDelete()"
                        >重置</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { selectRecordInfoConfigByKeysAuth,saveRecordConfigByKeys,resetConfigByKeys } from '../../../api/system/config';
export default {
  data() {
    return {
        recordnoform: {}
    }
  },
  created(){
      this.selectRecordInfoConfigByKeysAuth();
  },
  computed:{
  },
  methods: {
    selectRecordInfoConfigByKeysAuth(){
        selectRecordInfoConfigByKeysAuth().then(response=>{
            if(this.success(response)){
                this.recordnoform = response.data;
            }
        });
    },
    onSubmit() {
        saveRecordConfigByKeys(this.recordnoform).then(response=>{
            if(this.success(response)){
                this.msgSuccess('保存成功！');
                this.getMailSmsWechatConfigByKeys();
            }
        });
    },
    onDelete() {
        this.$confirm('重置会清空当前配置,是否确认重置配置?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=> {
            let params = this.recordnoform;
            resetConfigByKeys(params).then(response=>{
                if(this.success(response)){
                    this.msgSuccess('重置成功！');
                    this.selectRecordInfoConfigByKeysAuth();
                }
            });
        }).catch(function(e) {console.log(e)});
    },
    success(response) {
        if(response.code == 200){
            return true;
        }else{
            this.$message({
            showClose: true,
            message: reponse.msg,
            type: "error"
            });
            return false;
        }
    }
  }
}
</script>