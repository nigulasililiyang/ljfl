<template>
  <div>
    <el-upload 
      ref="upload"
      class="upload-demo"
      :action="uploadImgUrl"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="uploadSuccess"
      :show-file-list="true" 
      :file-list="fileList"
      :accept='fileAccept'
      name="file"
      :headers="headers"
      :list-type="listType"
      >
          
        <i v-if="showCross" class="el-icon-plus"></i>
   
        <el-button v-else>上传</el-button>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible"  :append-to-body='true'>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { getFileList } from "@/api/fileop";
  export default {
    props: {
      /* 文件列表 */
      attachmentIds: {
        type: String
      },
      /*上传类型 */
      fileType: {
        type:String,
        default:'picture'
      }
    },
    watch:{
      // 如果图片初始值变为空
      attachmentIds(val){
        if(val=="" || val == undefined){
          this.$refs.upload.clearFiles();
          this.fileIds = "";
        }
        else{
          this.fileIds=val;
          getFileList(this.fileIds).then(response =>{
              this.fileList = response.data;
              for(var index in this.fileList){
                this.fileList[index].name = this.fileList[index].fileName;
                this.fileList[index].url = process.env.VUE_APP_BASE_API +this.fileList[index].url
            }
          });
        }
      }
    },
    data() {

      return {
        fileIds:this.attachmentIds,

        fileList: [],
        
        uploadImgUrl: process.env.VUE_APP_BASE_API + "/system/oss/upload", // 上传的图片服务器地址

        headers: {
          Authorization: 'Bearer ' + getToken()
        },

        dialogImageUrl: '',
        
        dialogVisible: false,
        listType : 'picture-card',
        fileAccept : '.jpg,.jpeg,.png,.gif',
        showCross:true

      };

    },
  created() {
    if(this.fileIds != undefined && this.fileIds.length > 0){
      getFileList(this.fileIds).then(response =>{
          this.fileList = response.data;
          for(var index in this.fileList){
            this.fileList[index].name = this.fileList[index].fileName;
            this.fileList[index].url = process.env.VUE_APP_BASE_API +this.fileList[index].url
        }
      });
    }
    if(this.fileType != undefined && this.fileType == 'file'){
      this.listType = "text";
      this.fileAccept = "*.*";    
      this.showCross = false;
      }
  },
    methods: {
      handleRemove(file, fileList) {

        this.fileIds = "";
        for(var index in fileList){
            if(fileList[index].id != undefined && fileList[index].id != null){
                if(this.fileIds.length > 0) this.fileIds += ",";
                this.fileIds += fileList[index].id;
            }
        }
        this.$store.dispatch('SetPictureId',this.fileIds);
        this.$emit("imgIds",this.fileIds);
      },

      uploadSuccess(res, file) {
        if(file.response.code == 200){
          file.id = res.id;
          file.name = res.fileName;
         // this.fileIds = res.id;
          if(this.fileIds != null && this.fileIds.length != undefined && this.fileIds.length > 0) this.fileIds += ",";
          if(this.fileIds == undefined)  this.fileIds = "";
          this.fileIds += String(res.id); 
          this.$store.dispatch('SetPictureId',this.fileIds);
        }
        this.$emit("imgIds",this.fileIds);
      },
      handlePreview(file) {
        this.dialogImageUrl = process.env.VUE_APP_BASE_API + file.url;
        this.dialogVisible = true;

      }
    }

  }

</script>