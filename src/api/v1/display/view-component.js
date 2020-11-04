import request from '@/utils/request'

// 查询组态页面组件配置列表
export function listViewComponent(query) {
  return request({
    url: '/v1/display/view-component/list',
    method: 'get',
    params: query
  })
}

// 查询组态页面组件配置详细
export function getViewComponent(viewComponentId) {
  return request({
    url: '/v1/display/view-component/' + viewComponentId,
    method: 'get'
  })
}
export function selectPumpPointTemplates(deviceTemplateId) {
  return request({
    url: '/v1/display/view-component/pump/templates/'+deviceTemplateId,
    method: 'get'
  })
}

// 新增组态页面组件配置
export function addViewComponent(data) {
  return request({
    url: '/v1/display/view-component',
    method: 'post',
    data: data
  })
}

// 修改组态页面组件配置
export function updateViewComponent(data) {
  return request({
    url: '/v1/display/view-component',
    method: 'put',
    data: data
  })
}

// 删除组态页面组件配置
export function delViewComponent(viewComponentId) {
  return request({
    url: '/v1/display/view-component/' + viewComponentId,
    method: 'delete'
  })
}

// 导出组态页面组件配置
export function exportViewComponent(query) {
  return request({
    url: '/v1/display/view-component/export',
    method: 'get',
    params: query
  })
}