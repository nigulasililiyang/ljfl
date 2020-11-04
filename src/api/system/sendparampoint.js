import request from '@/utils/request'

// 查询下发参数列表
export function listSendparampoint(query) {
  return request({
    url: '/system/sendparampoint/list',
    method: 'get',
    params: query
  })
}

// 查询下发参数详细
export function getSendparampoint(sendParamPointId) {
  return request({
    url: '/system/sendparampoint/' + sendParamPointId,
    method: 'get'
  })
}

// 新增下发参数
export function addSendparampoint(data) {
  return request({
    url: '/system/sendparampoint',
    method: 'post',
    data: data
  })
}

// 修改下发参数
export function updateSendparampoint(data) {
  return request({
    url: '/system/sendparampoint',
    method: 'put',
    data: data
  })
}

// 删除下发参数
export function delSendparampoint(sendParamPointId) {
  return request({
    url: '/system/sendparampoint/' + sendParamPointId,
    method: 'delete'
  })
}

// 导出下发参数
export function exportSendparampoint(query) {
  return request({
    url: '/system/sendparampoint/export',
    method: 'get',
    params: query
  })
}