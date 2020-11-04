import request from '@/utils/request'

// 查询门禁设备列表
export function listAccessDevice(query) {
  return request({
    url: '/accessController/sysAccessDevice/list',
    method: 'get',
    params: query
  })
}

// 查询门禁设备详细
export function getAccessDevice(accessDeviceId) {
  return request({
    url: '/accessController/sysAccessDevice/' + accessDeviceId,
    method: 'get'
  })
}

// 查询门禁设备详细
export function getAccessDeviceSn(serialNumber) {
  return request({
    url: '/accessController/sysAccessDevice/sn/' + serialNumber,
    method: 'get'
  })
}

// 新增门禁设备
export function addAccessDevice(data) {
  return request({
    url: '/accessController/sysAccessDevice',
    method: 'post',
    data: data
  })
}

// 修改门禁设备
export function updateAccessDevice(data) {
  return request({
    url: '/accessController/sysAccessDevice',
    method: 'put',
    data: data
  })
}

// 删除门禁设备
export function delAccessDevice(accessDeviceId) {
  return request({
    url: '/accessController/sysAccessDevice/' + accessDeviceId,
    method: 'delete'
  })
}

// 导出门禁设备
export function exportAccessDevice(query) {
  return request({
    url: '/accessController/sysAccessDevice/export',
    method: 'get',
    params: query
  })
}

// 门禁设备参数获取
export function getOptions(options) {
  return request({
    url: '/accessController/sysAccessDevice/getOptions',
    method: 'post',
    data: options
  })
}

// 门禁设备参数获取
export function setServer(options) {
  return request({
    url: '/accessController/sysAccessDevice/setServer',
    method: 'post',
    data: options
  })
}

// 门禁设备解绑
export function deBAccessDevice(options) {
  return request({
    url: '/accessController/sysAccessDevice/deBAccessDevice',
    method: 'post',
    data: options
  })
}

// 门禁设备绑定
export function bindAccessDevice(options) {
  return request({
    url: '/accessController/sysAccessDevice/bindAccessDevice',
    method: 'post',
    data: options
  })
}
