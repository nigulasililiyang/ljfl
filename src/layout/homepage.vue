<template>
  <component :is="outletView" v-if="outletView"></component>
</template>
<script>
import { firstComponetnPath } from "@/api/system/user";
export default {
  data() {
    return {
      outletView: undefined
    };
  },
  created() {
    firstComponetnPath().then(res => {
        if(res.code==200){
            let path=res.data.componentPath;
            if(path){
                 this.outletView = () => import(`@/views/${path}`);
            }
            else{
                this.outletView=() => import(`@/views/error/404`);
            }
           
        }
    });
  }
};
</script>