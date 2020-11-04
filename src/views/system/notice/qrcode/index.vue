<template>
    <div class="app-container">
        <template v-if="url != undefined">
            <el-image
            style="width: 300px; height: 300px"
            :src="url"
            :fit="fit"
            :class="{notdisplay: hasbind==true}"></el-image>
        </template>

        <el-button type="danger" @click="unbind" :class="{notdisplay: hasbind==false}">解除绑定</el-button>
    </div>
</template>
<script>
import {getQRCode, unbind} from '../../../../api/qrcode/qrcode';
export default {
  data() {
    return {
        url: undefined,
        hasbind: false,
        fit: 'fill'
    }
  },
  created(){
      this.getQRCode();
  },
  computed:{
  },
  methods: {
    getQRCode(){
        getQRCode().then(response=>{
            if(this.success(response)){
                this.url = response.data.data;
                if(response.data.openid!=undefined){
                    this.hasbind = true;
                }else{
                    this.hasbind = false;
                }
            }
        });
    },
    unbind(){
        this.$confirm('是否确认解除绑定?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=> {
            unbind().then(response =>{
                if(this.success(response)){
                    this.msgSuccess("解绑成功！");
                    this.getQRCode();
                }
            });
        }).catch(function() {});
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
<style lang="scss" scoped>
  .notdisplay{
    display: none;
  }
</style>