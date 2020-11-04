import request from '@/utils/request'

// 查询设备模板参数列表
export function listDeviceTemplateParams(query) {
  return request({
    url: '/v1/template-config/deviceTemplateParams/list',
    method: 'get',
    params: query
  })
}

// 查询设备模板参数详细
export function getDeviceTemplateParams(deviceTemplateParamsId) {
  return request({
    url: '/v1/template-config/deviceTemplateParams/' + deviceTemplateParamsId,
    method: 'get'
  })
}

// 新增设备模板参数
export function addDeviceTemplateParams(data) {
  return request({
    url: '/v1/template-config/deviceTemplateParams',
    method: 'post',
    data: data
  })
}

// 修改设备模板参数
export function updateDeviceTemplateParams(data) {
  return request({
    url: '/v1/template-config/deviceTemplateParams',
    method: 'put',
    data: data
  })
}

// 删除设备模板参数
export function delDeviceTemplateParams(deviceTemplateParamsId) {
  return request({
    url: '/v1/template-config/deviceTemplateParams/' + deviceTemplateParamsId,
    method: 'delete'
  })
}

// 导出设备模板参数
export function exportDeviceTemplateParams(query) {
  return request({
    url: '/v1/template-config/deviceTemplateParams/export',
    method: 'get',
    params: query
  })
}