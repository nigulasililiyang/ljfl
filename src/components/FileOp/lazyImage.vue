<template>
    <div class="demo-image__lazy">
      <el-image v-for="file in fileList" :key="file.url" :src="file.url" lazy>
          <div slot="error">
              <el-image :src="require('@/assets/404_images/404.png')" />
          </div>
      </el-image>
    </div>
</template>
<script>
import { getFileList } from "@/api/fileop";
  export default {
    props: {
      /* 文件列表 */
      attachmentIds: {
        type: String
      }
    },
    data() {
      return {

          fileIds:this.attachmentIds,

        fileList: [
        ]
      }
    },
    created() {
        if(this.fileIds != undefined && this.fileIds.length > 0){
        getFileList(this.fileIds).then(response =>{
            this.fileList = response.data;
            for(let i = 0; i < this.fileList.length;i++){
              this.fileList[i].url = process.env.VUE_APP_BASE_API + this.fileList[i].url;
            }
        });
        }
    },
  }
</script>