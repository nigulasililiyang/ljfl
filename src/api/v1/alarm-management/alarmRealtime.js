import request from '@/utils/request'

// 查询实时告警列表
export function listAlarmRealtime(query) {
  return request({
    url: '/v1/alarm-management/alarmRealtime/list',
    method: 'get',
    params: query
  })
}

// 查询实时告警详细
export function getAlarmRealtime(alarmRealtimeId) {
  return request({
    url: '/v1/alarm-management/alarmRealtime/' + alarmRealtimeId,
    method: 'get'
  })
}

// 新增实时告警
export function addAlarmRealtime(data) {
  return request({
    url: '/v1/alarm-management/alarmRealtime',
    method: 'post',
    data: data
  })
}

// 修改实时告警
export function updateAlarmRealtime(data) {
  return request({
    url: '/v1/alarm-management/alarmRealtime',
    method: 'put',
    data: data
  })
}

// 启停实时告警
export function changeAlarmRealtimeStatus(alarmRealtimeId) {
  var params = {};
  params.alarmRealtimeId = alarmRealtimeId;
  return request({
    url: '/v1/alarm-management/alarmRealtime/changeStatus',
    method: 'put',
    data: params
  })
}

// 删除实时告警
export function delAlarmRealtime(alarmRealtimeId) {
  return request({
    url: '/v1/alarm-management/alarmRealtime/' + alarmRealtimeId,
    method: 'delete'
  })
}

// 导出实时告警
export function exportAlarmRealtime(query) {
  return request({
    url: '/v1/alarm-management/alarmRealtime/export',
    method: 'get',
    params: query
  })
}