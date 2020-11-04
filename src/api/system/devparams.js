import request from '@/utils/request'

// 查询设备型号参数列表
export function listDevparams(query) {
  return request({
    url: '/system/devparams/list',
    method: 'get',
    params: query
  })
}

// 查询设备型号参数详细
export function getDevparams(deviceModelParamsId) {
  return request({
    url: '/system/devparams/' + deviceModelParamsId,
    method: 'get'
  })
}

// 新增设备型号参数
export function addDevparams(data) {
  return request({
    url: '/system/devparams',
    method: 'post',
    data: data
  })
}

// 修改设备型号参数
export function updateDevparams(data) {
  return request({
    url: '/system/devparams',
    method: 'put',
    data: data
  })
}

// 删除设备型号参数
export function delDevparams(deviceModelParamsId) {
  return request({
    url: '/system/devparams/' + deviceModelParamsId,
    method: 'delete'
  })
}

// 导出设备型号参数
export function exportDevparams(query) {
  return request({
    url: '/system/devparams/export',
    method: 'get',
    params: query
  })
}