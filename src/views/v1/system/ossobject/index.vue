<template>
  <div>
    <el-page-header @back="goBack" v-if="objectId!=0">
      <template slot="title">
        <span>返回</span>
      </template>
      <template slot="content">
        <span>文件管理页面</span>
      </template>
    </el-page-header>
    <oss-object
          :objectTableName="objectTableName"
          :objectId="objectId"
          :isViewOnly="isViewOnly"
        />
  </div>
</template>

<script>
import OssObject from "../../../../components/FileOp/OssObject";

export default {
  components: {
    OssObject
  },
  data() {
    return {
      objectTableName: "deviceTemplate",
      objectId: 0,
      isViewOnly: 0
    };
  },
  created() {
    if (this.$route.params && this.$route.params.objectTableName) {
      this.objectTableName = this.$route.params.objectTableName;
    }
    if (this.$route.params && this.$route.params.objectId) {
      this.objectId = Number(this.$route.params.objectId);
    }
    if (this.$route.params && this.$route.params.isViewOnly) {
      this.isViewOnly = Number(this.$route.params.isViewOnly);
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
  }
};
</script>