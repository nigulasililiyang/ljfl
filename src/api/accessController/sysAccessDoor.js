import request from '@/utils/request'

// 查询门列表
export function listDoor(query) {
  return request({
    url: '/accessController/sysAccessDoor/list',
    method: 'get',
    params: query
  })
}

// 查询门详细
export function getDoor(doorId) {
  return request({
    url: '/accessController/sysAccessDoor/' + doorId,
    method: 'get'
  })
}

// 新增门
export function addDoor(data) {
  return request({
    url: '/accessController/sysAccessDoor',
    method: 'post',
    data: data
  })
}

// 修改门
export function updateDoor(data) {
  return request({
    url: '/accessController/sysAccessDoor',
    method: 'put',
    data: data
  })
}

// 删除门
export function delDoor(doorId) {
  return request({
    url: '/accessController/sysAccessDoor/' + doorId,
    method: 'delete'
  })
}

// 导出门
export function exportDoor(query) {
  return request({
    url: '/accessController/sysAccessDoor/export',
    method: 'get',
    params: query
  })
}

// 门禁设备命令下发
export function remoteOpen(remoteOpen) {
  return request({
    url: '/accessController/sysAccessDoor/remoteOpen',
    method: 'post',
    data: remoteOpen
  })
}

// 门禁设备命令下发
export function remoteUpdate(remoteOpen) {
  return request({
    url: '/accessController/sysAccessDoor/remoteUpdate',
    method: 'post',
    data: remoteOpen
  })
}
