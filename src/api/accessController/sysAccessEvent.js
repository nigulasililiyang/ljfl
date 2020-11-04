import request from '@/utils/request'

// 查询门禁记录列表
export function listEvent(query) {
  return request({
    url: '/accessController/sysAccessEvent/list',
    method: 'get',
    params: query
  })
}

// 查询门禁记录详细
export function getEvent(id) {
  return request({
    url: '/accessController/sysAccessEvent/' + id,
    method: 'get'
  })
}

// 新增门禁记录
export function addEvent(data) {
  return request({
    url: '/accessController/sysAccessEvent',
    method: 'post',
    data: data
  })
}

// 修改门禁记录
export function updateEvent(data) {
  return request({
    url: '/accessController/sysAccessEvent',
    method: 'put',
    data: data
  })
}

// 删除门禁记录
export function delEvent(id) {
  return request({
    url: '/accessController/sysAccessEvent/' + id,
    method: 'delete'
  })
}

// 导出门禁记录
export function exportEvent(query) {
  return request({
    url: '/accessController/sysAccessEvent/export',
    method: 'get',
    params: query
  })
}
