import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// 查询提供给组织机构的菜单
export function deptTreeselect() {
  return request({
    url: '/system/menu/treeselect?menuGroup=2',
    method: 'get'
  })
}

// 查询提供给设备的菜单
export function deviceTemplateTreeselect() {
  return request({
    url: '/system/menu/treeselect?menuGroup=3',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 根据设备模板ID查询菜单下拉树结构
export function deviceTemplateMenuTreeselect(deviceTemplateId) {
  return request({
    url: '/system/menu/deviceTemplateMenuTreeselect/' + deviceTemplateId,
    method: 'get'
  })
}

// 根据组织机构ID查询菜单下拉树结构
export function deptMenuTreeselect(deptId) {
  return request({
    url: '/system/menu/deptMenuTreeselect/' + deptId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'delete'
  })
}

//查询父（一级）菜单列表
export function parentListMenu(query) {
  return request({
    url: 'system/menu/parentlist',
    method: 'get',
    params: query
  })
}
//获取系统子菜单
export function subListMenu(parentId) {
  return request({
    url: '/system/menu/sublist/'+parentId,
    method: 'get',
  })
}
//获取设备对应的路由列表
export function listDeviceRouters(deviceTemplateId) {
  return request({
    url: 'system/menu/getDeviceRoutersByTemplateId/'+deviceTemplateId,
    method: 'get',
  })
}
//获取节点对应的路由列表
export function listDeptRouters(deptId,query) {
  return request({
    url: '/system/menu/getDeptRoutersById/'+deptId,
    method: 'get',
    params: query
  })
}