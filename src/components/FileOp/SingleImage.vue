<template>
    <el-image :src="url" :style="{height:height,width:width}" lazy>
        <div slot="error">
            <el-image :src="require('@/assets/404_images/404.png')" :style="{height:height,width:width}" lazy/>
        </div>
    </el-image>
</template>
<script>
import { getFileList } from "@/api/fileop";
  export default {
    name:"SingleImage",
    props: {
      /* 图片url */
      url: {
        type: String
      },
      height:{
        type:String,
        default:'100%'
      },
      width:{
        type:String,
        default:'100%'
      }
    },
    data() {
      return {

      }
    },
    created() {
    },
  }
</script>