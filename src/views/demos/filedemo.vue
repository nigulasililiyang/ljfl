<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          图片上传示例
        </h1>
        <div>
            <file-op :attachmentIds="picAttachmentId" fileType="picture"></file-op>
        </div>        
      </el-col>
        <el-col :span="12">
            <h1 class="text-jumbo text-ginormous">
            文件上传示例
            </h1>
            <div>
                <file-op :attachmentIds="fileAttachmentId" fileType="file"></file-op>
            </div>        
      </el-col>
        <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          图片懒加载示例
        </h1>
        <div>
            <lazy-image :attachmentIds="picAttachmentId"></lazy-image>
        </div>        
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import FileOp from '../../components/FileOp';
  import LazyImage from '../../components/FileOp/lazyImage.vue';

export default {
    components: {
      FileOp,
      LazyImage
    },
  data() {
    return {
      picAttachmentId:'1,2,3,4,5',
      fileAttachmentId:'1,2,3,4,5,15,16,17',
    }
  },
  methods: {

  }
}
</script>
