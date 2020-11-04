import Cookies from 'js-cookie'

const state = {
  // sidebar: {
  //   opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
  //   withoutAnimation: false
  // },
  sidebar:{opened:true,withoutAnimation: false},
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  subMenu:{have:false,withoutAnimation: false},
  topbar: {
    opened: Cookies.get('topbarStatus') ? !!+Cookies.get('topbarStatus') : true,
    withoutAnimation: true
  },
  nodeSelected:{opened:true,withoutAnimation: false},
}

const mutations = {
  HAVE_SUBMENU:(state, withoutAnimation) => {
    state.subMenu.have = true
    state.subMenu.withoutAnimation = withoutAnimation
  },
  HAVE_NO_SUBMENU:(state, withoutAnimation) => {
    state.subMenu.have = false
    state.subMenu.withoutAnimation = withoutAnimation
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  TOGGLE_TOPBAR: state => {
    state.topbar.opened = !state.topbar.opened
    state.topbar.withoutAnimation = false
    if (state.topbar.opened) {
      Cookies.set('topbarStatus', 1)
    } else {
      Cookies.set('topbarStatus', 0)
    }
  },
  TOGGLE_NODE_SELECTED: state => {
    state.nodeSelected.opened = !state.nodeSelected.opened
    state.nodeSelected.withoutAnimation = false
    if (state.nodeSelected.opened) {
      Cookies.set('nodeSelectedStatus', 1)
    } else {
      Cookies.set('nodeSelectedStatus', 0)
    }
  },
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  showSubMenu({ commit }){
    commit('HAVE_SUBMENU')
  },
  hiddenSubMenu({ commit }){
    commit('HAVE_NO_SUBMENU')
  },
  toogleTopBar({ commit }){
    commit('TOGGLE_TOPBAR')
  },
  toggleNodeSelected({ commit }) {
    commit('TOGGLE_NODE_SELECTED')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
