import request from '@/utils/request'

// 查询设备型号列表
export function listDevicemodel(query) {
  return request({
    url: '/system/devicemodel/list',
    method: 'get',
    params: query
  })
}

// 查询设备型号详细
export function getDevicemodel(deviceModelId) {
  return request({
    url: '/system/devicemodel/' + deviceModelId,
    method: 'get'
  })
}

// 新增设备型号
export function addDevicemodel(data) {
  return request({
    url: '/system/devicemodel',
    method: 'post',
    data: data
  })
}

// 修改设备型号
export function updateDevicemodel(data) {
  return request({
    url: '/system/devicemodel',
    method: 'put',
    data: data
  })
}

// 删除设备型号
export function delDevicemodel(deviceModelId) {
  return request({
    url: '/system/devicemodel/' + deviceModelId,
    method: 'delete'
  })
}

// 导出设备型号
export function exportDevicemodel(query) {
  return request({
    url: '/system/devicemodel/export',
    method: 'get',
    params: query
  })
}