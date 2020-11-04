import request from '@/utils/request'

// 查询告警基础，主要用于存放告警名称列表
export function listAlarmbases(query) {
  return request({
    url: '/v1/alarm-management/alarm-bases',
    method: 'get',
    params: query
  })
}

// 查询告警基础，主要用于存放告警名称详细
export function getAlarmbases(alarmBaseId) {
  return request({
    url: '/v1/alarm-management/alarm-bases/' + alarmBaseId,
    method: 'get'
  })
}

// 新增告警基础，主要用于存放告警名称
export function addAlarmbases(data) {
  return request({
    url: '/v1/alarm-management/alarm-bases',
    method: 'post',
    data: data
  })
}

// 修改告警基础，主要用于存放告警名称
export function updateAlarmbases(data) {
  return request({
    url: '/v1/alarm-management/alarm-bases',
    method: 'put',
    data: data
  })
}

// 删除告警基础，主要用于存放告警名称
export function delAlarmbases(alarmBaseId) {
  return request({
    url: '/v1/alarm-management/alarm-bases/' + alarmBaseId,
    method: 'delete'
  })
}

// 获取设备的告警列表
export function getDeviceAlarmBase(deviceId) {
  return request({
    url: '/v1/alarm-management/alarmAnalyze/devicealarmbase/' + deviceId,
    method: 'get'
  })
}
