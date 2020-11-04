import request from '@/utils/request'

// 查询数据展示时所需要的点位模板列表
export function listDisplayPointTemplate(query) {
  return request({
    url: '/v1/display/display-point-template/list',
    method: 'get',
    params: query
  })
}

// 查询数据展示时所需要的点位模板详细
export function getDisplayPointTemplate(displayPointTemplateId) {
  return request({
    url: '/v1/display/display-point-template/' + displayPointTemplateId,
    method: 'get'
  })
}

// 新增数据展示时所需要的点位模板
export function addDisplayPointTemplate(data) {
  return request({
    url: '/v1/display/display-point-template',
    method: 'post',
    data: data
  })
}

// 修改数据展示时所需要的点位模板
export function updateDisplayPointTemplate(data) {
  return request({
    url: '/v1/display/display-point-template',
    method: 'put',
    data: data
  })
}

// 删除数据展示时所需要的点位模板
export function delDisplayPointTemplate(displayPointTemplateId) {
  return request({
    url: '/v1/display/display-point-template/' + displayPointTemplateId,
    method: 'delete'
  })
}

// 导出数据展示时所需要的点位模板
export function exportDisplayPointTemplate(query) {
  return request({
    url: '/v1/display/display-point-template/export',
    method: 'get',
    params: query
  })
}
// 更新模板顺序
export function updateSort(data) {
  return request({
    url: '/v1/display/display-point-template/updateSort',
    method: 'post',
    data: data
  })
}