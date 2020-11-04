import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts,getUsers,getprojects} from "@/api/system/dict/data";
import { getPointTemplate ,selectDeviceTemplate} from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, download } from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import BaiduMap from 'vue-baidu-map'
//自定义notify
// import message from "@/components/myMsg/index"

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: '23D8LIxYOEDxA7WVVdtsnG6AjAPPePrp'
})
// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getprojects = getprojects
Vue.prototype.getUsers = getUsers
Vue.prototype.selectDeviceTemplate = selectDeviceTemplate
Vue.prototype.getPointTemplate = getPointTemplate
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.download = download

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(permission)
Vue.use(require('vue-moment'));

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

// Vue.use(message.register);

Element.Dialog.props.closeOnClickModal.default = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
