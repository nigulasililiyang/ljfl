<template>
  <device-oss :objectId=id />
</template>

<script>
import DeviceOss from '../../../../components/FileOp/DeviceOss';

export default {
  components:{
    DeviceOss
  },
  props: {
    id: {
      type: Number
    }
  },
  data() {
    return {
    };
  },
  created() {

  },
  methods: {
  }
};
</script>