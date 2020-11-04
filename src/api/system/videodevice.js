import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listVideoDevice(query) {
  return request({
    url: '/system/videodevice/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getVideoDevice(videoDeviceId) {
  return request({
    url: '/system/videodevice/' + videoDeviceId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addVideoDevice(data) {
  return request({
    url: '/system/videodevice',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateVideoDevice(data) {
  return request({
    url: '/system/videodevice',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delVideoDevice(videoDeviceId) {
  return request({
    url: '/system/videodevice/' + videoDeviceId,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportVideoDevice(query) {
  return request({
    url: '/system/videodevice/export',
    method: 'get',
    params: query
  })
}

// 门禁设备解绑
export function deBVideoDevice(options) {
  return request({
    url: '/system/videodevice/deBVideoDevice',
    method: 'post',
    data: options
  })
}

// 门禁设备绑定
export function bindVideoDevice(options) {
  return request({
    url: '/system/videodevice/bindVideoDevice',
    method: 'post',
    data: options
  })
}
