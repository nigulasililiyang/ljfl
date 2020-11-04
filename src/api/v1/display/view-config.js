import request from '@/utils/request'

// 查询一些特殊显示页面的配置，比如组态图列表
export function listViewConfig(query) {
  return request({
    url: '/v1/display/view-config/list',
    method: 'get',
    params: query
  })
}

// 查询一些特殊显示页面的配置，比如组态图详细
export function getViewConfig(viewConfigId) {
  return request({
    url: '/v1/display/view-config/' + viewConfigId,
    method: 'get'
  })
}

// 新增一些特殊显示页面的配置，比如组态图
export function addViewConfig(data) {
  return request({
    url: '/v1/display/view-config',
    method: 'post',
    data: data
  })
}

// 修改一些特殊显示页面的配置，比如组态图
export function updateViewConfig(data) {
  return request({
    url: '/v1/display/view-config',
    method: 'put',
    data: data
  })
}

// 删除一些特殊显示页面的配置，比如组态图
export function delViewConfig(viewConfigId) {
  return request({
    url: '/v1/display/view-config/' + viewConfigId,
    method: 'delete'
  })
}

// 导出一些特殊显示页面的配置，比如组态图
export function exportViewConfig(query) {
  return request({
    url: '/v1/display/view-config/export',
    method: 'get',
    params: query
  })
}