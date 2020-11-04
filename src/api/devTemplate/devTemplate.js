import request from '@/utils/request'

// 查询设备模板列表
export function listDevTemplate(query) {
  return request({
    url: '/v1/template-config/device-templates',
    method: 'get',
    params: query
  })
}

// 查询设备模板详细
export function getDevTemplate(deviceTemplateId) {
  return request({
    url: '/v1/template-config/device-templates/' + deviceTemplateId,
    method: 'get'
  })
}

// 新增设备模板
export function addDevTemplate(data) {
  return request({
    url: '/v1/template-config/device-templates',
    method: 'post',
    data: data
  })
}

// 修改设备模板
export function updateDevTemplate(data) {
  return request({
    url: '/v1/template-config/device-templates',
    method: 'put',
    data: data
  })
}

// 删除设备模板
export function delDevTemplate(deviceTemplateId) {
  return request({
    url: '/v1/template-config/device-templates?deviceTemplateId=' + deviceTemplateId,
    method: 'delete'
  })
}

// 导出设备模板
export function exportDevTemplate(query) {
  return request({
    url: '/v1/template-config/device-templates/export',
    method: 'get',
    params: query
  })
}

// 修改设备模板菜单
export function updateDeviceTemplateMenu(data) {
  return request({
    url: '/v1/template-config/device-templates/updateMenu',
    method: 'put',
    data: data
  })
}
