import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import event from './modules/event'
import getters from './getters'
import menu from './modules/menu';
import maintain from './modules/maintain';
import chinaMap from './modules/chinaMap';
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings,
    event,
    menu,
    maintain,
    chinaMap
  },
  getters,

 
})

export default store
