import request from '@/utils/request'

// 查询各个组件数据显示相关的设置列表
export function listDisplaySet(query) {
  return request({
    url: '/v1/display/display-set/list',
    method: 'get',
    params: query
  })
}
// 查询组件（页面）的列表集合-带详细内容
export function listDetailDisplaySet(query) {
  return request({
    url: '/v1/display/display-set/listdetail',
    method: 'get',
    params: query
  })
}
// 查询各个组件数据显示相关的设置详细
export function getDisplaySet(displaySetId) {
  return request({
    url: '/v1/display/display-set/' + displaySetId,
    method: 'get'
  })
}

// 新增各个组件数据显示相关的设置
export function addDisplaySet(data) {
  return request({
    url: '/v1/display/display-set',
    method: 'post',
    data: data
  })
}

// 修改各个组件数据显示相关的设置
export function updateDisplaySet(data) {
  return request({
    url: '/v1/display/display-set',
    method: 'put',
    data: data
  })
}

// 删除各个组件数据显示相关的设置
export function delDisplaySet(displaySetId) {
  return request({
    url: '/v1/display/display-set/' + displaySetId,
    method: 'delete'
  })
}

// 导出各个组件数据显示相关的设置
export function exportDisplaySet(query) {
  return request({
    url: '/v1/display/display-set/export',
    method: 'get',
    params: query
  })
}