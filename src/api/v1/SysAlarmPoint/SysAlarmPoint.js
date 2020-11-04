import request from '@/utils/request'

// 查询告警点位映射，用于告警基础与点位模板的映射列表
export function listSysAlarmPoint(query) {
  return request({
    url: '/v1/SysAlarmPoint/SysAlarmPoint/list',
    method: 'get',
    params: query
  })
}

// 查询告警点位映射，用于告警基础与点位模板的映射详细
export function getSysAlarmPoint(alarmPointId) {
  return request({
    url: '/v1/SysAlarmPoint/SysAlarmPoint/' + alarmPointId,
    method: 'get'
  })
}

// 新增告警点位映射，用于告警基础与点位模板的映射
export function addSysAlarmPoint(data) {
  return request({
    url: '/v1/SysAlarmPoint/SysAlarmPoint',
    method: 'post',
    data: data
  })
}

// 修改告警点位映射，用于告警基础与点位模板的映射
export function updateSysAlarmPoint(data) {
  return request({
    url: '/v1/SysAlarmPoint/SysAlarmPoint',
    method: 'put',
    data: data
  })
}

// 修改是否使能工作流
export function changeWorkflowEnable(alarmPointId,workflowEnable) {
  const data = {
    alarmPointId,
    workflowEnable
  }
  return request({
    url: '/v1/SysAlarmPoint/SysAlarmPoint/changeWorkflowEnable',
    method: 'put',
    data: data
  })
}

// 删除告警点位映射，用于告警基础与点位模板的映射
export function delSysAlarmPoint(alarmPointId) {
  return request({
    url: '/v1/SysAlarmPoint/SysAlarmPoint/' + alarmPointId,
    method: 'delete'
  })
}

// 导出告警点位映射，用于告警基础与点位模板的映射
export function exportSysAlarmPoint(query) {
  return request({
    url: '/v1/SysAlarmPoint/SysAlarmPoint/export',
    method: 'get',
    params: query
  })
}
